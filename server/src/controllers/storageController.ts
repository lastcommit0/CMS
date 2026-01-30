import { mediaService } from "../services/storageService";
import { Request, Response } from "express";


export const uploadImage = async (req: Request, res: Response) => {
    if (!req.user) throw new Error("Unauthorized");
    const media = await mediaService.create(req.file, req.user.id, "IMAGE");
    res.json(media);
};

export const uploadVideo = async (req: Request, res: Response) => {
    if (!req.user) throw new Error("Unauthorized");
    const media = await mediaService.create(req.file, req.user.id, "VIDEO");
    res.json(media);
};

export const uploadPdf = async (req: Request, res: Response) => {
    if (!req.user) throw new Error("Unauthorized");
    const media = await mediaService.create(req.file, req.user.id, "PDF");
    res.json(media);
};

export const deleteMedia = async (req: Request, res: Response) => {
    await mediaService.delete(req.params.id);
    res.sendStatus(204);
};

export const updateMedia = async (req: Request, res: Response) => {
    const media = await mediaService.update(req.params.id, req.file);
    res.json(media);
};
