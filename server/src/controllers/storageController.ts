import { Request, Response } from "express";
import { upload } from "../config/storage";
import CustomError from "../errors/customError";
import { ErrorCode } from "../errors/errorCode";
import { mediaService } from "../services/storageService";



export const mediaController = {

    uploadImage: async (req: Request, res: Response)=> {
        try{
            const userId = req.user!.id;
            if(!userId) {
                return res.status(400).json({
                    success: false,
                    error: new CustomError(ErrorCode.AUTH_INVALID_CREDENTIALS)
                });
            }
            if(!req.file) {
                return res.status(400).json({
                    success: false,
                    error: new CustomError(ErrorCode.MEDIA_UPLOAD_FAILED)
                });
            }

            const file = req.file as any;

            const media = await mediaService.createImage({
                filename: file.originalname,
                originalName: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
                path: file.path,
                uploadedBy: userId
            });
        }
    }
}