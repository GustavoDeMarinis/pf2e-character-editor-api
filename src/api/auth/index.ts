import Router from "express-promise-router";
import {
  handleChangePassword,
  handleGetSessions,
  handleRefresh,
  handleRevokeSession,
  handleSignIn,
  handleSignOut,
  handleSignUp,
} from "./auth-api";
import {
  signInLimiter,
  signUpLimiter,
  refreshLimiter,
  passwordChangeLimiter,
} from "../../middleware/security/rate-limit";
import { authorize } from "../../middleware/security/authorization";
import { UserRole } from "@prisma/client";

const router = Router();

router.post("/signIn", signInLimiter, handleSignIn);
router.post("/signUp", signUpLimiter, handleSignUp);
router.post("/signOut", authorize(), handleSignOut);
router.post("/refresh", refreshLimiter, handleRefresh);
router.get("/sessions", authorize(), handleGetSessions);
router.delete("/sessions/:sessionId", authorize(), handleRevokeSession);
router.patch("/password/:userId", authorize({ roles: [UserRole.Admin, UserRole.Player] }), passwordChangeLimiter, handleChangePassword);

export { router };
