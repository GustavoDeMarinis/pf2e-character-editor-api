import Router from "express-promise-router";
import { router as characterRouter } from "./api/character";

const router = Router();

router.use("/character", characterRouter);

export default router;
