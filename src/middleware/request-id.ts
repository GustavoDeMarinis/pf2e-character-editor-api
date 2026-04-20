import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  req.id = crypto.randomUUID();
  res.setHeader("X-Request-ID", req.id);
  next();
};
