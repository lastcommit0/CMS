import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  parentId: z.string().nullable().optional(),
  isActive: z.boolean().optional()
});

export const updateCategorySchema = createCategorySchema.partial();

export const categoryListSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  isActive: z.string().optional(),
  parentId: z.string().optional()
});

export const bulkUpdateCategorySchema = z.object({
  categoryIds: z.array(z.string()).min(1),
  isActive: z.boolean()
});

export const bulkDeleteCategorySchema = z.object({
  categoryIds: z.array(z.string()).min(1)
});
