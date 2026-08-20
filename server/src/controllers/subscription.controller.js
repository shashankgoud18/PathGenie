import { query } from '../config/db.js';

export const getSubscriptionStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch subscriber tier
    const subRes = await query(
      `SELECT subscribed, subscription_tier, subscription_end FROM subscribers WHERE user_id = $1`,
      [userId]
    );

    const subscriber = subRes.rows[0];

    const isActive = subscriber && subscriber.subscribed &&
      (!subscriber.subscription_end || new Date(subscriber.subscription_end) > new Date());

    const subscription = {
      tier: isActive ? subscriber.subscription_tier : 'free',
      subscribed: !!isActive,
      subscription_end: subscriber?.subscription_end || null
    };

    // Fetch usage for current month
    const now = new Date();
    const firstDayOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

    const usageRes = await query(
      `SELECT api_type, COALESCE(SUM(request_count), 0) AS total
       FROM api_usage_tracking
       WHERE user_id = $1 AND date >= $2
       GROUP BY api_type`,
      [userId, firstDayOfMonth]
    );

    const usage = { gemini: 0, youtube: 0 };
    usageRes.rows.forEach(row => {
      if (row.api_type === 'gemini') usage.gemini = parseInt(row.total);
      if (row.api_type === 'youtube') usage.youtube = parseInt(row.total);
    });

    return res.status(200).json({
      success: true,
      subscription,
      usage
    });
  } catch (err) {
    next(err);
  }
};
