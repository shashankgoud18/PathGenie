import { redis } from '../config/redis.js';
import { supabase } from '../config/supabase.js';

export class CacheService {
  /**
   * Generates a unique cache key based on the parameters
   */
  static getRoadmapKey(skill, level, timeCommitment, learningStyle, goal, timeline) {
    const cleanSkill = skill.trim().toLowerCase();
    const cleanLevel = level.trim().toLowerCase();
    const cleanTime = timeCommitment.toString().trim().toLowerCase();
    const cleanStyle = (learningStyle || 'mixed').trim().toLowerCase();
    const cleanGoal = (goal || 'general mastery').trim().toLowerCase();
    const cleanTimeline = (timeline || '4').toString().trim().toLowerCase();
    
    return `roadmap:${cleanSkill}:${cleanLevel}:${cleanTime}:${cleanStyle}:${cleanGoal}:${cleanTimeline}`;
  }

  /**
   * Fetches cached roadmap from Upstash Redis or Postgres fallback
   */
  static async getRoadmap(key) {
    // 1. Try Redis first
    if (redis) {
      try {
        const cached = await redis.get(key);
        if (cached) {
          return typeof cached === 'string' ? JSON.parse(cached) : cached;
        }
      } catch (err) {
        // Silently fall back
      }
    }

    // 2. Try PostgreSQL cache table as fallback
    try {
      const { data: cached } = await supabase
        .from('roadmap_cache')
        .select('cached_data, access_count')
        .eq('cache_key', key)
        .single();

      if (cached) {
        // Increment PG access count asynchronously
        supabase
          .from('roadmap_cache')
          .update({ access_count: (cached.access_count || 0) + 1 })
          .eq('cache_key', key)
          .then();

        // Repopulate Redis in background
        if (redis) {
          redis.set(key, cached.cached_data, { ex: 604800 }).catch(() => {});
        }

        return cached.cached_data;
      }
    } catch (err) {
      // Silently return null
    }

    return null;
  }

  /**
   * Caches a newly generated roadmap in both Redis and PostgreSQL
   */
  static async setRoadmap(key, skill, level, timeCommitment, data) {
    // 1. Write to Redis (7 days TTL)
    if (redis) {
      try {
        await redis.set(key, data, { ex: 604800 });
      } catch (err) {
        // Ignore redis caching failure
      }
    }

    // 2. Write to PostgreSQL Cache Table
    try {
      await supabase
        .from('roadmap_cache')
        .insert({
          skill_name: skill,
          level,
          time_commitment: timeCommitment.toString(),
          cache_key: key,
          cached_data: data
        });
    } catch (err) {
      // Ignore database caching failure (might already exist)
    }
  }

  /**
   * Fetches cached YouTube search video payload
   */
  static async getYouTubeVideo(query, skill) {
    const key = `youtube:${query.toLowerCase()}:${skill.toLowerCase()}`;

    if (redis) {
      try {
        const cached = await redis.get(key);
        if (cached) {
          return typeof cached === 'string' ? JSON.parse(cached) : cached;
        }
      } catch (err) {
        // Ignore and fall back
      }
    }

    try {
      const { data: cached } = await supabase
        .from('youtube_cache')
        .select('video_data, access_count')
        .eq('search_query', query.toLowerCase())
        .eq('skill_name', skill.toLowerCase())
        .single();

      if (cached) {
        // Increment PG access count in the background
        supabase
          .from('youtube_cache')
          .update({ access_count: (cached.access_count || 0) + 1 })
          .eq('search_query', query.toLowerCase())
          .eq('skill_name', skill.toLowerCase())
          .then();

        if (redis) {
          redis.set(key, cached.video_data, { ex: 2592000 }).catch(() => {});
        }

        return cached.video_data;
      }
    } catch (err) {
      // Ignore and return null
    }

    return null;
  }

  /**
   * Caches YouTube search video results (30 days TTL)
   */
  static async setYouTubeVideo(query, skill, videoData) {
    const key = `youtube:${query.toLowerCase()}:${skill.toLowerCase()}`;

    if (redis) {
      try {
        await redis.set(key, videoData, { ex: 2592000 });
      } catch (err) {
        // Ignore caching failure
      }
    }

    try {
      await supabase
        .from('youtube_cache')
        .insert({
          search_query: query.toLowerCase(),
          skill_name: skill.toLowerCase(),
          video_data: videoData
        });
    } catch (err) {
      // Ignore database insert failure
    }
  }
}
