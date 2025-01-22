import Router from "express-promise-router";

import { authorize } from "../../middleware/security/authorization";
import { UserRole } from "@prisma/client";
import {
  handleDeleteLanguage,
  handleGetLanguage,
  handlePatchLanguage,
  handlePostLanguage,
  handleSearchLanguage,
} from "./language-api";

const router = Router();

router.get(
  "/",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleSearchLanguage
);
router.get(
  "/:characterId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleGetLanguage
);
router.post(
  "/",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handlePostLanguage
);
router.patch(
  "/:characterId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handlePatchLanguage
);
router.delete(
  "/:characterId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleDeleteLanguage
);

export { router };
