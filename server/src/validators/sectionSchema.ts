import { z } from 'zod';

export const createSectionSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  isActive: z.boolean().optional()
});

export const updateSectionSchema = createSectionSchema.partial();

export const addStorySchema = z.object({
  storyId: z.string(),
  priority: z.number().int().min(0).optional(),
  isFeatured: z.boolean().optional()
});

export const setFeaturedSchema = z.object({
  isFeatured: z.boolean()
});
