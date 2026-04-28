import Router from "express-promise-router";
import { authorize } from "../../middleware/security/authorization";
import { UserRole } from "@prisma/client";
import {
  handleSearchDomain,
  handleGetDomain,
  handlePostDomain,
  handlePatchDomain,
  handleDeleteDomain,
} from "./domain-api";

const router = Router();

router.get(
  "/",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleSearchDomain
);
router.get(
  "/:domainId",
  authorize({ roles: [UserRole.Admin, UserRole.Player] }),
  handleGetDomain
);
router.post("/", authorize({ roles: [UserRole.Admin] }), handlePostDomain);
router.patch(
  "/:domainId",
  authorize({ roles: [UserRole.Admin] }),
  handlePatchDomain
);
router.delete(
  "/:domainId",
  authorize({ roles: [UserRole.Admin] }),
  handleDeleteDomain
);

export { router };
