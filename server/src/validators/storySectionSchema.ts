import { z } from "zod";

export const addStorySchema = z.object({
  storyId: z.string(),
  priority: z.number().int().min(0).optional(),
  isFeatured: z.boolean().optional(),
});
