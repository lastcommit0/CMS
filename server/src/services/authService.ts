import prisma from "../db";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { ErrorCode } from "../errors/errorCode";
import CustomError from "../errors/customError";
import { AuditService } from "./auditService";






interface GoogleOAuthPayload {
    provider: string
    providerAccountId: string
    email: string
    name: string
    avatar?: string
}

export async function handleGoogleOAuth(
    payload: GoogleOAuthPayload,
    req: any
) {
    const { provider, providerAccountId, email, name } = payload

    const user = await prisma.user.findUnique({
        where: { email },
    })

    if (!user) {
        throw new CustomError(ErrorCode.USER_NOT_FOUND);
    }

        const oauthAccount = await prisma.oAuthAccount.findUnique({
        where: {
            provider_providerAccountId: {
                provider,
                providerAccountId,
            },
        },
    })

    if (!oauthAccount) {
        await prisma.oAuthAccount.create({
            data: {
                userId: user.id,
                provider,
                providerAccountId,
            },
        })
    }

    const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "24h" }
    )

    const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
    )

    const refreshTokenHash = await argon2.hash(refreshToken)

    await prisma.session.create({
        data: {
            userId: user.id,
            refreshTokenHash,
            device: req.headers["user-agent"],
            ipAddress: req.ip,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
    })

    return { accessToken, refreshToken }

    return {
        user,
        accessToken,
        refreshToken
    }
}


export async function registerUser(data: any, createdById?: string, ipAddress?: string) {
    const exist = await prisma.user.findFirst({
        where: {
            OR: [
                { email: data.email },
                { phone: data.phone }
            ]
        }
    });

    if (exist) {
        throw new CustomError(ErrorCode.USER_ALREADY_EXISTS);
    }

    const passwordHash = await argon2.hash(data.password);

    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            passwordHash,
            role: data.role,
            createdById,
            profile: {
                create: {
                    designation: data.designation,
                    jobType: data.jobType,
                    location: data.location,
                    bio: data.bio
                }
            }
        },
        include: {
            profile: true
        },
    });

    await prisma.auditLog.create({
        data: {
            userId: user.id,
            action: 'USER_CREATED',
            resource: 'USER',
            metadata: {
                userId: user.id,
                email: user.email
            },
            ipAddress: ipAddress || 'unknown',
        }
    })

    return user;
}


export async function loginUser(
  userId: string,
  password: string,
  captchaInput: string,
  req: any
) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user || !user.passwordHash) {
    throw new CustomError(ErrorCode.USER_NOT_FOUND);
  }

  if (user.failedLoginAttempts >= 2) {
    if (!captchaInput || captchaInput !== req.session.captcha) {
      throw new CustomError(ErrorCode.AUTH_INVALID_CREDENTIALS);
    }
  }

  const valid = await argon2.verify(user.passwordHash, password);
  if (!valid) {
    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: { increment: 1 } }
    });
    throw new CustomError(ErrorCode.AUTH_INVALID_CREDENTIALS);
  }

  // reset attempts
  await prisma.user.update({
    where: { id: user.id },
    data: { failedLoginAttempts: 0 }
  });

  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );

  const refreshTokenHash = await argon2.hash(refreshToken);

  await prisma.session.create({
    data: {
      userId: user.id,
      refreshTokenHash,
      device: req.headers["user-agent"],
      ipAddress: req.ip,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  });

  return { user, accessToken, refreshToken };
}

export async function identifyUser(identifier: string) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: identifier },
        { phone: identifier }
      ]
    }
  });

  if (!user) {
    throw new CustomError(ErrorCode.USER_NOT_FOUND);
  }

  if (user.status !== 'ACTIVE') {
    throw new CustomError(ErrorCode.USER_INACTIVE);
  }

  return {
    userId: user.id,
    username: user.email, 
    requireCaptcha: user.failedLoginAttempts >= 2
  };
}


export async function refreshUser(refreshToken: string, req: any) {
    const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_SECRET!
    ) as { userId: string };

    const sessions = await prisma.session.findMany({
        where: {
            userId: decoded.userId,
            revoked: false,
            expiresAt: { gt: new Date() },
        },
    });

    let validSession = null;
    for (const session of sessions) {
        const valid = await argon2.verify(session.refreshTokenHash, refreshToken);
        if (valid) {
            validSession = session;
            break;
        }
    }

    if (!validSession) {
        await AuditService.logAudit({
            userId: decoded.userId,
            action: "USER_REFRESH_FAILED",
            resource: "REFRESH",
            metadata: { reason: "Invalid refresh token" },
            ipAddress: req.ip,
        });

        throw new CustomError(ErrorCode.AUTH_TOKEN_INVALID);
    }

    const user = await prisma.user.findUnique({
        where: { id: decoded.userId, status: "ACTIVE" },
    });

    if (!user) {
        throw new CustomError(ErrorCode.USER_NOT_FOUND);
    }

    const newAccessToken = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "15m" }
    );

    const newRefreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: "7d" }
    );

    await prisma.session.update({
        where: { id: validSession.id },
        data: {
            refreshTokenHash: await argon2.hash(newRefreshToken),
        },
    });

    await AuditService.logAudit({
        userId: user.id,
        action: "USER_REFRESH",
        resource: "REFRESH",
        metadata: { sessionId: validSession.id },
        ipAddress: req.ip,
    });

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    };
}


export async function logoutUser(refreshToken: string, req: any) {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as { userId: string };

    const sessions = await prisma.session.findMany({
        where: {
            userId: decoded.userId,
            revoked: false
        }
    });
    for (const session of sessions) {
        const valid = await argon2.verify(session.refreshTokenHash, refreshToken);
        if (valid) {
            await prisma.session.update({
                where: { id: session.id },
                data: {
                    revoked: true
                }
            });
            break;
        }
    }
    await prisma.auditLog.create({
        data: {
            userId: decoded.userId,
            action: "USER_LOGOUT",
            resource: "LOGOUT",
            ipAddress: req.ip,
        }
    });

    return;
}


export async function logoutAllSessions(req: any) {
    await prisma.session.updateMany({
        where: {
            userId: req.user!.id,
            revoked: false
        },
        data: { revoked: true }
    });

    await prisma.auditLog.create({
        data: {
            userId: req.user!.id,
            action: "USER_LOGOUT_ALL",
            resource: "LOGOUT",
            ipAddress: req.ip || 'unknown',
        }
    });

    return;
}
