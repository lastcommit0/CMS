import { z } from 'zod';

const inlineMarkSchema = z.union([
  z.object({ type: z.literal('bold'), start: z.number(), end: z.number() }),
  z.object({ type: z.literal('italic'), start: z.number(), end: z.number() }),
  z.object({ type: z.literal('underline'), start: z.number(), end: z.number() }),
  z.object({
    type: z.literal('link'),
    start: z.number(),
    end: z.number(),
    href: z.string().url(),
  }),
]);

const paragraphBlock = z.object({
  id: z.string(),
  type: z.literal('paragraph'),
  data: z.object({
    text: z.string(),
    marks: z.array(inlineMarkSchema).optional(),
  }),
});

const headingBlock = z.object({
  id: z.string(),
  type: z.literal('heading'),
  data: z.object({
    level: z.number().min(1).max(6),
    text: z.string(),
  }),
});

const assetBlock = (type: 'image' | 'video' | 'pdf') =>
  z.object({
    id: z.string(),
    type: z.literal(type),
    data: z.object({
      assetId: z.string(),
      caption: z.string().optional(),
    }),
  });

export const storyContentSchema = z.object({
  version: z.literal('1.0'),
  time: z.number().optional(),
  blocks: z
    .array(
      z.discriminatedUnion('type', [
        paragraphBlock,
        headingBlock,
        assetBlock('image'),
        assetBlock('video'),
        assetBlock('pdf'),
      ])
    )
    .min(1),
});

export const createStorySchema = z
  .object({
    title: z.string().min(1).max(500),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    excerpt: z.string().min(1).max(1000),
    content: storyContentSchema,

    storyType: z.enum(['NEWS', 'MAGAZINE', 'BLOG', 'VIDEO', 'PDF']),
    status: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'SCHEDULED']),

    priority: z.number().int().min(0).optional(),
    scheduleAt: z.iso.datetime().optional(),
    sectionIds: z.array(z.string()).optional(),

    metaTags: z.object({
      metaKeywords: z.string().optional(),
      metaDescription: z.string(),
      googleBot: z.enum(['ALLOW', 'DISALLOW']).optional(),
      excludeIA: z.boolean().optional(),
    }).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status === 'SCHEDULED' && !data.scheduleAt) {
      ctx.addIssue({
        path: ['scheduleAt'],
        message: 'scheduleAt required when status is SCHEDULED',
        code: z.ZodIssueCode.custom,
      });
    }
  });

export const addAssetSchema = z.object({
  type: z.enum(['IMAGE', 'VIDEO', 'PDF', 'AUDIO', 'DOCUMENT']),
  fileUrl: z.string().url(),
  metadata: z.any().optional()
});

export const updateStorySchema = createStorySchema.partial();


export const bulkStatusSchema = z.object({
  storyIds: z.array(z.string()),
  storyType: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'SCHEDULED']).optional(),
  published: z.boolean().optional()
});
