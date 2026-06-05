import Router from "express-promise-router";

import { authorize } from "../../middleware/security/authorization";
import { UserRole } from "@prisma/client";
import {
  handleSearchEquipment,
  handleGetEquipment,
  handleInsertEquipment,
  handleUpdateEquipment,
  handleDeleteEquipment,
} from "./equipment-api";

const router = Router();

router.get(
  "/",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleSearchEquipment
);
router.get(
  "/:equipmentId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleGetEquipment
);
router.post(
  "/",
  authorize({ roles: [UserRole.Admin] }),
  handleInsertEquipment
);
router.patch(
  "/:equipmentId",
  authorize({ roles: [UserRole.Admin] }),
  handleUpdateEquipment
);
router.delete(
  "/:equipmentId",
  authorize({ roles: [UserRole.Admin] }),
  handleDeleteEquipment
);

export { router };
