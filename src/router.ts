import Router from "express-promise-router";
import { router as characterRouter } from "./api/character";
import { router as authRouter } from "./api/auth";
const router = Router();

router.use("/character", characterRouter);
router.use("/auth", authRouter);
export default router;
