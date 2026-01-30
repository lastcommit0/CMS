import z from 'zod';

export const EpaperSchema = z.object({
  title: z.string().min(1),
  type: z.enum(["E_PAPER", "MAGAZINE"]),
  pdfUrl: z.string().min(1),
  pages: z.array(z.string()).min(1),
  authorId: z.string(),
});
