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
import { router as characterFeatRouter } from "../character-feat";
import { router as characterSpellRouter } from "../character-spell";
import { router as characterConditionRouter } from "../character-condition";

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

router.use("/:characterId/feats", characterFeatRouter);
router.use("/:characterId/spells", characterSpellRouter);
router.use("/:characterId/conditions", characterConditionRouter);

export { router };
