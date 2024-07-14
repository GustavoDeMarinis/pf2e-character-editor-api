import Router from "express-promise-router";
import {
  handleDeleteCharacter,
  handleGetCharacter,
  handlePatchCharacter,
  handlePostCharacter,
  handleSearchCharacter,
} from "./character-api";
import { authorize } from "../../middleware/security/authorization";
import { UserRole } from "@prisma/client";

const router = Router();

router.get(
  "/",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleSearchCharacter
);
router.get(
  "/:characterId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleGetCharacter
);
router.post(
  "/",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handlePostCharacter
);
router.patch(
  "/:characterId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handlePatchCharacter
);
router.delete(
  "/:characterId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleDeleteCharacter
);

export { router };
