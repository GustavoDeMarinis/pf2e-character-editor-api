import { Request, Response, NextFunction } from "express";
import { config } from "../config";
import { securitySchema } from "./security.swagger";
import { characterPaths } from "./character/character.swagger";
import { authPaths } from "./auth/auth.swagger";
import { userPaths } from "./user/user.swagger";
import { characterClassPaths } from "./character-class/character-class.swagger";
import { weaponBasePaths } from "./weapon-base/weapon-base.swagger";
import { armorBasePaths } from "./armor-base/armor-base.swagger";

export const swaggerDocument = {
  openapi: "3.0.1",
  info: {
    version: "1.0.0",
    title: "APIs Document",
    description: "Pathfinder Character API",
    termsOfService: "",
  },
  servers: [
    {
      url: "http://localhost:5000/",
      description: "Local server",
    },
  ],
  components: {
    securitySchemes: securitySchema,
  },
  security: [{ cookieAuth: [] }],
  paths: {
    ...authPaths,
    ...userPaths,
    ...characterPaths,
    ...characterClassPaths,
    ...weaponBasePaths,
    ...armorBasePaths,
  },
};

export const apiDocsMiddleware = (
  _req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  const allowedEnvs = ["local"];
  if (allowedEnvs.includes(config.ENV)) {
    next();
  } else {
    res.status(404).send("Not Found");
  }
};
