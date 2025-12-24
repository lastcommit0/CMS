import { z } from 'zod';

export const updatePrioritySchema = z.object({
  priority: z.number().int().min(0)
});

export const bulkPrioritySchema = z.object({
  updates: z.array(
    z.object({
      storyId: z.string(),
      sectionId: z.string(),
      priority: z.number().int().min(0)
    })
  )
});
