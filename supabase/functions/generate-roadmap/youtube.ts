import { redis } from './redis.ts';
import { checkAndIncrementRateLimit } from './rate-limit.ts';

const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY');

export async function getCachedYouTubeVideo(supabase: any, searchQuery: string, skill: string) {
  const cacheKey = `youtube:${searchQuery.toLowerCase()}:${skill.toLowerCase()}`;
  
  if (redis) {
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log('⚡ Redis YouTube Cache Hit for:', cacheKey);
        return typeof cached === 'string' ? JSON.parse(cached) : cached;
      }
    } catch (e) {
      console.error('❌ Redis YouTube cache read error:', e);
    }
  }

  const { data: cached } = await supabase
    .from('youtube_cache')
    .select('video_data, access_count')
    .eq('search_query', searchQuery.toLowerCase())
    .eq('skill_name', skill.toLowerCase())
    .single();

  if (cached) {
    supabase
      .from('youtube_cache')
      .update({ access_count: (cached.access_count || 0) + 1 })
      .eq('search_query', searchQuery.toLowerCase())
      .eq('skill_name', skill.toLowerCase())
      .then();
    
    console.log('✅ PostgreSQL YouTube Cache Hit for:', searchQuery);
    
    if (redis) {
      redis.set(cacheKey, cached.video_data, { ex: 2592000 }).catch(err => console.error('Redis YouTube populate error:', err));
    }
    
    return cached.video_data;
  }

  return null;
}

export async function cacheYouTubeVideo(supabase: any, searchQuery: string, skill: string, videoData: any) {
  const cacheKey = `youtube:${searchQuery.toLowerCase()}:${skill.toLowerCase()}`;
  
  if (redis) {
    try {
      await redis.set(cacheKey, videoData, { ex: 2592000 });
      console.log('⚡ Cached YouTube video in Redis:', cacheKey);
    } catch (e) {
      console.error('❌ Failed to cache YouTube video in Redis:', e);
    }
  }

  try {
    await supabase
      .from('youtube_cache')
      .insert({
        search_query: searchQuery.toLowerCase(),
        skill_name: skill.toLowerCase(),
        video_data: videoData
      });
    console.log('✅ Cached YouTube video in PostgreSQL:', searchQuery);
  } catch (e) {
    console.log('YouTube cache insert failed:', e.message);
  }
}

export async function getYouTubeData(supabase: any, searchQuery: string, skill: string, userId: string, userTier: string) {
  const cached = await getCachedYouTubeVideo(supabase, searchQuery, skill);
  if (cached) return cached;

  const isAllowed = await checkAndIncrementRateLimit(supabase, userId, 'youtube', 'search', userTier);
  if (!isAllowed) {
    console.log('❌ YouTube API rate limit exceeded for user');
    return null;
  }

  if (!YOUTUBE_API_KEY) {
    console.log('❌ YouTube API key not found');
    return null;
  }

  const queries = [
    `${skill} ${searchQuery} tutorial beginner`,
    `${skill} ${searchQuery} programming course`,
    `learn ${skill} ${searchQuery} step by step`
  ];
  
  for (const query of queries) {
    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=3&safeSearch=strict&relevanceLanguage=en&order=relevance&videoDuration=medium&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!res.ok) continue;
      
      const json = await res.json();
      if (json.items && json.items.length > 0) {
        const video = json.items[0];
        const result = {
          youtubeLink: `https://www.youtube.com/watch?v=${video.id.videoId}`,
          youtubeThumbnail: video.snippet.thumbnails?.medium?.url,
          youtubeTitle: video.snippet.title
        };
        
        await cacheYouTubeVideo(supabase, searchQuery, skill, result);
        return result;
      }
    } catch (e) {
      console.error('YouTube API error:', e);
      continue;
    }
  }
  
  return null;
}
