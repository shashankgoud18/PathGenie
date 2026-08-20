import { Router } from 'express';
import {
  getRoadmapProgress,
  upsertTaskProgress,
  bulkCompleteWeek,
} from '../controllers/progress.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// All progress routes require authentication
router.get('/:roadmapId', requireAuth, getRoadmapProgress);
router.post('/:roadmapId', requireAuth, upsertTaskProgress);
router.post('/:roadmapId/bulk', requireAuth, bulkCompleteWeek);

export default router;
