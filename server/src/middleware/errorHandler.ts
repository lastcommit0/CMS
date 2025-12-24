import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import CustomError from "../errors/customError";
import config from "../config";
import { getErrorMessage } from "../utils/getErrorMessage";

export default function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof CustomError) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    });
  }

  if (error instanceof ZodError) {
    const details = error.issues.map(e => ({
      field: e.path.join("."),
      message: e.message,
    }));

    return res.status(400).json({
      success: false,
      error: {
        code: "SYSTEM_VALIDATION_ERROR",
        message: "Validation failed",
        details,
      },
    });
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as any).code?.startsWith("P")
  ) {
    const prismaError = error as any;

    switch (prismaError.code) {
      case "P2002":
        return res.status(409).json({
          success: false,
          error: {
            code: "SYSTEM_DATABASE_DUPLICATE",
            message: "A record with this value already exists",
            field: prismaError.meta?.target?.[0],
          },
        });

      case "P2025":
        return res.status(404).json({
          success: false,
          error: {
            code: "SYSTEM_RECORD_NOT_FOUND",
            message: "Record not found",
          },
        });

      case "P2003":
        return res.status(400).json({
          success: false,
          error: {
            code: "SYSTEM_FOREIGN_KEY_ERROR",
            message: "Foreign key constraint failed",
          },
        });
    }
  }

  if (error instanceof Error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: {
          code: "AUTH_TOKEN_INVALID",
          message: "Invalid authentication token",
        },
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: {
          code: "AUTH_TOKEN_EXPIRED",
          message: "Session expired. Please login again.",
        },
      });
    }
  }

  console.error("Unhandled error:", error);

  return res.status(500).json({
    success: false,
    error: {
      code: "SYSTEM_INTERNAL_ERROR",
      message:
        config.env === "production"
          ? "An unexpected error occurred"
          : getErrorMessage(error),
    },
  });
}
