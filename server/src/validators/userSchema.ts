import { z } from "zod";

export const updateUserSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
    role: z.enum(['ADMIN', 'SUB_ADMIN', 'EDITOR']).optional(),
    status: z.enum(['ACTIVE', 'SUSPENDED', 'DEACTIVATED']).optional(),
    managerId: z.string().optional()
})


export const updateProfileSchema = z.object({
  designation: z.enum(['EDITOR_IN_CHIEF', 'MANAGING_EDITOR', 'EDITOR', 'WRITER', 'CONTRIBUTOR']).optional(),
  jobType: z.enum(['FULL_TIME', 'PART_TIME', 'INTERN', 'FREELANCE']).optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().url().optional()
});

export const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8).max(100)
})