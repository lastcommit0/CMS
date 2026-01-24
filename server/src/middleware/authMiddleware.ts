import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import CustomError from "../errors/customError";
import prisma from "../db";
import catchAsync from "./catchAsync";

export const requireAuth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new CustomError({
      statusCode: 401,
      message: "Authentication required",
      code: "AUTH_REQUIRED",
    });
  }

  const token = authHeader.split(" ")[1];

  const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
    userId: string;
    email: string;
    role: string;
  };

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: {
      roles: {
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              }
            }
          }
        }
      }
    }
  });

  if (!user || user.status !== 'ACTIVE') {
    throw new CustomError({
      statusCode: 401,
      message: "User not found or inactive",
      code: "USER_INACTIVE",
    });
  }

  const permissions = user.roles.flatMap(ur =>
    ur.role.permissions.map(rp => rp.permission.key)
  );

  req.user = {
    id: user.id,
    email: user.email,
    role: user.roles.map(ur => ur.role.name),
    permissions
  };

  next();
});
