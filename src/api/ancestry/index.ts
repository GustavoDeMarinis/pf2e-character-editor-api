import Router from "express-promise-router";

import { authorize } from "../../middleware/security/authorization";
import { UserRole } from "@prisma/client";
import {
  handleDeleteAncestry,
  handleGetAncestry,
  handlePatchAncestry,
  handlePostAncestry,
  handleSearchAncestry,
} from "./ancestry-api";

const router = Router();

router.get(
  "/",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleSearchAncestry
);
router.get(
  "/:characterId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleGetAncestry
);
router.post(
  "/",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handlePostAncestry
);
router.patch(
  "/:characterId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handlePatchAncestry
);
router.delete(
  "/:characterId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleDeleteAncestry
);

export { router };
