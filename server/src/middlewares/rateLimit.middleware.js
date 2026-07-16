import { redis } from '../config/redis.js';
import { supabase } from '../config/supabase.js';

const LIMITS = {
  gemini: 1000,   // Roadmap generation limit (monthly)
  youtube: 1000,  // YouTube search limit (monthly)
  general: 100   // General endpoint limit (e.g., requests per window)
};

export const checkRateLimit = (apiType) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ error: 'Authentication required for rate limit validation' });
      }

      // Check if user is a Pro subscriber to bypass rate limits
      const { data: subscriber } = await supabase
        .from('subscribers')
        .select('subscribed, subscription_tier, subscription_end')
        .eq('user_id', user.id)
        .maybeSingle();

      const isPro = subscriber && subscriber.subscribed && 
        (!subscriber.subscription_end || new Date(subscriber.subscription_end) > new Date()) &&
        subscriber.subscription_tier === 'pro';

      if (isPro) {
        return next(); // Pro users bypass limits
      }

      const limit = LIMITS[apiType] || LIMITS.general;
      const now = new Date();
      const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      // Redis check
      if (redis) {
        const redisLimitKey = `ratelimit:${user.id}:${apiType}:${monthStart}`;
        const currentVal = await redis.get(redisLimitKey) || 0;

        if (currentVal >= limit) {
          return res.status(429).json({ 
            error: `Monthly rate limit exceeded for ${apiType}. Upgrade to Pro for unlimited access!` 
          });
        }

        // Increment atomically
        const newVal = await redis.incr(redisLimitKey);
        if (newVal === 1) {
          await redis.expire(redisLimitKey, 35 * 24 * 60 * 60); // 35 days expiry
        }

        // Log usage to DB in the background
        logUsageToDB(user.id, apiType, req.path).catch(() => {});
        return next();
      }

      // PostgreSQL fallback check-and-increment via database RPC function
      const { data: allowed, error } = await supabase.rpc('check_and_increment_api_usage', {
        p_user_id: user.id,
        p_api_type: apiType,
        p_endpoint: req.path,
        p_limit: limit
      });

      if (error) throw error;

      if (!allowed) {
        return res.status(429).json({ 
          error: `Monthly rate limit exceeded for ${apiType}. Upgrade to Pro for unlimited access!` 
        });
      }

      next();

    } catch (err) {
      return res.status(503).json({
        error: 'Rate limiting verification service is temporarily unavailable. Please try again later.'
      });
    }
  };
};

async function logUsageToDB(userId, apiType, endpoint) {
  const today = new Date().toISOString().split('T')[0];
  
  const { data: existing } = await supabase
    .from('api_usage_tracking')
    .select('id, request_count')
    .eq('user_id', userId)
    .eq('api_type', apiType)
    .eq('date', today)
    .single();

  if (existing) {
    await supabase
      .from('api_usage_tracking')
      .update({ 
        request_count: existing.request_count + 1,
        endpoint 
      })
      .eq('id', existing.id);
  } else {
    await supabase
      .from('api_usage_tracking')
      .insert({
        user_id: userId,
        api_type: apiType,
        endpoint,
        request_count: 1,
        date: today
      });
  }
}
