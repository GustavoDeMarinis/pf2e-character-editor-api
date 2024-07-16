import Router from "express-promise-router";
import {
  handleDeleteUser,
  handleGetUser,
  handlePatchUser,
  handleSearchUser,
} from "./user-api";
import { authorize } from "../../middleware/security/authorization";
import { UserRole } from "@prisma/client";

const router = Router();

router.get(
  "/",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleSearchUser
);

router.get(
  "/:userId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleGetUser
);

router.patch(
  "/:userId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handlePatchUser
);

router.delete(
  "/:userId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleDeleteUser
);

export { router };
