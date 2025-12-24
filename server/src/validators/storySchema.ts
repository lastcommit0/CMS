import { z } from 'zod';

export const createStorySchema = z.object({
  title: z.string().min(1).max(500),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().min(1).max(1000),
  content: z.any(),
  storyType: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'SCHEDULED']),
  status: z.enum(['NEWS', 'MAGAZINE', 'BLOG', 'VIDEO', 'PDF']),
  priority: z.number().int().min(0).optional(),
  scheduleAt: z.string().datetime().optional(),
  sectionIds: z.array(z.string()).optional(),
  metaTags: z.object({
    metaKeywords: z.string().optional(),
    metaDescription: z.string(),
    ogTitle: z.string().optional(),
    ogDescription: z.string().optional(),
    ogImage: z.string().url().optional()
  }).optional()
});

export const updateStorySchema = createStorySchema.partial();

export const addAssetSchema = z.object({
  type: z.enum(['IMAGE', 'VIDEO', 'PDF', 'AUDIO', 'DOCUMENT']),
  fileUrl: z.string().url(),
  metadata: z.any().optional()
});

export const bulkStatusSchema = z.object({
  storyIds: z.array(z.string()),
  storyType: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'SCHEDULED']).optional(),
  published: z.boolean().optional()
});
