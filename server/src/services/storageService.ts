import { file } from "zod";
import { upload } from "../config/storage";
import prisma from '../db';


interface CreateMediaInput {
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    path: string;
    uploadedBy: string;
}

export const mediaService = {
    async createVideo(input: CreateMediaInput) {
        return prisma.media.create({
            data: {
                filename: input.filename,
                originalName: input.originalName,
                mimeType: input.mimeType,
                size: input.size,
                path: input.path,
                uploadedBy: input.uploadedBy,
                type: "VIDEO",
            }
        });
    },

    async createImage(input: CreateMediaInput) {
        return prisma.media.create({
            data: {
                filename: input.filename,
                originalName: input.originalName,
                mimeType: input.mimeType,
                size: input.size,
                path: input.path,
                uploadedBy: input.uploadedBy,
                type: "IMAGE",
            }
        });
    },

    async createPdf(input: CreateMediaInput) {
        return prisma.media.create({
            data: {
                filename: input.filename,
                originalName: input.originalName,
                mimeType: input.mimeType,
                size: input.size,
                path: input.path,
                uploadedBy: input.uploadedBy,
                type: "PDF",
            }
        });
    }
};

