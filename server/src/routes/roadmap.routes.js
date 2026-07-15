import { Router } from 'express';
import { generateRoadmap, generateResources } from '../controllers/roadmap.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { checkRateLimit } from '../middlewares/rateLimit.middleware.js';
import { validateGenerateRoadmap, validateGenerateResources } from '../validators/roadmap.validator.js';

const router = Router();

// Endpoint for cache-aside AI roadmap generation with monthly limits check
router.post('/generate', requireAuth, validateGenerateRoadmap, checkRateLimit('gemini'), generateRoadmap);

// Endpoint for focused learning resources generation (YouTube search + Gemini API)
router.post('/resources', requireAuth, validateGenerateResources, checkRateLimit('youtube'), generateResources);

export default router;
