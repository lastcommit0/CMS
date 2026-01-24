import { Request, Response } from "express";
import { registerSchema, loginSchema, refreshSchema, identifySchema } from "../validators/authSchema";
import { AuthService } from "../services/authService";
import CustomError from "../errors/customError";
import { ErrorCode } from "../errors/errorCode";



export const register = async (req: Request, res: Response) => {
  const data = registerSchema.parse(req.body);

  const user = await AuthService.registerUser(
    {
      userId: req.user!.id,
      userRole: req.user!.role, 
      ip: req.ip,
    },
    data
  );

  const { passwordHash, ...userData } = user;

  res.status(200).json({
    success: true,
    data: userData,
  });
};


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

    const result = await AuthService.handleOAuthLogin(payload, req)

    res.redirect(`http://127.0.0.1:5173/dashboard?` +
        `accessToken=${result.accessToken}&refreshToken=${result.refreshToken}`)
}

export const login = async (req: Request, res: Response) => {
    const {identifier, password, captcha} = loginSchema.parse(req.body);
    const result = await AuthService.loginUser(identifier, password, captcha, req);

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
    
    const token = await AuthService.refreshUser(refreshToken, req);

    res.status(200).json({
        success: true,
        data: {
            accessToken: token.accessToken,
            refreshToken: token.refreshToken
        }
    })
    
}

export const logout = async (req: Request, res: Response) => {
    await AuthService.logoutUser(req.body.refreshToken, req);

    res.status(200).json({
        success: true,
        data: {}
    })
}

export const logoutAll = async (req: Request, res: Response) => {
    const user = req.body.role;
    if(user.role !== 'ADMIN') {
        throw new CustomError(ErrorCode.AUTH_INVALID_CREDENTIALS);
    }
    await AuthService.logoutAllSessions(req);

    res.status(200).json({
        success: true,
        data: {}
    })
}



// export const identify = async (req: Request, res: Response) => {
//     const {identifier} = identifySchema.parse(req.body);
//     const result = await AuthService.identifyUser(identifier);
//     res.status(200).json({
//         success: true,
//         data: result
//     })
// }