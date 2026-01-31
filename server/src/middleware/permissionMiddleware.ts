import { Request, Response, NextFunction } from "express";
import CustomError from "../errors/customError";
import { ErrorCode } from "../errors/errorCode";

export const requirePermission = (permission: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userPermissions = req.user?.permissions || [];
        
        if (!userPermissions.includes(permission)) {
            throw new CustomError(ErrorCode.ROLE_ACCESS_DENIED);
        }
        
        next();
    };
};

export const requireRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRoles = req.user?.role || [];
        
        const hasRole = userRoles.some(role => roles.includes(role));
        
        if (!hasRole) {
            throw new CustomError(ErrorCode.ROLE_ACCESS_DENIED);
        }
        
        next();
    };
};