import { Router } from 'express';
import authRoutes from './auth.routes.js';
import roadmapRoutes from './roadmap.routes.js';
import paymentRoutes from './payment.routes.js';
import subscriptionRoutes from './subscription.routes.js';
import progressRoutes from './progress.routes.js';
import contactRoutes from './contact.routes.js';

const router = Router();

// Mount APIs
router.use('/auth', authRoutes);
router.use('/roadmap', roadmapRoutes);
router.use('/payment', paymentRoutes);
router.use('/subscription', subscriptionRoutes);
router.use('/progress', progressRoutes);
router.use('/contact', contactRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ success: true, status: 'healthy', timestamp: new Date().toISOString() });
});

export default router;
