import { RoadmapService } from '../services/roadmap.service.js';

export const generateRoadmap = async (req, res, next) => {
  try {
    const userId = req.user.id;
    // req.validatedBody is populated by validateGenerateRoadmap validator middleware
    const result = await RoadmapService.generateRoadmap(userId, req.validatedBody);
    
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const generateResources = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await RoadmapService.generateResources(userId, req.validatedBody);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

