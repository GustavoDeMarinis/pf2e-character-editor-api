import Router from "express-promise-router";
import {
  handleGetCharacter,
  handlePostCharacter,
  handleSearchCharacter,
} from "./character-api";

const router = Router({
  mergeParams: true,
});

router.get("/:characterId", handleGetCharacter);
router.get("/", handleSearchCharacter);
router.post("/", handlePostCharacter);
// router.patch("/:fileId", handlePatchCharacter);
// router.delete("/:fileId", handleDeleteCharacter);

export { router };
