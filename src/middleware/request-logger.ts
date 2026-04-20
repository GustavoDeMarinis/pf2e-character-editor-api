import { Request, Response, NextFunction } from "express";
import { logInfo } from "../utils/logging";

const subService = "middleware/request-logger";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();

  res.on("finish", () => {
    logInfo({
      subService,
      message: "Request completed",
      details: {
        requestId: req.id,
        method: req.method,
        path: req.path,
        status: res.statusCode,
        durationMs: Date.now() - start,
        userId: req.auth?.userId,
      },
    });
  });

  next();
};
