import Router from "express-promise-router";

import { authorize } from "../../middleware/security/authorization";
import { UserRole } from "@prisma/client";
import { handleGetWeaponBase, handleSearchWeaponBase } from "./weapon-base-api";

const router = Router();

router.get(
  "/",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleSearchWeaponBase
);

router.get(
  "/:weaponBaseId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleGetWeaponBase
);

router.post(
  "/",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handlePostWeaponBase
);

router.patch(
  "/:weaponBaseId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handlePatchWeaponBase
);
router.delete(
  "/:weaponBaseId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleDeleteWeaponBase
);

export { router };
