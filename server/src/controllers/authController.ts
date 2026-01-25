import { Request, Response } from "express";
import { registerSchema, loginSchema, refreshSchema, identifySchema } from "../validators/authSchema";
import { AuthService } from "../services/authService";
import CustomError from "../errors/customError";
import { ErrorCode } from "../errors/errorCode";



export const register = async (req: Request, res: Response) => {
  if (!req.user || !req.user.role || req.user.role.length === 0) {
    throw new CustomError(ErrorCode.AUTH_INVALID_CREDENTIALS);
  }

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
  try {
    if (!req.user) {
      return res.redirect(
        `${process.env.CLIENT_URL}/auth?error=oauth_failed`
      );
    }

    const googleUser = req.user as any;

    const payload = {
      provider: "GOOGLE",
      providerAccountId: googleUser.id,
      email: googleUser.emails?.[0]?.value,
      name: googleUser.displayName,
      avatar: googleUser.photos?.[0]?.value,
    };

    const result = await AuthService.handleOAuthLogin(payload, req);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect(
      `${process.env.CLIENT_URL}/auth/callback?token=${result.accessToken}`
    );
  } catch (error) {
    console.error('Google OAuth Error:', error);
    return res.redirect(
      `${process.env.CLIENT_URL}/auth?error=oauth_error`
    );
  }
};

export const login = async (req: Request, res: Response) => {
  const { identifier, password, captcha } = loginSchema.parse(req.body);
  const result = await AuthService.loginUser(identifier, password, '', req);

  const { passwordHash, ...userData } = result.user;

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
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!refreshToken) {
    throw new CustomError({
      statusCode: 401,
      message: "Refresh token not found",
      code: "AUTH_TOKEN_MISSING",
    });
  }
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
  if (user.role !== 'ADMIN') {
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