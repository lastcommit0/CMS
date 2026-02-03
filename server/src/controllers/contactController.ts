import { Request, Response } from "express";
import { ContactService } from "../services/contactService";

export const getMessages = async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string;

    const result = await ContactService.getMessages({ page, limit, search });

    res.status(200).json({
        success: true,
        data: result.messages,
        pagination: result.pagination,
    });
};

export const deleteMessage = async (req: Request, res: Response) => {
    await ContactService.deleteMessage(req.params.id);
    res.status(200).json({
        success: true,
        message: "Message deleted successfully",
    });
};
