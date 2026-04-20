import Router from "express-promise-router";
import swaggerUi from "swagger-ui-express";
import { router as characterRouter } from "./api/character";
import { router as authRouter } from "./api/auth";
import { router as userRouter } from "./api/user";
import { router as weaponBaseRouter } from "./api/weapon-base";
import { router as armorBaseRouter } from "./api/armor-base";
import { router as characterClassRouter } from "./api/character-class";
import { router as languageRouter } from "./api/language";
import { router as skillRouter } from "./api/skill";
import { router as ancestryRouter } from "./api/ancestry";

import { apiDocsMiddleware, swaggerDocument } from "./swagger/config";
import { Request, Response, NextFunction } from "express";

const router = Router();

const rejectDocsInProd = (_req: Request, res: Response, next: NextFunction) => {
  if (process.env.ENV === "prod" && process.env.DOCS_ENABLED !== "true") {
    return res.status(404).end();
  }
  return next();
};

router.use("/api-docs", rejectDocsInProd, apiDocsMiddleware, swaggerUi.serve);
router.get("/api-docs", rejectDocsInProd, apiDocsMiddleware, swaggerUi.setup(swaggerDocument));

router.use("/character-class", characterClassRouter);
router.use("/character", characterRouter);
router.use("/weapon-base", weaponBaseRouter);
router.use("/armor-base", armorBaseRouter);
router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/language", languageRouter);
router.use("/skill", skillRouter);
router.use("/ancestry", ancestryRouter);
export default router;
