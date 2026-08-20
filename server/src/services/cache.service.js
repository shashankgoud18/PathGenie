import { redis } from '../config/redis.js';
import { query } from '../config/db.js';

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
      const res = await query(
        `SELECT cached_data, access_count FROM roadmap_cache WHERE cache_key = $1 LIMIT 1`,
        [key]
      );

      if (res.rows.length > 0) {
        const cached = res.rows[0];

        // Increment PG access count asynchronously
        query(
          `UPDATE roadmap_cache SET access_count = COALESCE(access_count, 0) + 1 WHERE cache_key = $1`,
          [key]
        ).catch(() => {});

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
      await query(
        `INSERT INTO roadmap_cache (skill_name, level, time_commitment, cache_key, cached_data)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (cache_key) DO UPDATE SET cached_data = $5`,
        [skill, level, timeCommitment.toString(), key, JSON.stringify(data)]
      );
    } catch (err) {
      // Ignore database caching failure
    }
  }

  /**
   * Fetches cached YouTube search video payload
   */
  static async getYouTubeVideo(searchQuery, skill) {
    const key = `youtube:${searchQuery.toLowerCase()}:${skill.toLowerCase()}`;

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
      const res = await query(
        `SELECT video_data, access_count FROM youtube_cache WHERE search_query = $1 AND skill_name = $2 LIMIT 1`,
        [searchQuery.toLowerCase(), skill.toLowerCase()]
      );

      if (res.rows.length > 0) {
        const cached = res.rows[0];

        query(
          `UPDATE youtube_cache SET access_count = COALESCE(access_count, 0) + 1 WHERE search_query = $1 AND skill_name = $2`,
          [searchQuery.toLowerCase(), skill.toLowerCase()]
        ).catch(() => {});

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
  static async setYouTubeVideo(searchQuery, skill, videoData) {
    const key = `youtube:${searchQuery.toLowerCase()}:${skill.toLowerCase()}`;

    if (redis) {
      try {
        await redis.set(key, videoData, { ex: 2592000 });
      } catch (err) {
        // Ignore caching failure
      }
    }

    try {
      await query(
        `INSERT INTO youtube_cache (search_query, skill_name, video_data)
         VALUES ($1, $2, $3)
         ON CONFLICT (search_query, skill_name) DO UPDATE SET video_data = $3`,
        [searchQuery.toLowerCase(), skill.toLowerCase(), JSON.stringify(videoData)]
      );
    } catch (err) {
      // Ignore database insert failure
    }
  }
}
