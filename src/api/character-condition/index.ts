import Router from "express-promise-router";
import { authorize } from "../../middleware/security/authorization";
import { UserRole } from "@prisma/client";
import {
  handleApplyConditionToCharacter,
  handleListCharacterConditions,
  handleRemoveConditionFromCharacter,
  handleUpdateCharacterCondition,
} from "./character-condition-api";

const router = Router({ mergeParams: true });

router.get(
  "/",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleListCharacterConditions
);
router.post(
  "/",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleApplyConditionToCharacter
);
router.patch(
  "/:characterConditionId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleUpdateCharacterCondition
);
router.delete(
  "/:characterConditionId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleRemoveConditionFromCharacter
);

export { router };
