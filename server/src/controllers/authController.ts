import { Request, Response } from "express";
import { registerSchema, loginSchema, refreshSchema, identifySchema } from "../validators/authSchema";
import * as authService from "../services/authService";
import catchAsync from "../middleware/catchAsync";
import CustomError from "../errors/customError";


export const register =  async (req: Request, res: Response) => {
    const data = registerSchema.parse(req.body);
    const user = await authService.registerUser(data, req.user?.id, req.ip);
    const { passwordHash, ...userData} = user;

    res.status(200).json({
        success: true,
        data: userData
    });
}


export const googleCallback = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.redirect(
        `http://127.0.0.1:5173//login?error=oauth_failed`
      )
    }
    const googleUser = req.user as any

    const payload = {
      provider: "GOOGLE",
      providerAccountId: googleUser.id,
      email: googleUser.emails?.[0]?.value,
      name: googleUser.displayName,
      avatar: googleUser.photos?.[0]?.value,
    }

    const result = await authService.handleGoogleOAuth(payload, req)

    res.redirect(`http://127.0.0.1:5173/dashboard?` +
        `accessToken=${result.accessToken}&refreshToken=${result.refreshToken}`)
}


export const login = async (req: Request, res: Response) => {
    const {identifier, password, captcha} = loginSchema.parse(req.body);
    const result = await authService.loginUser(identifier, password, captcha, req);

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

export const identify = async (req: Request, res: Response) => {
    const {identifier} = identifySchema.parse(req.body);
    const result = await authService.identifyUser(identifier);
    res.status(200).json({
        success: true,
        data: result
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