import Router from "express-promise-router";
import {
  handleDeleteCharacter,
  handleGetCharacter,
  handlePatchCharacter,
  handlePostCharacter,
  handleSearchCharacter,
} from "./character-api";

const router = Router({
  mergeParams: true,
});

router.get("/:characterId", handleGetCharacter);
router.get("/", handleSearchCharacter);
router.post("/", handlePostCharacter);
router.patch("/:characterId", handlePatchCharacter);
router.delete("/:characterId", handleDeleteCharacter);

export { router };
