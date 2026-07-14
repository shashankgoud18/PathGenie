import { redis } from './redis.ts';
import { checkRateLimit, incrementUsage } from './db.ts';

const FREE_TIER_LIMITS = {
  gemini: 1000,      // 1000 roadmap generations per month (testing)
  youtube: 1000     // 1000 YouTube searches per month (testing)
};

export async function checkAndIncrementRateLimit(supabase: any, userId: string, apiType: string, endpoint: string, userTier: string) {
  if (userTier === 'pro') return true;
  
  const limit = FREE_TIER_LIMITS[apiType as keyof typeof FREE_TIER_LIMITS] || 0;
  const now = new Date();
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  // Try Redis first for atomic rate limiting
  if (redis) {
    const redisLimitKey = `ratelimit:${userId}:${apiType}:${monthStart}`;
    try {
      const currentVal = await redis.get<number>(redisLimitKey) || 0;
      if (currentVal >= limit) {
        console.log(`❌ Redis Rate Limit Exceeded for user ${userId} (${apiType}): ${currentVal}/${limit}`);
        return false;
      }
      
      // Increment atomically
      const newVal = await redis.incr(redisLimitKey);
      if (newVal === 1) {
        await redis.expire(redisLimitKey, 35 * 24 * 60 * 60);
      }
      
      // Sync to PG tracking asynchronously
      incrementUsage(supabase, userId, apiType, endpoint).catch(err => console.error('PG usage increment error:', err));
      
      console.log(`⚡ Redis Atomic Rate Limit incremented for ${userId} (${apiType}): ${newVal}/${limit}`);
      return true;
    } catch (e) {
      console.error('❌ Redis rate limit check failed, falling back to PostgreSQL:', e);
    }
  }

  // Fallback to PostgreSQL check-and-increment via database RPC function
  try {
    const { data: allowed, error } = await supabase.rpc('check_and_increment_api_usage', {
      p_user_id: userId,
      p_api_type: apiType,
      p_endpoint: endpoint,
      p_limit: limit
    });
    
    if (error) throw error;
    return !!allowed;
  } catch (err) {
    console.error('💥 Fallback PostgreSQL rate limiting failed:', err);
    const allowed = await checkRateLimit(supabase, userId, apiType, limit);
    if (allowed) {
      await incrementUsage(supabase, userId, apiType, endpoint);
    }
    return allowed;
  }
}
