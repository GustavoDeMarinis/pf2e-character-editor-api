import Router from "express-promise-router";
import { authorize } from "../../middleware/security/authorization";
import { UserRole } from "@prisma/client";
import {
  handleDeleteArmorBase,
  handleGetArmorBase,
  handlePatchArmorBase,
  handlePostArmorBase,
  handleSearchArmorBase,
} from "./armor-base-api";

const router = Router();

router.get(
  "/",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleSearchArmorBase
);

router.get(
  "/:armorBaseId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleGetArmorBase
);

router.post(
  "/",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handlePostArmorBase
);

router.patch(
  "/:armorBaseId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handlePatchArmorBase
);

router.delete(
  "/:armorBaseId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleDeleteArmorBase
);

export { router };
