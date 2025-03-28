import Router from "express-promise-router";
import {
  handleChangePassword,
  handleSignIn,
  handleSignOut,
  handleSignUp,
} from "./auth-api";
import { signInLimiter } from "../../middleware/security/rate-limit";


const router = Router();
//TODO authorize
router.post("/signIn", signInLimiter, handleSignIn);
router.post("/signUp", handleSignUp);
router.post("/signOut", handleSignOut);
router.patch("/password/:userId", handleChangePassword);

export { router };
