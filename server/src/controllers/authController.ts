import { Request, Response } from "express";
import { registerSchema, loginSchema, refreshSchema } from "../validators/authSchema";
import * as authService from "../services/authService";
import catchAsync from "../middleware/catchAsync";


export const register =  async (req: Request, res: Response) => {
    const data = registerSchema.parse(req.body);
    const user = await authService.registerUser(data, req.user?.id, req.ip);
    const { passwordHash, ...userData} = user;

    res.status(200).json({
        success: true,
        data: userData
    });
}


export const login = async (req: Request, res: Response) => {
    const {identifier, password} = loginSchema.parse(req.body);
    const result = await authService.loginUser(identifier, password, req);

    const {passwordHash, ...userData} = result.user;

    res.status(200).json({
        success: true,
        data: {
            user: userData,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken
        }
    })
}


export const refresh = async (req: Request, res: Response) => {
    const {refreshToken} = refreshSchema.parse(req.body);
    
    const token = await authService.refreshUser(refreshToken, req);

    res.status(200).json({
        success: true,
        data: {
            accessToken: token.accessToken,
            refreshToken: token.refreshToken
        }
    })
    
}

export const logout = async (req: Request, res: Response) => {
    await authService.logoutUser(req.body.refreshToken, req);

    res.status(200).json({
        success: true,
        data: {}
    })
}

export const logoutAll = async (req: Request, res: Response) => {
    await authService.logoutAllSessions(req);

    res.status(200).json({
        success: true,
        data: {}
    })
}