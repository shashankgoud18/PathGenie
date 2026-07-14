import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.string(),
  duration: z.string(),
  resource: z.string().optional()
});

export const weekSchema = z.object({
  week: z.number(),
  title: z.string(),
  description: z.string(),
  difficulty: z.string(),
  estimatedHours: z.string(),
  goals: z.array(z.string()),
  tasks: z.array(taskSchema),
  checkpoint: z.string().optional()
});

export const roadmapSchema = z.object({
  title: z.string(),
  duration: z.string(),
  totalHours: z.string(),
  motivationalTip: z.string().optional(),
  summary: z.string().optional(),
  weeks: z.array(weekSchema)
});

export type Task = z.infer<typeof taskSchema>;
export type Week = z.infer<typeof weekSchema>;
export type Roadmap = z.infer<typeof roadmapSchema>;
