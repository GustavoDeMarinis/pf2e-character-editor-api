import Router from "express-promise-router";
import {
  handleChangePassword,
  handleSignIn,
  handleSignOut,
  handleSignUp,
} from "./auth-api";

const router = Router();

router.post("/signIn", handleSignIn);
router.post("/signUp", handleSignUp);
router.post("/signOut", handleSignOut);
router.patch("/password/:userId", handleChangePassword);

export { router };
