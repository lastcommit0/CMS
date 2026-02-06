import { Request, Response } from "express";
import { EpaperSchema } from "../validators/epaperSchema";
import CustomError from "../errors/customError";
import { ErrorCode } from "../errors/errorCode";
import { EpaperService } from "../services/epaperService";



export class EpaperController {

    async createEpaper(req: Request, res: Response) {
        const parsed = EpaperSchema.safeParse(req.body);
        if (!parsed.success) {
            return res
                .status(400)
                .json(new CustomError(ErrorCode.VALIDATION_ERROR));
        }

        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json(new CustomError(ErrorCode.AUTH_TOKEN_MISSING));
        }

        const epaper = await EpaperService.createEpaper({
            ...parsed.data,
            authorId: userId,
        });

        res.status(201).json(epaper);
    }

    async updateEpaper(req: Request, res: Response) {
        const parsed = EpaperSchema.safeParse(req.body);
        if (!parsed.success) {
            return res
                .status(400)
                .json(new CustomError(ErrorCode.VALIDATION_ERROR));
        }

        const { id } = req.params;

        const updated = await EpaperService.updateEPaper(id, parsed.data);

        res.json(updated);
    }

    async deleteEpaper(req: Request, res: Response) {
        const { id } = req.params;

        const deleted = await EpaperService.deleteEPaper(id);

        res.json(deleted);
    }

    async getAllEpapers(req: Request, res: Response) {
        const { search } = req.query;
        const all = await EpaperService.getAllEPapers(search as string);

        res.json({
            status: "success",
            data: {
                data: all,
                pagination: {
                    total: all.length,
                    page: 1,
                    limit: all.length,
                    totalPage: 1
                }
            }
        });
    }

    async getEpaperById(req: Request, res: Response) {
        const { id } = req.params;

        const epaper = await EpaperService.getEPaperById(id);

        if (!epaper) {
            return res.status(404).json(new CustomError(ErrorCode.MEDIA_NOT_FOUND));
        }

        res.json(epaper);
    }
}
