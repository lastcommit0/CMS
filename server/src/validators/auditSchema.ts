import { z } from "zod";

export const auditListSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),

  userId: z.string().optional(),
  action: z.string().optional(),
  resource: z.string().optional(),

  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export const auditTimelineSchema = z.object({
  userId: z.string().optional(),
  resource: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
});

export const auditExportSchema = z.object({
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  format: z.enum(["JSON", "CSV"]).default("JSON"),
});
