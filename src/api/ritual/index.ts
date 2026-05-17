import Router from "express-promise-router";
import { authorize } from "../../middleware/security/authorization";
import { UserRole } from "@prisma/client";
import {
  handleSearchRitual,
  handleGetRitual,
  handlePostRitual,
  handlePatchRitual,
  handleDeleteRitual,
} from "./ritual-api";

const router = Router();

router.get(
  "/",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleSearchRitual
);
router.get(
  "/:ritualId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleGetRitual
);
router.post("/", authorize({ roles: [UserRole.Admin] }), handlePostRitual);
router.patch(
  "/:ritualId",
  authorize({ roles: [UserRole.Admin] }),
  handlePatchRitual
);
router.delete(
  "/:ritualId",
  authorize({ roles: [UserRole.Admin] }),
  handleDeleteRitual
);

export { router };
