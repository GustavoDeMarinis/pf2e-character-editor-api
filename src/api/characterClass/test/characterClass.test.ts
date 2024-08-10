import { getFakeCharacterClass } from "../../../testing/fakes";
import { mockCount } from "../../../testing/mock-pagination";
import { prismaMock } from "../../../testing/mock-prisma";
import { getPaginationOptions } from "../../../utils/pagination";
import { ErrorCode } from "../../../utils/shared-types";
import {
  deleteCharacterClass,
  getCharacterClass,
  insertCharacterClass,
  searchCharactersClass,
  updateCharacterClass,
} from "../characterClass";

describe("CharacterClass tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Search CharacterClass", () => {
    test("searchCharactersClass returns CharacterClass", async () => {
      const pagination = getPaginationOptions({});
      const fakeCharacterClass = getFakeCharacterClass();

      prismaMock.characterClass.findMany.mockResolvedValue([
        fakeCharacterClass,
      ]);
      mockCount(prismaMock.characterClass, 1);

      const results = await searchCharactersClass(
        { className: fakeCharacterClass.className },
        pagination
      );

      expect(prismaMock.characterClass.findMany).toHaveBeenCalledTimes(1);
      expect(results).toStrictEqual({
        items: [fakeCharacterClass],
        count: 1,
      });
    });

    test("searchCharactersClass handles no results", async () => {
      const pagination = getPaginationOptions({});

      prismaMock.characterClass.findMany.mockResolvedValue([]);
      mockCount(prismaMock.characterClass, 0);

      const results = await searchCharactersClass(
        { className: "nonexistent" },
        pagination
      );

      expect(prismaMock.characterClass.findMany).toHaveBeenCalledTimes(1);
      expect(results).toStrictEqual({
        items: [],
        count: 0,
      });
    });
  });

  describe("Get CharacterClass", () => {
    test("Should return a CharacterClass", async () => {
      const fakeCharacterClass = getFakeCharacterClass({
        id: "cl1v51jp9000eqofg5bnu90gd",
      });
      prismaMock.characterClass.findUniqueOrThrow.mockResolvedValue(
        fakeCharacterClass
      );

      const characterClass = await getCharacterClass({
        id: fakeCharacterClass.id,
      });

      expect(prismaMock.characterClass.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: fakeCharacterClass.id },
        select: expect.any(Object),
      });
      expect(characterClass).toBe(fakeCharacterClass);
    });

    test("Should throw an error when CharacterClass not found", async () => {
      const fakeCharacterClassId = "nonexistent-id";
      prismaMock.characterClass.findUniqueOrThrow.mockRejectedValue(
        new Error("CharacterClass not found")
      );

      await expect(
        getCharacterClass({ id: fakeCharacterClassId })
      ).rejects.toThrow("CharacterClass not found");
      expect(prismaMock.characterClass.findUniqueOrThrow).toHaveBeenCalledTimes(
        1
      );
    });
  });

  describe("Insert CharacterClass", () => {
    test("insertCharacterClass inserts and returns new CharacterClass", async () => {
      const fakeCharacterClass = getFakeCharacterClass();

      prismaMock.characterClass.findMany.mockResolvedValue([]);
      prismaMock.characterClass.create.mockResolvedValue(fakeCharacterClass);

      const result = await insertCharacterClass(fakeCharacterClass);

      expect(prismaMock.characterClass.findMany).toHaveBeenCalledWith({
        select: expect.any(Object),
        where: { className: fakeCharacterClass.className },
      });
      expect(prismaMock.characterClass.create).toHaveBeenCalledWith({
        select: expect.any(Object),
        data: fakeCharacterClass,
      });
      expect(result).toBe(fakeCharacterClass);
    });

    test("insertCharacterClass handles className conflict", async () => {
      const fakeCharacterClass = getFakeCharacterClass();
      prismaMock.characterClass.findMany.mockResolvedValue([
        fakeCharacterClass,
      ]);

      const result = await insertCharacterClass(fakeCharacterClass);

      expect(result).toStrictEqual({
        code: ErrorCode.DataConflict,
        message: "There is already a characterClass record with that className",
      });
    });
  });

  describe("Update CharacterClass", () => {
    test("updateCharacterClass updates and returns updated CharacterClass", async () => {
      const newClassName = "UpdatedClass";
      const fakeCharacterClass = getFakeCharacterClass({
        id: "cl1v51jp9000eqofg5bnu90gd",
      });

      prismaMock.characterClass.update.mockResolvedValue({
        ...fakeCharacterClass,
        className: newClassName,
      });

      const result = await updateCharacterClass(
        { id: fakeCharacterClass.id },
        { className: newClassName }
      );

      expect(prismaMock.characterClass.update).toHaveBeenCalledWith({
        where: { id: fakeCharacterClass.id },
        data: { className: newClassName },
      });
      expect(result).toStrictEqual({
        ...fakeCharacterClass,
        className: newClassName,
      });
    });
  });

  describe("Delete CharacterClass", () => {
    test("deleteCharacterClass deletes and returns deleted CharacterClass", async () => {
      const now = new Date(); //This needs a date because it fails if not because of disccrepancy between what
      const fakeCharacterClass = getFakeCharacterClass({
        id: "cl1v51jp9000eqofg5bnu90gd",
      });

      prismaMock.characterClass.findUnique.mockResolvedValue(
        fakeCharacterClass
      );
      prismaMock.characterClass.update.mockResolvedValue({
        ...fakeCharacterClass,
        deletedAt: now,
      });

      const result = await deleteCharacterClass({ id: fakeCharacterClass.id });

      expect(prismaMock.characterClass.update).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual({
        ...fakeCharacterClass,
        deletedAt: now,
      });
    });

    test("deleteCharacterClass handles non-existing characterClass", async () => {
      const fakeCharacterClassId = "nonexistent-id";

      prismaMock.characterClass.findUnique.mockResolvedValue(null);

      const result = await deleteCharacterClass({ id: fakeCharacterClassId });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Character Not Found",
      });
      expect(prismaMock.characterClass.update).not.toHaveBeenCalled();
    });
  });
});
