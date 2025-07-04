import Router from "express-promise-router";

import { authorize } from "../../middleware/security/authorization";
import { UserRole } from "@prisma/client";
import {
  handleDeleteSkill,
  handleGetSkill,
  handlePatchSkill,
  handlePostSkill,
  handleSearchSkill,
} from "./skill-api";

const router = Router();

router.get(
  "/",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleSearchSkill
);
router.get(
  "/:characterId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleGetSkill
);
router.post(
  "/",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handlePostSkill
);
router.patch(
  "/:characterId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handlePatchSkill
);
router.delete(
  "/:characterId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleDeleteSkill
);

export { router };
