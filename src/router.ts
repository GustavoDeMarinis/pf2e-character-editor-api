import Router from "express-promise-router";
import swaggerUi from "swagger-ui-express";
import { router as characterRouter } from "./api/character";
import { router as authRouter } from "./api/auth";
import { router as userRouter } from "./api/user";
import { router as weaponBaseRouter } from "./api/weapon-base";
import { router as armorBaseRouter } from "./api/armor-base";
import { router as characterClassRouter } from "./api/character-class";
import { apiDocsMiddleware, swaggerDocument } from "./swagger/config";
const router = Router();

router.use("/api-docs", apiDocsMiddleware, swaggerUi.serve);
router.get("/api-docs", apiDocsMiddleware, swaggerUi.setup(swaggerDocument));

router.use("/character-class", characterClassRouter);
router.use("/character", characterRouter);
router.use("/weapon-base", weaponBaseRouter);
router.use("/armor-base", armorBaseRouter);
router.use("/auth", authRouter);
router.use("/user", userRouter);
export default router;
