import Router from "express-promise-router";
import { UserRole } from "@prisma/client";
import { authorize } from "../../middleware/security/authorization";
import {
  handleAssignSpellToCharacter,
  handleListCharacterSpells,
  handleRemoveSpellFromCharacter,
} from "./character-spell-api";

const router = Router({ mergeParams: true });

router.get(
  "/",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleListCharacterSpells
);
router.post(
  "/",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleAssignSpellToCharacter
);
router.delete(
  "/:characterSpellId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleRemoveSpellFromCharacter
);

export { router };
