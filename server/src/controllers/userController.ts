import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/userService";
import prisma from "../db";
import { updateUserSchema, changePasswordSchema } from "../validators/userSchema";

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await UserService.getUsers({
        page,
        limit,
        search: req.query.search as string,
        role: req.query.role as string,
        status: req.query.status as string
    });

    res.status(200).json({
        success: true,
        data: result.users,
        pagination: result.pagination
    });
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.getUserById(req.params.id);
    res.status(200).json({
        success: true,
        data: user
    });
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const data = updateUserSchema.parse(req.body);
    const updated = await UserService.updateUser(
        req.params.id,
        data,
        req.user?.id,
        req.ip || 'unknown'
    );
    
    res.status(200).json({
        success: true,
        data: updated
    });
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    await UserService.deleteUser(req.params.id, req.user!.id);

    await prisma.auditLog.create({
        data: {
            userId: req.user!.id,
            action: "USER_DELETED",
            resource: "User",
            metadata: { deletedUserId: req.params.id },
            ipAddress: req.ip || "unknown"
        }
    });
    
    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    });
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    const data = changePasswordSchema.parse(req.body);
    await UserService.changePassword(
        req.user!.id,
        data.currentPassword,
        data.newPassword
    );

    await prisma.auditLog.create({
        data: {
            userId: req.user!.id,
            action: "USER_PASSWORD_CHANGED",
            resource: "User",
            ipAddress: req.ip || "unknown"
        }
    });

    res.status(200).json({
        success: true,
        message: "Password changed successfully"
    });
};

export const getUserStats = async (req: Request, res: Response, next: NextFunction) => {
    const stats = await UserService.getUserStats(req.params.id);

    res.status(200).json({
        success: true,
        data: stats
    });
};

export const getUserActivity = async (req: Request, res: Response, next: NextFunction) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const activity = await UserService.getUserActivity(req.params.id, page, limit);
    
    res.status(200).json({
        success: true,
        data: activity
    });
};

export const getManager = async (req: Request, res: Response, next: NextFunction) => {
    const role = req.params.role;
    const managers = await UserService.getManager(role);
    
    res.status(200).json({
        success: true,
        data: managers
    });
};