import { z } from 'zod';

export const searchSchema = z.object({
  q: z.string().min(1),
  type: z.enum(['all', 'story', 'user', 'section', 'category', 'poll']).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  offset: z.coerce.number().min(0).optional(),
  status: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  section: z.string().optional(),
});