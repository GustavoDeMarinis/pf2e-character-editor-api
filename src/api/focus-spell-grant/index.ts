import Router from "express-promise-router";

import { authorize } from "../../middleware/security/authorization";
import { UserRole } from "@prisma/client";
import {
  handleSearchFocusSpellGrant,
  handleGetFocusSpellGrant,
  handlePostFocusSpellGrant,
  handlePatchFocusSpellGrant,
  handleDeleteFocusSpellGrant,
} from "./focus-spell-grant-api";

const router = Router();

router.get(
  "/",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleSearchFocusSpellGrant
);
router.get(
  "/:focusSpellGrantId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleGetFocusSpellGrant
);
router.post(
  "/",
  authorize({ roles: [UserRole.Admin] }),
  handlePostFocusSpellGrant
);
router.patch(
  "/:focusSpellGrantId",
  authorize({ roles: [UserRole.Admin] }),
  handlePatchFocusSpellGrant
);
router.delete(
  "/:focusSpellGrantId",
  authorize({ roles: [UserRole.Admin] }),
  handleDeleteFocusSpellGrant
);

export { router };
