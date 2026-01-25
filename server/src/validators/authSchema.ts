// server/src/validators/authSchema.ts
import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  password: z.string().min(8),
  role: z.enum(['ADMIN', 'SUB_ADMIN', 'EDITOR']),
  designation: z.enum([
    'OPERATIONS_MANAGER',
    'COMMUNITY_MODERATOR',
    'COMPLIANCE_OFFICER',
    'EDITOR_IN_CHIEF',
    'MANAGING_EDITOR',
    'SENIOR_EDITOR',
    'COPY_EDITOR',
    'SEO_EDITOR'
  ]),
  jobType: z.enum(['FULL_TIME', 'PART_TIME', 'FREELANCE', 'INTERN']),
  location: z.string().optional(),
  bio: z.string(),
  managerId: z.string().optional(),
  avatar: z.string().url().optional(),
});

export const loginSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(8),
  captcha: z.string().optional()
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1).optional()
});

export const identifySchema = z.object({
  identifier: z.string().min(1)
});