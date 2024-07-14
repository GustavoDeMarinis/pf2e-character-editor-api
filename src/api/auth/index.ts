import Router from "express-promise-router";
import { handleSignIn, handleSignUp } from "./auth-api";

const router = Router();

router.post("/signIn", handleSignIn);
router.post("/signUp", handleSignUp);
// router.patch("/", handleChangePassword);

export { router };
