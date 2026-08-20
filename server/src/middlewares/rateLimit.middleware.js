import { redis } from '../config/redis.js';
import { query } from '../config/db.js';

const LIMITS = {
  gemini: 10,   // Roadmap generation limit (monthly)
  youtube: 10,  // YouTube search limit (monthly)
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
      const subResult = await query(
        `SELECT subscribed, subscription_tier, subscription_end FROM subscribers WHERE user_id = $1`,
        [user.id]
      );

      const subscriber = subResult.rows[0];
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

      // PostgreSQL fallback check-and-increment
      const today = new Date().toISOString().split('T')[0];
      const monthFirstDay = `${monthStart}-01`;

      const usageResult = await query(
        `SELECT COALESCE(SUM(request_count), 0) AS total 
         FROM api_usage_tracking 
         WHERE user_id = $1 AND api_type = $2 AND date >= $3`,
        [user.id, apiType, monthFirstDay]
      );

      const currentTotal = parseInt(usageResult.rows[0]?.total || '0');

      if (currentTotal >= limit) {
        return res.status(429).json({ 
          error: `Monthly rate limit exceeded for ${apiType}. Upgrade to Pro for unlimited access!` 
        });
      }

      logUsageToDB(user.id, apiType, req.path).catch(() => {});
      next();

    } catch (err) {
      console.error('Rate limit error:', err);
      // In case of error, allow request to proceed to avoid breaking UX
      next();
    }
  };
};

async function logUsageToDB(userId, apiType, endpoint) {
  const today = new Date().toISOString().split('T')[0];
  
  const existing = await query(
    `SELECT id, request_count FROM api_usage_tracking WHERE user_id = $1 AND api_type = $2 AND date = $3`,
    [userId, apiType, today]
  );

  if (existing.rows.length > 0) {
    await query(
      `UPDATE api_usage_tracking SET request_count = request_count + 1, endpoint = $1 WHERE id = $2`,
      [endpoint, existing.rows[0].id]
    );
  } else {
    await query(
      `INSERT INTO api_usage_tracking (user_id, api_type, endpoint, request_count, date)
       VALUES ($1, $2, $3, 1, $4)`,
      [userId, apiType, endpoint, today]
    );
  }
}
