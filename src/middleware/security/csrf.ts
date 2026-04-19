import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { StatusCodes } from "http-status-codes";
import { config } from "../../config";

const SAFE_METHODS = ["GET", "HEAD", "OPTIONS"];

const CSRF_EXEMPT_PATHS = ["/auth/signIn", "/auth/signUp", "/auth/refresh"];

export const csrfMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const existingToken = req.cookies.csrf_token;
  const token = existingToken || crypto.randomBytes(32).toString("hex");

  res.cookie("csrf_token", token, {
    httpOnly: false,
    secure: config.ENV !== "local",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });

  if (SAFE_METHODS.includes(req.method)) {
    return next();
  }

  const isExempt = CSRF_EXEMPT_PATHS.some(
    (path) =>
      req.path === path ||
      req.path.startsWith(path + "/")
  );

  if (isExempt) {
    return next();
  }

  const headerToken = req.headers["x-csrf-token"];
  if (headerToken !== token) {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: { message: "CSRF token mismatch" },
    });
  }

  next();
};
