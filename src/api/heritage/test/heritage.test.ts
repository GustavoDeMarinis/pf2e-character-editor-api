import { getFakeAncestry, getFakeHeritage, getFakeTrait } from "../../../testing/fakes";
import { mockCount } from "../../../testing/mock-pagination";
import { prismaMock } from "../../../testing/mock-prisma";
import { getPaginationOptions } from "../../../utils/pagination";
import { ErrorCode } from "../../../utils/shared-types";
import {
  deleteHeritage,
  getHeritage,
  insertHeritage,
  searchHeritages,
  updateHeritage,
} from "../heritage";

describe("Heritage tests", () => {
  describe("Search Heritage", () => {
    test("searchHeritages returns heritages", async () => {
      const pagination = getPaginationOptions({});
      const fakeHeritage = getFakeHeritage();
      prismaMock.heritage.findMany.mockResolvedValue([fakeHeritage]);
      mockCount(prismaMock.heritage, 1);

      const results = await searchHeritages({}, pagination);

      expect(results).not.toBeFalsy();
      expect(results).toStrictEqual({ items: [fakeHeritage], count: 1 });
    });

    test("searchHeritages handles no results", async () => {
      const pagination = getPaginationOptions({});
      prismaMock.heritage.findMany.mockResolvedValue([]);
      mockCount(prismaMock.heritage, 0);

      const results = await searchHeritages({}, pagination);

      expect(prismaMock.heritage.findMany).toHaveBeenCalledTimes(1);
      expect(results).toStrictEqual({ items: [], count: 0 });
    });
  });

  describe("Get Heritage", () => {
    test("should return a heritage", async () => {
      const fakeHeritage = getFakeHeritage({ id: "test-id" });
      prismaMock.heritage.findUniqueOrThrow.mockResolvedValue(fakeHeritage);

      const result = await getHeritage({ id: fakeHeritage.id });

      expect(result).not.toBeFalsy();
      expect(result).toBe(fakeHeritage);
    });

    test("should throw when heritage not found", async () => {
      prismaMock.heritage.findUniqueOrThrow.mockRejectedValue(
        new Error("Heritage not found")
      );

      await expect(getHeritage({ id: "nonexistent-id" })).rejects.toThrow(
        "Heritage not found"
      );
    });
  });

  describe("Insert Heritage", () => {
    test("insertHeritage creates and returns new heritage", async () => {
      const fakeAncestry = getFakeAncestry();
      const fakeHeritage = getFakeHeritage({ ancestryId: fakeAncestry.id });
      const fakeTrait = getFakeTrait();

      prismaMock.ancestry.findUnique.mockResolvedValue(fakeAncestry);
      prismaMock.heritage.findFirst.mockResolvedValue(null);
      prismaMock.heritage.create.mockResolvedValue(fakeHeritage);

      const { id, createdAt, updatedAt, deletedAt, ...rest } = fakeHeritage;
      const result = await insertHeritage({ ...rest, traitIds: [fakeTrait.id] });

      expect(prismaMock.heritage.create).toHaveBeenCalledTimes(1);
      expect(result).toBe(fakeHeritage);
    });

    test("insertHeritage returns 404 when ancestry does not exist", async () => {
      const fakeHeritage = getFakeHeritage();
      const fakeTrait = getFakeTrait();

      prismaMock.ancestry.findUnique.mockResolvedValue(null);

      const { id, createdAt, updatedAt, deletedAt, ...rest } = fakeHeritage;
      const result = await insertHeritage({ ...rest, traitIds: [fakeTrait.id] });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Ancestry not found",
      });
      expect(prismaMock.heritage.create).not.toHaveBeenCalled();
    });

    test("insertHeritage returns conflict when name already exists for ancestry", async () => {
      const fakeAncestry = getFakeAncestry();
      const fakeHeritage = getFakeHeritage({ ancestryId: fakeAncestry.id });
      const fakeTrait = getFakeTrait();

      prismaMock.ancestry.findUnique.mockResolvedValue(fakeAncestry);
      prismaMock.heritage.findFirst.mockResolvedValue(fakeHeritage);

      const { id, createdAt, updatedAt, deletedAt, ...rest } = fakeHeritage;
      const result = await insertHeritage({ ...rest, traitIds: [fakeTrait.id] });

      expect(result).toStrictEqual({
        code: ErrorCode.DataConflict,
        message: "A heritage with that name already exists for this ancestry",
      });
      expect(prismaMock.heritage.create).not.toHaveBeenCalled();
    });
  });

  describe("Update Heritage", () => {
    test("updateHeritage updates and returns updated heritage", async () => {
      const newName = "Updated Heritage";
      const fakeHeritage = getFakeHeritage({ id: "test-id" });

      prismaMock.heritage.findUnique.mockResolvedValue(fakeHeritage);
      prismaMock.heritage.update.mockResolvedValue({ ...fakeHeritage, name: newName });

      const result = await updateHeritage({ id: fakeHeritage.id }, { name: newName });

      expect(prismaMock.heritage.update).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual({ ...fakeHeritage, name: newName });
    });

    test("updateHeritage returns 404 when heritage not found", async () => {
      prismaMock.heritage.findUnique.mockResolvedValue(null);

      const result = await updateHeritage({ id: "nonexistent-id" }, { name: "X" });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Heritage Not Found",
      });
      expect(prismaMock.heritage.update).not.toHaveBeenCalled();
    });
  });

  describe("Delete Heritage", () => {
    test("deleteHeritage soft-deletes and returns heritage", async () => {
      const now = new Date();
      const fakeHeritage = getFakeHeritage({ id: "test-id" });

      prismaMock.heritage.findUnique.mockResolvedValue(fakeHeritage);
      prismaMock.heritage.update.mockResolvedValue({ ...fakeHeritage, deletedAt: now });

      const result = await deleteHeritage({ id: fakeHeritage.id });

      expect(prismaMock.heritage.update).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual({ ...fakeHeritage, deletedAt: now });
    });

    test("deleteHeritage returns 404 for non-existing heritage", async () => {
      prismaMock.heritage.findUnique.mockResolvedValue(null);

      const result = await deleteHeritage({ id: "nonexistent-id" });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Heritage Not Found",
      });
      expect(prismaMock.heritage.update).not.toHaveBeenCalled();
    });

    test("deleteHeritage returns 404 for already-deleted heritage", async () => {
      const fakeHeritage = getFakeHeritage({ deletedAt: new Date() });
      prismaMock.heritage.findUnique.mockResolvedValue(fakeHeritage);

      const result = await deleteHeritage({ id: fakeHeritage.id });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Heritage Not Found",
      });
      expect(prismaMock.heritage.update).not.toHaveBeenCalled();
    });
  });
});
