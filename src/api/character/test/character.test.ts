import { getFakeCharacter } from "../../../testing/fakes";
import { mockCount } from "../../../testing/mock-pagination";
import { prismaMock } from "../../../testing/mock-prisma";
import { getPaginationOptions } from "../../../utils/pagination";
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
      prismaMock.character.findMany.mockResolvedValue([fakeCharacter]);

      mockCount(prismaMock.character, 1);

      const results = await searchCharacters(
        { playerName: fakeCharacter.characterName },
        pagination
      );

      expect(results).not.toBeFalsy();
      expect(results).toStrictEqual({
        items: [fakeCharacter],
        count: 1,
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
  });
});
