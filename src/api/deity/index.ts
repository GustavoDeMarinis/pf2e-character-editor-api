import Router from "express-promise-router";
import { authorize } from "../../middleware/security/authorization";
import { UserRole } from "@prisma/client";
import {
  handleSearchDeity,
  handleGetDeity,
  handlePostDeity,
  handlePatchDeity,
  handleDeleteDeity,
} from "./deity-api";

const router = Router();

router.get(
  "/",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleSearchDeity
);
router.get(
  "/:deityId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleGetDeity
);
router.post("/", authorize({ roles: [UserRole.Admin] }), handlePostDeity);
router.patch(
  "/:deityId",
  authorize({ roles: [UserRole.Admin] }),
  handlePatchDeity
);
router.delete(
  "/:deityId",
  authorize({ roles: [UserRole.Admin] }),
  handleDeleteDeity
);

export { router };
