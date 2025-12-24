import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import CustomError from "../errors/customError";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    role: string;
  };

  req.user = {
    id: payload.userId,
    role: payload.role,
  };

  next();
};
