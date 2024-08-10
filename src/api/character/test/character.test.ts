import { getFakeCharacter, getFakeUser } from "../../../testing/fakes";
import { mockCount } from "../../../testing/mock-pagination";
import { prismaMock } from "../../../testing/mock-prisma";
import { getPaginationOptions } from "../../../utils/pagination";
import { ErrorCode } from "../../../utils/shared-types";
import {
  deleteCharacter,
  getCharacter,
  insertCharacter,
  searchCharacters,
  updateCharacter,
} from "../character";

describe("Character tests", () => {
  describe("Search Character", () => {
    test("searchCharacter returns Character", async () => {
      const pagination = getPaginationOptions({});
      const fakeCharacter = getFakeCharacter();
      const fakeUserCreator = getFakeUser();
      const fakeUserAssigned = getFakeUser();
      prismaMock.character.findMany.mockResolvedValue([fakeCharacter]);

      mockCount(prismaMock.character, 1);

      const results = await searchCharacters(
        { userCreatorName: fakeCharacter.characterName },
        pagination
      );

      expect(results).not.toBeFalsy();
      expect(results).toStrictEqual({
        items: [fakeCharacter],
        count: 1,
      });
    });

    test("searchCharacter handles no results", async () => {
      const pagination = getPaginationOptions({});

      prismaMock.character.findMany.mockResolvedValue([]);
      mockCount(prismaMock.character, 0);

      const results = await searchCharacters(
        { userCreatorName: "nonexistent" },
        pagination
      );

      expect(prismaMock.character.findMany).toHaveBeenCalledTimes(1);
      expect(results).toStrictEqual({
        items: [],
        count: 0,
      });
    });
  });
  describe("Get Character", () => {
    test("Should return a Character", async () => {
      const fakeCharacter = getFakeCharacter({
        id: "cl1v51jp9000eqofg5bnu90gd",
      });
      prismaMock.character.findUniqueOrThrow.mockResolvedValue(fakeCharacter);
      const character = await getCharacter({ id: fakeCharacter.id });
      expect(character).not.toBeFalsy();
      expect(character).toBe(fakeCharacter);
    });

    test("Should throw an error when Character not found", async () => {
      const fakeCharacterId = "nonexistent-id";
      prismaMock.character.findUniqueOrThrow.mockRejectedValue(
        new Error("Character not found")
      );

      await expect(getCharacter({ id: fakeCharacterId })).rejects.toThrow(
        "Character not found"
      );
      expect(prismaMock.character.findUniqueOrThrow).toHaveBeenCalledTimes(1);
    });
  });
  describe("Insert Character", () => {
    test("insertCharacter inserts and returns new Character", async () => {
      const fakeCharacter = getFakeCharacter();
      prismaMock.character.findMany.mockResolvedValue([fakeCharacter]);
      prismaMock.character.create.mockResolvedValue(fakeCharacter);
      const result = await insertCharacter(fakeCharacter);

      expect(prismaMock.character.create).toHaveBeenCalledTimes(1);
      expect(result).not.toBeFalsy();
      expect(result).toBe(fakeCharacter);
    });

    test("insertCharacter handles character conflict", async () => {
      const fakeCharacter = getFakeCharacter();
      prismaMock.character.findMany.mockResolvedValue([fakeCharacter]);

      const result = await insertCharacter(fakeCharacter);

      expect(result).toStrictEqual({
        code: ErrorCode.DataConflict,
        message: "User already has an active character with the same name",
      });
    });
  });
  describe("Update Character", () => {
    test("updateCharacter updates and returns updated Character", async () => {
      const newCharacterName = "Pepi";
      const fakeCharacter = getFakeCharacter({
        id: "cl1v51jp9000eqofg5bnu90gd",
      });
      prismaMock.character.update.mockResolvedValue({
        ...fakeCharacter,
        characterName: newCharacterName,
      });
      const result = await updateCharacter(
        { id: fakeCharacter.id },
        {
          characterName: newCharacterName,
        }
      );

      expect(prismaMock.character.update).toHaveBeenCalledTimes(1);
      expect(result).not.toBeFalsy();
      expect(result).toStrictEqual({
        ...fakeCharacter,
        characterName: newCharacterName,
      });
    });
  });
  describe("Delete Character", () => {
    test("deleteCharacter deletes and returns deleted Character", async () => {
      const now = new Date();
      const fakeCharacter = getFakeCharacter({
        id: "cl1v51jp9000eqofg5bnu90gd",
      });
      prismaMock.character.findUnique.mockResolvedValue(fakeCharacter);
      prismaMock.character.update.mockResolvedValue({
        ...fakeCharacter,
        deletedAt: now,
      });
      const result = await deleteCharacter({ id: fakeCharacter.id });

      expect(prismaMock.character.update).toHaveBeenCalledTimes(1);
      expect(result).not.toBeFalsy();
      expect(result).toStrictEqual({
        ...fakeCharacter,
        deletedAt: now,
      });
    });

    test("deleteCharacter handles non-existing character", async () => {
      const fakeCharacterId = "nonexistent-id";

      prismaMock.character.findUnique.mockResolvedValue(null);

      const result = await deleteCharacter({ id: fakeCharacterId });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Character Not Found",
      });
      expect(prismaMock.character.update).not.toHaveBeenCalled();
    });
  });
});
