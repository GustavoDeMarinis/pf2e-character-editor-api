import Router from "express-promise-router";
import { handleSearchCharacter } from "./character-api";

const router = Router();

router.get("/", handleSearchCharacter);
// router.get("/:characterId", handleGetCharacter);
// router.post("/", handlePostCharacter);
// router.patch("/:fileId", handlePatchCharacter);
// router.delete("/:fileId", handleDeleteCharacter);

export { router };
