import { z } from "zod";
import { Role } from '../generated/prisma/client'

export const createUserSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  role: z.enum(Role)
});
