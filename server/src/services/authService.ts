import prisma from "../db";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { ErrorCode } from "../errors/errorCode";
import CustomError from "../errors/customError";
import { AuditService } from "./auditService";

interface OAuthPayload {
  provider: string;
  providerAccountId: string;
  email: string;
  name: string;
  avatar?: string;
}

export const AuthService = {

  async identifyUser(identifier: string) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phone: identifier }],
      },
      select: {
        id: true,
        email: true,
        phone: true,
        failedLoginAttempts: true,
      },
    });

    if (!user) {
      throw new CustomError(ErrorCode.USER_NOT_FOUND);
    }

    const requireCaptcha = user.failedLoginAttempts >= 2;

    return {
      userId: user.id,
      username: user.email,
      requireCaptcha,
    };
  },

  async handleOAuthLogin(payload: OAuthPayload, req: any) {
    const { provider, providerAccountId, email, name, avatar } = payload;

    let user = await prisma.user.findUnique({
      where: { email },
      include: {
        roles: { include: { role: true } },
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          authProvider: provider === "GOOGLE" ? "GOOGLE" : "LOCAL",
          status: "ACTIVE",
          profile: {
            create: {
              designation: "WRITER",
              jobType: "FULL_TIME",
              avatar,
            },
          },
        },
        include: {
          roles: { include: { role: true } },
        },
      });
    }

    if (user.status !== "ACTIVE") {
      throw new CustomError(ErrorCode.AUTH_ACCOUNT_DISABLED);
    }

    // Create or update OAuth account
    await prisma.oAuthAccount.upsert({
      where: {
        provider_providerAccountId: { provider, providerAccountId },
      },
      create: {
        userId: user.id,
        provider,
        providerAccountId,
      },
      update: {},
    });

    const roles = user.roles.map((r) => r.role.name);

    const accessToken = jwt.sign(
      { userId: user.id, roles },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" }
    );

    // Create session
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenHash: await argon2.hash(refreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user: { id: user.id, email: user.email, name: user.name, roles },
      accessToken,
      refreshToken,
    };
  },


  // server/src/services/authService.ts - registerUser function update
  // Replace the registerUser function with this improved version

  async registerUser(
    context: {
      userId: string;
      userRole: string[];
      ip?: string;
    },
    data: any
  ) {
    const allowedRoles = ["ADMIN", "SUB_ADMIN"];

    const hasAccess = context.userRole.some((role) =>
      allowedRoles.includes(role)
    );

    if (!hasAccess) {
      throw new CustomError(ErrorCode.ROLE_ACCESS_DENIED);
    }

    const exist = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, ...(data.phone ? [{ phone: data.phone }] : [])],
      },
    });

    if (exist) {
      if (exist.email === data.email) {
        throw new CustomError(ErrorCode.USER_EMAIL_EXISTS);
      }
      if (exist.phone === data.phone) {
        throw new CustomError(ErrorCode.USER_PHONE_EXISTS);
      }
    }

    const passwordHash = await argon2.hash(data.password);

    const role = await prisma.roleModel.upsert({
      where: { name: data.role },
      create: {
        name: data.role,
        description: `${data.role} role`,
      },
      update: {},
    });

    const user = await prisma.user.create({
      data: {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        passwordHash,
        createdById: context.userId,
        managerId: data.managerId || null,
        profile: {
          create: {
            designation: data.designation,
            jobType: data.jobType,
            location: data.location,
            bio: data.bio,
            avatar: data.avatar,
          },
        },
        roles: {
          create: {
            roleId: role.id,
          },
        },
      },
      include: {
        profile: true,
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: context.userId,
        action: "USER_CREATED",
        resource: "USER",
        metadata: {
          createdUserId: user.id,
          email: user.email,
          role: data.role,
        },
        ipAddress: context.ip || "unknown",
      },
    });

    return user;
  },

  async loginUser(identifier: string, password: string, captchaInput: string, req: any) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phone: identifier }],
      },
      include: { roles: { include: { role: true } } },
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
        data: { failedLoginAttempts: { increment: 1 } },
      });
      throw new CustomError(ErrorCode.AUTH_INVALID_CREDENTIALS);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: 0 },
    });

    const roles = user.roles.map(r => r.role.name);

    const accessToken = jwt.sign(
      { userId: user.id, roles },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" }
    );

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenHash: await argon2.hash(refreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { user, accessToken, refreshToken };
  },

  async refreshUser(refreshToken: string, req: any) {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as { userId: string };

    const sessions = await prisma.session.findMany({
      where: {
        userId: decoded.userId,
        revoked: false,
        expiresAt: { gt: new Date() },
      },
    });

    let validSession = null;

    for (const s of sessions) {
      const isValid = await argon2.verify(s.refreshTokenHash, refreshToken);
      if (isValid) {
        validSession = s;
        break;
      }
    }

    if (!validSession) {
      throw new CustomError(ErrorCode.AUTH_TOKEN_INVALID);
    }

    const user = await prisma.user.findFirst({
      where: { id: decoded.userId, status: "ACTIVE" },
      include: { roles: { include: { role: true } } },
    });

    if (!user) {
      throw new CustomError(ErrorCode.USER_NOT_FOUND);
    }

    const roles = user.roles.map(r => r.role.name);

    const newAccessToken = jwt.sign(
      { userId: user.id, roles },
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
      data: { refreshTokenHash: await argon2.hash(newRefreshToken) },
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  },

  async logoutUser(refreshToken: string, req: any) {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as { userId: string };

    const sessions = await prisma.session.findMany({
      where: { userId: decoded.userId, revoked: false },
    });

    for (const session of sessions) {
      if (await argon2.verify(session.refreshTokenHash, refreshToken)) {
        await prisma.session.update({
          where: { id: session.id },
          data: { revoked: true },
        });
        break;
      }
    }
  },

  async logoutAllSessions(req: any) {
    await prisma.session.updateMany({
      where: { userId: req.user.id, revoked: false },
      data: { revoked: true },
    });
  }
}
