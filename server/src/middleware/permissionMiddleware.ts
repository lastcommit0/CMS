import { Request, Response, NextFunction } from "express";

export const requirePermission = (permission: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userPermissions = req.user?.permissions || [];
    }
}