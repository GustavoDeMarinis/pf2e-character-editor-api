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
import { router as heritageRouter } from "./api/heritage";
import { router as backgroundRouter } from "./api/background";

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
const swaggerUiOptions = {
  customJsStr: `
    (function () {
      var _fetch = window.fetch;
      window.fetch = function (url, opts) {
        opts = opts || {};
        opts.headers = opts.headers || {};
        var match = document.cookie.match(/(?:^|;\\s*)csrf_token=([^;]+)/);
        if (match) {
          if (opts.headers instanceof Headers) {
            opts.headers.set('x-csrf-token', decodeURIComponent(match[1]));
          } else {
            opts.headers['x-csrf-token'] = decodeURIComponent(match[1]);
          }
        }
        return _fetch(url, opts);
      };
    })();
  `,
} as swaggerUi.SwaggerUiOptions;

router.get("/api-docs", rejectDocsInProd, apiDocsMiddleware, swaggerUi.setup(swaggerDocument, swaggerUiOptions));

router.use("/character-class", characterClassRouter);
router.use("/character", characterRouter);
router.use("/weapon-base", weaponBaseRouter);
router.use("/armor-base", armorBaseRouter);
router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/language", languageRouter);
router.use("/skill", skillRouter);
router.use("/ancestry", ancestryRouter);
router.use("/heritage", heritageRouter);
router.use("/background", backgroundRouter);
export default router;
