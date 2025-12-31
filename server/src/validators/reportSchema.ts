import { z } from "zod";

export const generateReportSchema = z.object({
  type: z.enum(["STORIES", "USERS", "POLLS", "ANALYTICS", "SYSTEM_HEALTH"]),
  filters: z.record(z.string(), z.any()), 
  format: z.enum(["JSON", "CSV", "PDF"]).optional(),
});
