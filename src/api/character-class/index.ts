import Router from "express-promise-router";

import { authorize } from "../../middleware/security/authorization";
import { UserRole } from "@prisma/client";
import {
  handleDeleteCharacterClass,
  handleGetCharacterClass,
  handlePatchCharacterClass,
  handlePostCharacterClass,
  handleSearchCharacterClass,
} from "./character-class-api";

const router = Router();

router.get(
  "/",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleSearchCharacterClass
);
router.get(
  "/:characterClassId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleGetCharacterClass
);
router.post(
  "/",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handlePostCharacterClass
);
router.patch(
  "/:characterClassId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handlePatchCharacterClass
);
router.delete(
  "/:characterClassId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleDeleteCharacterClass
);

export { router };
