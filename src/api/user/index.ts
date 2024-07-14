import Router from "express-promise-router";
import { handlePatchUser } from "./user-api";
import { authorize } from "../../middleware/security/authorization";
import { UserRole } from "@prisma/client";

const router = Router();

router.patch(
  "/:userId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handlePatchUser
);

export { router };
