import { z } from 'zod';

export const metaTagSchema = z.object({
  metaKeywords: z.string().optional(),
  metaDescription: z.string().min(1).max(500),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().url().optional()
});

export const bulkGenerateMetaSchema = z.object({
  storyIds: z.array(z.string())
});
