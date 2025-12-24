import { z } from 'zod';

export const createPollSchema = z.object({
  question: z.string().min(5).max(500),
  storyId: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'EXPIRED']).optional(),
  expiresAt: z.string().datetime().optional(),
  options: z.array(
    z.object({
      text: z.string().min(1).max(200)
    })
  ).min(2)
});

export const updatePollSchema = z.object({
  question: z.string().min(5).max(500).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'EXPIRED']).optional(),
  expiresAt: z.string().datetime().optional()
});

export const voteSchema = z.object({
  optionId: z.string()
});

export const addOptionSchema = z.object({
  text: z.string().min(1).max(200)
});

export const pollListSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  status: z.string().optional(),
  storyId: z.string().optional()
});
