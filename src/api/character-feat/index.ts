import Router from "express-promise-router";
import { authorize } from "../../middleware/security/authorization";
import { UserRole } from "@prisma/client";
import {
  handleListCharacterFeats,
  handleAssignFeatToCharacter,
  handleRemoveFeatFromCharacter,
} from "./character-feat-api";

const router = Router({ mergeParams: true });

router.get(
  "/",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleListCharacterFeats
);
router.post(
  "/",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleAssignFeatToCharacter
);
router.delete(
  "/:characterFeatId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleRemoveFeatFromCharacter
);

export { router };
