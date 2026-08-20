import { Router } from 'express';
import { getSubscriptionStatus } from '../controllers/subscription.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/status', requireAuth, getSubscriptionStatus);

export default router;
