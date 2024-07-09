import Router from "express-promise-router";
import { handlePostUser } from "./user-api";

const router = Router();

router.post("/", handlePostUser);

export { router };
