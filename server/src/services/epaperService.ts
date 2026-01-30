import prisma from "../db";
import { EpaperInput } from "../types/EpaperTypes";


export const EpaperService = {
  async createEpaper(input: EpaperInput) {
    return prisma.ePaper.create({
      data: {
        title: input.title.trim(),
        type: input.type,

        author: { connect: { id: input.authorId } },

        pdf: { connect: { id: input.pdfUrl } },

        pages: {
          create: input.pages.map((mediaId, index) => ({
            order: index + 1,
            media: { connect: { id: mediaId } }
          }))
        }
      },
      include: {
        pdf: {
          select: { fileUrl: true, size: true }
        },
        pages: {
          orderBy: { order: 'asc' },
          include: {
            media: { select: { fileUrl: true, mimeType: true } }
          }
        }
      }
    });
  },

  async updateEPaper(id: string, input: EpaperInput) {
    const epaper = await prisma.ePaper.update({
      where: { id },
      data: {
        title: input.title.trim(),
        type: input.type,
        author: { connect: { id: input.authorId } },
        pdf: { connect: { id: input.pdfUrl } },
        pages: {
          create: input.pages.map((mediaId, index) => ({
            order: index + 1,
            media: { connect: { id: mediaId } }
          }))
        }
      },
      include: {
        pdf: {
          select: { fileUrl: true, size: true }
        },
        pages: {
          orderBy: { order: 'asc' },
          include: {
            media: { select: { fileUrl: true, mimeType: true } }
          }
        }
      }
    });
    if (!epaper) {
      throw new Error('Failed to update ePaper');
    }
    return epaper;
  },

  async deleteEPaper(id: string) {
    return prisma.ePaper.delete({
      where: { id }
    });
  },

  async getAllEPapers() {
    return prisma.ePaper.findMany({
      include: {
        pdf: {
          select: { fileUrl: true, size: true }
        },
        pages: {
          orderBy: { order: 'asc' },
          include: {
            media: { select: { fileUrl: true, mimeType: true } }
          }
        }
      }
    }); 
  },

  async getEPaperById(id: string) {
    return prisma.ePaper.findUnique({
      where: { id },
      include: {
        pdf: {
          select: { fileUrl: true, size: true }
        },
        pages: {
          orderBy: { order: 'asc' },
          include: {
            media: { select: { fileUrl: true, mimeType: true } }
          }
        }
      }
    });
  }
};