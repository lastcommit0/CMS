import z from 'zod';

export const EpaperSchema = z.object({
    title: z.string().min(1),
    type: z.enum(['E_PAPER', 'MAGAZINE']),
    coverImage: z.string().min(1),
    pdfFile: z.string().min(1),
    pages: z.array(z.string()).min(1, "At least one page is required"),
})