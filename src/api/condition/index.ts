import Router from "express-promise-router";
import { authorize } from "../../middleware/security/authorization";
import { UserRole } from "@prisma/client";
import {
  handleDeleteCondition,
  handleGetCondition,
  handlePatchCondition,
  handlePostCondition,
  handleSearchConditions,
} from "./condition-api";

const router = Router();

router.get(
  "/",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleSearchConditions
);
router.get(
  "/:conditionId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleGetCondition
);
router.post("/", authorize({ roles: [UserRole.Admin] }), handlePostCondition);
router.patch(
  "/:conditionId",
  authorize({ roles: [UserRole.Admin] }),
  handlePatchCondition
);
router.delete(
  "/:conditionId",
  authorize({ roles: [UserRole.Admin] }),
  handleDeleteCondition
);

export { router };
