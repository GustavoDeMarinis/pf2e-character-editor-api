import Router from "express-promise-router";

import { authorize } from "../../middleware/security/authorization";
import { UserRole } from "@prisma/client";
import {
  handleSearchHeritage,
  handleGetHeritage,
  handlePostHeritage,
  handlePatchHeritage,
  handleDeleteHeritage,
} from "./heritage-api";

const router = Router();

router.get(
  "/",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleSearchHeritage
);
router.get(
  "/:heritageId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleGetHeritage
);
router.post(
  "/",
  authorize({ roles: [UserRole.Admin] }),
  handlePostHeritage
);
router.patch(
  "/:heritageId",
  authorize({ roles: [UserRole.Admin] }),
  handlePatchHeritage
);
router.delete(
  "/:heritageId",
  authorize({ roles: [UserRole.Admin] }),
  handleDeleteHeritage
);

export { router };
