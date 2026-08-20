import { query } from '../config/db.js';

/**
 * GET /api/progress/:roadmapId
 * Returns all completed task IDs for a roadmap (as an array of strings).
 */
export const getRoadmapProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { roadmapId } = req.params;

    const result = await query(
      `SELECT task_id FROM task_progress
       WHERE user_id = $1 AND roadmap_id = $2 AND completed = true`,
      [userId, roadmapId]
    );

    const completedTaskIds = result.rows.map((r) => r.task_id);

    return res.status(200).json({ success: true, completedTaskIds });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/progress/:roadmapId
 * Body: { taskId: string, completed: boolean }
 * Upserts a single task completion record.
 */
export const upsertTaskProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { roadmapId } = req.params;
    const { taskId, completed } = req.body;

    if (!taskId || typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'taskId and completed (boolean) are required' });
    }

    const completedAt = completed ? new Date().toISOString() : null;

    await query(
      `INSERT INTO task_progress (user_id, roadmap_id, task_id, completed, completed_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT (user_id, roadmap_id, task_id)
       DO UPDATE SET completed = $4, completed_at = $5, updated_at = NOW()`,
      [userId, roadmapId, taskId, completed, completedAt]
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/progress/:roadmapId/bulk
 * Body: { taskIds: string[] }
 * Marks all taskIds as completed (used for "complete week" action).
 */
export const bulkCompleteWeek = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { roadmapId } = req.params;
    const { taskIds } = req.body;

    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({ error: 'taskIds array is required' });
    }

    const now = new Date().toISOString();

    // Batch upsert using unnest for efficiency
    await query(
      `INSERT INTO task_progress (user_id, roadmap_id, task_id, completed, completed_at, updated_at)
       SELECT $1, $2, unnest($3::text[]), true, $4, NOW()
       ON CONFLICT (user_id, roadmap_id, task_id)
       DO UPDATE SET completed = true, completed_at = $4, updated_at = NOW()`,
      [userId, roadmapId, taskIds, now]
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};
