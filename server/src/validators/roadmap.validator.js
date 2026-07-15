import { z } from 'zod';

const generateRoadmapSchema = z.object({
  skill: z.string({ required_error: 'Skill name is required' }).trim().min(1, 'Skill name cannot be empty'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced'], {
    errorMap: () => ({ message: "Level must be 'Beginner', 'Intermediate', or 'Advanced'" })
  }),
  timeCommitment: z.union([z.string(), z.number()]).transform((val) => {
    const num = Number(val);
    if (isNaN(num) || num <= 0) {
      throw new Error('Weekly time commitment must be a valid number greater than 0');
    }
    return num;
  }),
  learningStyle: z.string().optional().default('Mixed'),
  goal: z.string().optional().default(''),
  timeline: z.union([z.string(), z.number()]).optional().transform((val) => {
    if (val === undefined) return 4;
    const num = Number(val);
    if (isNaN(num) || num < 1 || num > 12) {
      throw new Error('Timeline weeks must be between 1 and 12');
    }
    return num;
  })
});

export const validateGenerateRoadmap = (req, res, next) => {
  try {
    const result = generateRoadmapSchema.safeParse(req.body);
    if (!result.success) {
      const errorMsg = result.error.errors.map(e => e.message).join(', ');
      return res.status(400).json({ error: errorMsg });
    }
    req.validatedBody = result.data;
    next();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const generateResourcesSchema = z.object({
  taskId: z.string({ required_error: 'taskId is required' }).trim().min(1),
  skillName: z.string({ required_error: 'skillName is required' }).trim().min(1),
  taskTitle: z.string({ required_error: 'taskTitle is required' }).trim().min(1),
  taskType: z.string({ required_error: 'taskType is required' }).trim().min(1),
  roadmapId: z.string({ required_error: 'roadmapId is required' }).trim().min(1)
});

export const validateGenerateResources = (req, res, next) => {
  const result = generateResourcesSchema.safeParse(req.body);
  if (!result.success) {
    const errorMsg = result.error.errors.map(e => e.message).join(', ');
    return res.status(400).json({ error: errorMsg });
  }
  req.validatedBody = result.data;
  next();
};

