import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { config } from "../../config";
import { logError, logInfo } from "../../utils/logging";
import { UserRole } from "@prisma/client";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
const subService = "security/authorization";

export type AuthPayload = {
  userId: string;
  role: UserRole;
  sessionId: string;
};

export const isOwner = (
  entity: { createdByUserId?: string | null; assignedUserId?: string | null },
  userId: string
): boolean =>
  entity.createdByUserId === userId || entity.assignedUserId === userId;

export const getCurrentUserAuthorization = (req: Request): AuthPayload => {
  if (!req.auth) {
    throw new Error("Request is missing auth payload");
  }
  return req.auth;
};

export const jwtSignIn = (res: Response, payload: AuthPayload): string => {
  const token = jwt.sign(payload, config.JWT_SECRET_KEY, {
    expiresIn: config.JWT_ACCESS_TOKEN_EXPIRY,
  });
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: config.ENV !== "local",
    sameSite: "strict",
  });
  return token;
};

export const setRefreshTokenCookie = (res: Response, value: string): void => {
  res.cookie("refresh_token", value, {
    httpOnly: true,
    secure: config.ENV !== "local",
    sameSite: "strict",
    path: "/auth/refresh",
    maxAge: config.REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
  });
};

export const jwtSignOut = (res: Response): void => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: config.ENV !== "local",
    sameSite: "strict",
  });
  res.clearCookie("refresh_token", {
    httpOnly: true,
    secure: config.ENV !== "local",
    sameSite: "strict",
    path: "/auth/refresh",
  });
};

export const jwtVerify = (req: Request): AuthPayload => {
  const authHeader = req.cookies.access_token ?? "";
  return jwt.verify(authHeader, config.JWT_SECRET_KEY) as AuthPayload;
};

export const authorize = (roleAuthOptions?: { roles: UserRole[] }) => {
  return async function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const payload = jwtVerify(req);
      req.auth = payload;
      if (roleAuthOptions?.roles) {
        const roleAuthorized = roleAuthOptions.roles.includes(payload.role);
        if (!roleAuthorized) {
          return res.status(StatusCodes.FORBIDDEN).json({
            error: { message: ReasonPhrases.FORBIDDEN },
          });
        }
      }
    } catch (err) {
      const error = err as { message: string; name: string };
      switch (error.message) {
        case "jwt expired":
          logInfo({
            subService,
            message: error.message,
            details: error,
          });
          break;
        default:
          logError({
            subService,
            message: error.message,
            details: error,
          });
          break;
      }
      return res.status(401).json({ error: { message: error.message } });
    }

    next();
  };
};
