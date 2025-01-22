import {
  getFakeAncestry,
  getFakeLanguage,
  getFakeTrait,
} from "../../../testing/fakes";
import { mockCount } from "../../../testing/mock-pagination";
import { prismaMock } from "../../../testing/mock-prisma";
import { getPaginationOptions } from "../../../utils/pagination";
import { ErrorCode } from "../../../utils/shared-types";
import {
  deleteAncestry,
  getAncestry,
  insertAncestry,
  searchAncestries,
  updateAncestry,
} from "../ancestry";

describe("Ancestry tests", () => {
  describe("Search Ancestry", () => {
    test("searchAncestry returns Ancestry", async () => {
      const pagination = getPaginationOptions({});
      const fakeAncestry = getFakeAncestry();
      prismaMock.ancestry.findMany.mockResolvedValue([fakeAncestry]);

      mockCount(prismaMock.ancestry, 1);

      const results = await searchAncestries({}, pagination);

      expect(results).not.toBeFalsy();
      expect(results).toStrictEqual({
        items: [fakeAncestry],
        count: 1,
      });
    });

    test("searchAncestry handles no results", async () => {
      const pagination = getPaginationOptions({});
      prismaMock.ancestry.findMany.mockResolvedValue([]);
      mockCount(prismaMock.ancestry, 0);

      const results = await searchAncestries({}, pagination);

      expect(prismaMock.ancestry.findMany).toHaveBeenCalledTimes(1);
      expect(results).toStrictEqual({
        items: [],
        count: 0,
      });
    });
  });

  describe("Get Ancestry", () => {
    test("Should return an Ancestry", async () => {
      const fakeAncestry = getFakeAncestry({ id: "test-id" });
      prismaMock.ancestry.findUniqueOrThrow.mockResolvedValue(fakeAncestry);
      const ancestry = await getAncestry({ id: fakeAncestry.id });
      expect(ancestry).not.toBeFalsy();
      expect(ancestry).toBe(fakeAncestry);
    });

    test("Should throw an error when Ancestry not found", async () => {
      prismaMock.ancestry.findUniqueOrThrow.mockRejectedValue(
        new Error("Ancestry not found")
      );
      await expect(getAncestry({ id: "nonexistent-id" })).rejects.toThrow(
        "Ancestry not found"
      );
      expect(prismaMock.ancestry.findUniqueOrThrow).toHaveBeenCalledTimes(1);
    });
  });

  describe("Insert Ancestry", () => {
    test("insertAncestry inserts and returns new Ancestry", async () => {
      const fakeAncestry = getFakeAncestry();
      const fakeLanguage = getFakeLanguage();
      const fakeTrait = getFakeTrait();
      const { id, createdAt, updatedAt, deletedAt, ...fakeAncestryToInsert } =
        fakeAncestry;
      prismaMock.ancestry.findMany.mockResolvedValue([]);
      prismaMock.ancestry.create.mockResolvedValue(fakeAncestry);
      const result = await insertAncestry({
        traitIds: [fakeTrait.id],
        languageIds: [fakeLanguage.id],
        ...fakeAncestryToInsert,
      });

      expect(prismaMock.ancestry.create).toHaveBeenCalledTimes(1);
      expect(result).not.toBeFalsy();
      expect(result).toBe(fakeAncestry);
    });

    test("insertAncestry handles ancestry conflict", async () => {
      const fakeAncestry = getFakeAncestry();
      const fakeLanguage = getFakeLanguage();
      const fakeTrait = getFakeTrait();
      const { id, createdAt, updatedAt, deletedAt, ...fakeAncestryToInsert } =
        fakeAncestry;
      prismaMock.ancestry.findMany.mockResolvedValue([fakeAncestry]);
      prismaMock.ancestry.create.mockResolvedValue(fakeAncestry);
      const result = await insertAncestry({
        traitIds: [fakeTrait.id],
        languageIds: [fakeLanguage.id],
        ...fakeAncestryToInsert,
      });
      expect(result).toStrictEqual({
        code: ErrorCode.DataConflict,
        message: "There is already an Ancestry record with that name",
      });
    });
  });

  describe("Update Ancestry", () => {
    test("updateAncestry updates and returns updated Ancestry", async () => {
      const newName = "Updated Name";
      const fakeAncestry = getFakeAncestry({ id: "test-id" });
      prismaMock.ancestry.update.mockResolvedValue({
        ...fakeAncestry,
        name: newName,
      });
      const result = await updateAncestry(
        { id: fakeAncestry.id },
        { name: newName }
      );

      expect(prismaMock.ancestry.update).toHaveBeenCalledTimes(1);
      expect(result).not.toBeFalsy();
      expect(result).toStrictEqual({
        ...fakeAncestry,
        name: newName,
      });
    });
  });

  describe("Delete Ancestry", () => {
    test("deleteAncestry deletes and returns deleted Ancestry", async () => {
      const now = new Date();
      const fakeAncestry = getFakeAncestry({ id: "test-id" });
      prismaMock.ancestry.findUnique.mockResolvedValue(fakeAncestry);
      prismaMock.ancestry.update.mockResolvedValue({
        ...fakeAncestry,
        deletedAt: now,
      });
      const result = await deleteAncestry({ id: fakeAncestry.id });

      expect(prismaMock.ancestry.update).toHaveBeenCalledTimes(1);
      expect(result).not.toBeFalsy();
      expect(result).toStrictEqual({
        ...fakeAncestry,
        deletedAt: now,
      });
    });

    test("deleteAncestry handles non-existing ancestry", async () => {
      prismaMock.ancestry.findUnique.mockResolvedValue(null);
      const result = await deleteAncestry({ id: "nonexistent-id" });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Ancestry Not Found",
      });
      expect(prismaMock.ancestry.update).not.toHaveBeenCalled();
    });
  });
});
