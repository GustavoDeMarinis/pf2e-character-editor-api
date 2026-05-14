import { FeatType, Rarity } from "@prisma/client";
import { getFakeAncestry, getFakeFeat } from "../../../testing/fakes";
import { mockCount } from "../../../testing/mock-pagination";
import { prismaMock } from "../../../testing/mock-prisma";
import { getPaginationOptions } from "../../../utils/pagination";
import { ErrorCode } from "../../../utils/shared-types";
import {
  deleteFeat,
  getFeat,
  insertFeat,
  searchFeats,
  updateFeat,
} from "../feat";

describe("Feat tests", () => {
  describe("Search Feats", () => {
    test("searchFeats returns feats", async () => {
      const pagination = getPaginationOptions({});
      const fakeFeat = getFakeFeat();
      prismaMock.feat.findMany.mockResolvedValue([fakeFeat]);
      mockCount(prismaMock.feat, 1);

      const result = await searchFeats({}, pagination);

      expect(result).toStrictEqual({ items: [fakeFeat], count: 1 });
    });

    test("searchFeats handles empty results", async () => {
      const pagination = getPaginationOptions({});
      prismaMock.feat.findMany.mockResolvedValue([]);
      mockCount(prismaMock.feat, 0);

      const result = await searchFeats({}, pagination);

      expect(result).toStrictEqual({ items: [], count: 0 });
    });

    test("searchFeats builds OR clause for search parameter", async () => {
      const pagination = getPaginationOptions({});
      prismaMock.feat.findMany.mockResolvedValue([]);
      mockCount(prismaMock.feat, 0);

      await searchFeats({ search: "power" }, pagination);

      expect(prismaMock.feat.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { name: { contains: "power", mode: "insensitive" } },
              { description: { contains: "power", mode: "insensitive" } },
            ],
          }),
        })
      );
    });

    test("searchFeats applies lte for maxLevel", async () => {
      const pagination = getPaginationOptions({});
      prismaMock.feat.findMany.mockResolvedValue([]);
      mockCount(prismaMock.feat, 0);

      await searchFeats({ maxLevel: 5 }, pagination);

      expect(prismaMock.feat.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            level: { lte: 5 },
          }),
        })
      );
    });
  });

  describe("Get Feat", () => {
    test("getFeat returns feat by id", async () => {
      const fakeFeat = getFakeFeat({ id: "test-id" });
      prismaMock.feat.findUniqueOrThrow.mockResolvedValue(fakeFeat);

      const result = await getFeat({ id: fakeFeat.id });

      expect(result).toBe(fakeFeat);
    });

    test("getFeat throws when feat not found", async () => {
      prismaMock.feat.findUniqueOrThrow.mockRejectedValue(
        new Error("Feat not found")
      );

      await expect(getFeat({ id: "nonexistent" })).rejects.toThrow(
        "Feat not found"
      );
    });
  });

  describe("Insert Feat", () => {
    test("insertFeat creates and returns a Class feat", async () => {
      const classId = "class-id";
      const fakeFeat = getFakeFeat({ featType: FeatType.Class, characterClassId: classId });

      prismaMock.characterClass.findUnique.mockResolvedValue({ id: classId } as any);
      prismaMock.feat.findFirst.mockResolvedValue(null);
      prismaMock.feat.create.mockResolvedValue(fakeFeat);

      const result = await insertFeat({
        name: fakeFeat.name,
        description: fakeFeat.description,
        featType: FeatType.Class,
        level: 1,
        rarity: Rarity.Common,
        characterClassId: classId,
        traitIds: [],
      });

      expect(prismaMock.feat.create).toHaveBeenCalledTimes(1);
      expect(result).toBe(fakeFeat);
    });

    test("insertFeat returns 404 when characterClassId does not exist", async () => {
      prismaMock.characterClass.findUnique.mockResolvedValue(null);

      const result = await insertFeat({
        name: "Test",
        description: "Test feat",
        featType: FeatType.Class,
        level: 1,
        rarity: Rarity.Common,
        characterClassId: "missing-class-id",
        traitIds: [],
      });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Character class not found",
      });
      expect(prismaMock.feat.create).not.toHaveBeenCalled();
    });

    test("insertFeat returns 404 when ancestryId does not exist", async () => {
      prismaMock.ancestry.findUnique.mockResolvedValue(null);

      const result = await insertFeat({
        name: "Test",
        description: "Test feat",
        featType: FeatType.Ancestry,
        level: 1,
        rarity: Rarity.Common,
        ancestryId: "missing-ancestry-id",
        traitIds: [],
      });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Ancestry not found",
      });
      expect(prismaMock.feat.create).not.toHaveBeenCalled();
    });

    test("insertFeat returns 404 when skillId does not exist", async () => {
      prismaMock.skill.findUnique.mockResolvedValue(null);

      const result = await insertFeat({
        name: "Test",
        description: "Test feat",
        featType: FeatType.Skill,
        level: 1,
        rarity: Rarity.Common,
        skillId: "missing-skill-id",
        traitIds: [],
      });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Skill not found",
      });
      expect(prismaMock.feat.create).not.toHaveBeenCalled();
    });

    test("insertFeat returns 409 when active feat with same name exists", async () => {
      const fakeFeat = getFakeFeat({ deletedAt: null });
      prismaMock.feat.findFirst.mockResolvedValue(fakeFeat);

      const result = await insertFeat({
        name: fakeFeat.name,
        description: "Test",
        featType: FeatType.General,
        level: 1,
        rarity: Rarity.Common,
        traitIds: [],
      });

      expect(result).toStrictEqual({
        code: ErrorCode.DataConflict,
        message: "A feat with that name already exists",
      });
      expect(prismaMock.feat.create).not.toHaveBeenCalled();
    });

    test("insertFeat proceeds when only soft-deleted match exists", async () => {
      const fakeFeat = getFakeFeat({ deletedAt: new Date() });
      const newFeat = getFakeFeat({ name: fakeFeat.name, deletedAt: null });

      prismaMock.feat.findFirst.mockResolvedValue(fakeFeat);
      prismaMock.feat.create.mockResolvedValue(newFeat);

      const result = await insertFeat({
        name: fakeFeat.name,
        description: "Test",
        featType: FeatType.General,
        level: 1,
        rarity: Rarity.Common,
        traitIds: [],
      });

      expect(prismaMock.feat.create).toHaveBeenCalledTimes(1);
      expect(result).toBe(newFeat);
    });
  });

  describe("Update Feat", () => {
    test("updateFeat updates and returns updated feat", async () => {
      const fakeFeat = getFakeFeat({ id: "test-id" });
      const updated = { ...fakeFeat, name: "Updated Name" };

      prismaMock.feat.findUnique.mockResolvedValue(fakeFeat);
      prismaMock.feat.update.mockResolvedValue(updated);

      const result = await updateFeat({ id: fakeFeat.id }, { name: "Updated Name" });

      expect(prismaMock.feat.update).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(updated);
    });

    test("updateFeat returns 404 when feat not found", async () => {
      prismaMock.feat.findUnique.mockResolvedValue(null);

      const result = await updateFeat({ id: "nonexistent" }, { name: "X" });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Feat Not Found",
      });
      expect(prismaMock.feat.update).not.toHaveBeenCalled();
    });

    test("updateFeat returns 404 when feat is already deleted", async () => {
      const fakeFeat = getFakeFeat({ deletedAt: new Date() });
      prismaMock.feat.findUnique.mockResolvedValue(fakeFeat);

      const result = await updateFeat({ id: fakeFeat.id }, { name: "X" });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Feat Not Found",
      });
      expect(prismaMock.feat.update).not.toHaveBeenCalled();
    });
  });

  describe("Delete Feat", () => {
    test("deleteFeat soft-deletes and returns feat", async () => {
      const fakeFeat = getFakeFeat({ id: "test-id" });
      const deletedAt = new Date();

      prismaMock.feat.findUnique.mockResolvedValue(fakeFeat);
      prismaMock.feat.update.mockResolvedValue({ ...fakeFeat, deletedAt });

      const result = await deleteFeat({ id: fakeFeat.id });

      expect(prismaMock.feat.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ deletedAt: expect.any(Date) }) })
      );
      expect((result as typeof fakeFeat).deletedAt).toBeTruthy();
    });

    test("deleteFeat returns 404 when feat not found", async () => {
      prismaMock.feat.findUnique.mockResolvedValue(null);

      const result = await deleteFeat({ id: "nonexistent" });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Feat Not Found",
      });
      expect(prismaMock.feat.update).not.toHaveBeenCalled();
    });

    test("deleteFeat returns 404 when feat already deleted", async () => {
      const fakeFeat = getFakeFeat({ deletedAt: new Date() });
      prismaMock.feat.findUnique.mockResolvedValue(fakeFeat);

      const result = await deleteFeat({ id: fakeFeat.id });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Feat Not Found",
      });
      expect(prismaMock.feat.update).not.toHaveBeenCalled();
    });
  });
});
