import { Router } from 'express';
import { 
  generateRoadmap, 
  generateResources, 
  getUserRoadmaps, 
  getPublicRoadmaps,
  getRoadmapById, 
  deleteRoadmap,
  getTaskResources
} from '../controllers/roadmap.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { checkRateLimit } from '../middlewares/rateLimit.middleware.js';
import { validateGenerateRoadmap, validateGenerateResources } from '../validators/roadmap.validator.js';

const router = Router();

// Get public community roadmaps
router.get('/public', getPublicRoadmaps);

// Get resources for a specific task
router.get('/resources/:roadmapId/:taskId', getTaskResources);

// Get all roadmaps for authenticated user
router.get('/', requireAuth, getUserRoadmaps);

// Get single roadmap by ID
router.get('/:id', requireAuth, getRoadmapById);

// Delete roadmap by ID
router.delete('/:id', requireAuth, deleteRoadmap);

// Endpoint for cache-aside AI roadmap generation with monthly limits check
router.post('/generate', requireAuth, validateGenerateRoadmap, checkRateLimit('gemini'), generateRoadmap);

// Endpoint for focused learning resources generation (YouTube search + Gemini API)
router.post('/resources', requireAuth, validateGenerateResources, checkRateLimit('youtube'), generateResources);

export default router;
