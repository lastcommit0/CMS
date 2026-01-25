// server/src/validators/userSchema.ts
import { z } from "zod";

export const updateUserSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
    password: z.string().min(8).optional(),
    designation: z.enum([
        'OPERATIONS_MANAGER',
        'COMMUNITY_MODERATOR',
        'COMPLIANCE_OFFICER',
        'EDITOR_IN_CHIEF',
        'MANAGING_EDITOR',
        'SENIOR_EDITOR',
        'COPY_EDITOR',
        'SEO_EDITOR'
    ]).optional(),
    jobType: z.enum(['FULL_TIME', 'PART_TIME', 'INTERN', 'FREELANCE']).optional(),
    location: z.string().optional(),
    bio: z.string().optional(),
    avatar: z.string().url().optional(),
    managerId: z.string().optional(),
    status: z.enum(['ACTIVE', 'SUSPENDED', 'DEACTIVATED']).optional(),
});

export const changePasswordSchema = z.object({
    currentPassword: z.string(),
    newPassword: z.string().min(8).max(100)
});