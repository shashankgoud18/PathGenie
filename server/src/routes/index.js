import { Router } from 'express';
import roadmapRoutes from './roadmap.routes.js';
import paymentRoutes from './payment.routes.js';

const router = Router();

// Mount APIs
router.use('/roadmap', roadmapRoutes);
router.use('/payment', paymentRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ success: true, status: 'healthy', timestamp: new Date().toISOString() });
});

export default router;
