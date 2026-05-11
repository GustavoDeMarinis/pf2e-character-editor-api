import Router from "express-promise-router";
import { authorize } from "../../middleware/security/authorization";
import { UserRole } from "@prisma/client";
import {
  handleSearchFeat,
  handleGetFeat,
  handlePostFeat,
  handlePatchFeat,
  handleDeleteFeat,
} from "./feat-api";

const router = Router();

router.get(
  "/",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleSearchFeat
);
router.get(
  "/:featId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleGetFeat
);
router.post(
  "/",
  authorize({ roles: [UserRole.Admin] }),
  handlePostFeat
);
router.patch(
  "/:featId",
  authorize({ roles: [UserRole.Admin] }),
  handlePatchFeat
);
router.delete(
  "/:featId",
  authorize({ roles: [UserRole.Admin] }),
  handleDeleteFeat
);

export { router };
