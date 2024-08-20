import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { config } from "../../config";
import { logError, logInfo } from "../../utils/logging";
import { UserRole } from "@prisma/client";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
const subService = "security/authorization";

type PayloadType = {
  userId: string;
  role: UserRole;
};

export type CurrentUserAuthorization = {
  userId: string;
  role: UserRole;
};

export const getCurrentUserAuthorization = (
  req: Request
): CurrentUserAuthorization => {
  return {
    userId: req.cookies.user.userId,
    role: req.cookies.user.role,
  };
};

export const jwtSign = (res: Response, payload: PayloadType): string => {
  const token = jwt.sign(payload, config.JWT_SECRET_KEY, {
    expiresIn: config.JWT_EXPIRATION_PERIOD,
  });
  res.cookie("access_token", token, {
    httpOnly: false, //Cookie can only be access by server
    secure: false, // Cookie can only be access by https
    sameSite: true,
  });
  res.cookie("user", payload);
  return token;
};

export const jwtVerify = (req: Request) => {
  const authHeader = req.cookies.access_token ?? "";
  return jwt.verify(authHeader, config.JWT_SECRET_KEY);
};

export const authorize = (roleAuthOptions?: { roles: UserRole[] }) => {
  return async function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      jwtVerify(req);
      if (roleAuthOptions?.roles) {
        const roleAuthorized = roleAuthOptions.roles.includes(
          req.cookies.user.role
        );
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
      res.status(401).json({ error: { message: error.message } });
    }

    next();
  };
};
