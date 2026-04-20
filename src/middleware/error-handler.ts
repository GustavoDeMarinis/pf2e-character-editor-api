import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import crypto from "crypto";
import { AjvValidationsError } from "./validators/ajv-validator-error";
import { ErrorResult } from "../utils/shared-types";
import { logError } from "../utils/logging";
import { createErrorResponse } from "../utils/http-response-factory";

const subService = "middleware/error-handler";

const PrismaErrorCode = {
  RecordNotFound: "P2025",
  UniqueConstraintViolation: "P2002",
  ForeignKeyConstraintViolation: "P2003",
} as const;

function isErrorResult(err: unknown): err is ErrorResult {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    "message" in err &&
    typeof (err as ErrorResult).code === "number"
  );
}

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  const requestId: string = req.id ?? crypto.randomUUID();

  if (err instanceof AjvValidationsError) {
    const validationDetails = err.errors?.reduce(
      (acc, e) => {
        const field = e.instancePath.split("/").pop() ?? "unknown";
        acc[field] = e.message ?? "invalid";
        return acc;
      },
      {} as Record<string, string>
    );
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        code: StatusCodes.BAD_REQUEST,
        message: err.message || "Validation failed",
        validationDetails,
      },
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === PrismaErrorCode.RecordNotFound) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: { code: StatusCodes.NOT_FOUND, message: "Resource not found" },
      });
    }
    if (err.code === PrismaErrorCode.UniqueConstraintViolation) {
      return res.status(StatusCodes.CONFLICT).json({
        error: { code: StatusCodes.CONFLICT, message: "Resource already exists" },
      });
    }
    if (err.code === PrismaErrorCode.ForeignKeyConstraintViolation) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: {
          code: StatusCodes.BAD_REQUEST,
          message: "Related resource not found",
        },
      });
    }
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: { code: StatusCodes.BAD_REQUEST, message: "Database request error" },
    });
  }

  if (isErrorResult(err)) {
    return createErrorResponse(res, err);
  }

  // Unknown — log full details internally, never expose to client
  logError({
    subService,
    message: "Unhandled error",
    details: {
      requestId,
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    },
  });

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: {
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "An unexpected error occurred",
      requestId,
    },
  });
};
