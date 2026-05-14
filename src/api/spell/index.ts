import Router from "express-promise-router";
import { UserRole } from "@prisma/client";

import { authorize } from "../../middleware/security/authorization";
import {
  handleDeleteSpell,
  handleGetSpell,
  handlePatchSpell,
  handlePostSpell,
  handleSearchSpell,
} from "./spell-api";

const router = Router();

router.get(
  "/",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleSearchSpell
);
router.get(
  "/:spellId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleGetSpell
);
router.post("/", authorize({ roles: [UserRole.Admin] }), handlePostSpell);
router.patch(
  "/:spellId",
  authorize({ roles: [UserRole.Admin] }),
  handlePatchSpell
);
router.delete(
  "/:spellId",
  authorize({ roles: [UserRole.Admin] }),
  handleDeleteSpell
);

export { router };
