import Router from "express-promise-router";
import { authorize } from "../../middleware/security/authorization";
import { UserRole } from "@prisma/client";
import {
  handleSearchBackground,
  handleGetBackground,
  handlePostBackground,
  handlePatchBackground,
  handleDeleteBackground,
} from "./background-api";

const router = Router();

router.get(
  "/",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleSearchBackground
);
router.get(
  "/:backgroundId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleGetBackground
);
router.post(
  "/",
  authorize({ roles: [UserRole.Admin] }),
  handlePostBackground
);
router.patch(
  "/:backgroundId",
  authorize({ roles: [UserRole.Admin] }),
  handlePatchBackground
);
router.delete(
  "/:backgroundId",
  authorize({ roles: [UserRole.Admin] }),
  handleDeleteBackground
);

export { router };
