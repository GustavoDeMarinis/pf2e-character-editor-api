import Router from "express-promise-router";
import swaggerUi from "swagger-ui-express";
import { router as characterRouter } from "./api/character";
import { router as authRouter } from "./api/auth";
import { apiDocsMiddleware, swaggerDocument } from "./swagger/config";
const router = Router();

router.use("/api-docs", apiDocsMiddleware, swaggerUi.serve);
router.get("/api-docs", apiDocsMiddleware, swaggerUi.setup(swaggerDocument));

router.use("/character", characterRouter);
router.use("/auth", authRouter);
export default router;
