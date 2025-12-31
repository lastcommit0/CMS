import { z } from "zod";
import { Designation } from "../generated/prisma/enums";


export const registerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.email(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  password: z.string().min(8),
  role: z.enum(['ADMIN', 'SUB_ADMIN', 'EDITOR']),
  designation: z.enum(['EDITOR_IN_CHIEF', 'MANAGING_EDITOR', 'EDITOR', 'WRITER', 'CONTRIBUTOR']),
  jobType: z.enum(['FULL_TIME', 'PART_TIME', 'FREELANCE', 'INTERN']),
  location: z.string().optional(),
  bio: z.string()
})

export const loginSchema = z.object({
  identifier: z.email(),
  password: z.string().min(8),
  captcha: z.string()
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1)
});

export const identifySchema = z.object({
  identifier: z.email()
});
