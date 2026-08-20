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

export const getUserRoadmaps = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const roadmaps = await RoadmapService.getUserRoadmaps(userId);
    res.status(200).json({ success: true, roadmaps });
  } catch (err) {
    next(err);
  }
};

export const getPublicRoadmaps = async (req, res, next) => {
  try {
    const roadmaps = await RoadmapService.getPublicRoadmaps();
    res.status(200).json({ success: true, roadmaps });
  } catch (err) {
    next(err);
  }
};

export const getRoadmapById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const roadmap = await RoadmapService.getRoadmapById(id, userId);
    res.status(200).json({ success: true, roadmap });
  } catch (err) {
    next(err);
  }
};

export const deleteRoadmap = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const result = await RoadmapService.deleteRoadmap(id, userId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getTaskResources = async (req, res, next) => {
  try {
    const { roadmapId, taskId } = req.params;
    const resources = await RoadmapService.getTaskResources(roadmapId, taskId);
    res.status(200).json({ success: true, resources });
  } catch (err) {
    next(err);
  }
};
