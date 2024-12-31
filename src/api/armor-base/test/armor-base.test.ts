import { getFakeArmorBase } from "../../../testing/fakes";
import { mockCount } from "../../../testing/mock-pagination";
import { prismaMock } from "../../../testing/mock-prisma";
import { getPaginationOptions } from "../../../utils/pagination";
import { ErrorCode } from "../../../utils/shared-types";
import {
  deleteArmorBase,
  getArmorBase,
  insertArmorBase,
  searchArmorBase,
  updateArmorBase,
} from "../armor-base";

describe("ArmorBase Service Tests", () => {
  describe("Search ArmorBase", () => {
    test("searchArmorBase returns ArmorBase results", async () => {
      const pagination = getPaginationOptions({});
      const fakeArmorBase = getFakeArmorBase();
      prismaMock.armorBase.findMany.mockResolvedValue([fakeArmorBase]);

      mockCount(prismaMock.armorBase, 1);

      const results = await searchArmorBase(
        { category: fakeArmorBase.category },
        pagination
      );

      expect(results).not.toBeFalsy();
      expect(results).toStrictEqual({
        items: [fakeArmorBase],
        count: 1,
      });
    });

    test("searchArmorBase handles no results", async () => {
      const pagination = getPaginationOptions({});

      prismaMock.armorBase.findMany.mockResolvedValue([]);
      mockCount(prismaMock.armorBase, 0);

      const results = await searchArmorBase(
        // @ts-ignore: Type Error for testing Reason
        { category: "nonexistent" },
        pagination
      );

      expect(prismaMock.armorBase.findMany).toHaveBeenCalledTimes(1);
      expect(results).toStrictEqual({
        items: [],
        count: 0,
      });
    });
  });

  describe("Get ArmorBase", () => {
    test("Should return an ArmorBase", async () => {
      const fakeArmorBase = getFakeArmorBase({
        id: "cl1v51jp9000eqofg5bnu90gd",
      });
      prismaMock.armorBase.findUniqueOrThrow.mockResolvedValue(fakeArmorBase);

      const result = await getArmorBase({ id: fakeArmorBase.id });

      expect(result).not.toBeFalsy();
      expect(result).toBe(fakeArmorBase);
    });

    test("Should throw an error when ArmorBase not found", async () => {
      const fakeArmorBaseId = "nonexistent-id";
      prismaMock.armorBase.findUniqueOrThrow.mockRejectedValue(
        new Error("ArmorBase not found")
      );

      await expect(getArmorBase({ id: fakeArmorBaseId })).rejects.toThrow(
        "ArmorBase not found"
      );
      expect(prismaMock.armorBase.findUniqueOrThrow).toHaveBeenCalledTimes(1);
    });
  });

  describe("Insert ArmorBase", () => {
    test("insertArmorBase inserts and returns new ArmorBase", async () => {
      const fakeArmorBase = getFakeArmorBase();
      prismaMock.armorBase.findMany.mockResolvedValue([]);
      prismaMock.armorBase.create.mockResolvedValue(fakeArmorBase);

      const result = await insertArmorBase({
        ...fakeArmorBase,
        traitIds: [],
        armorGroupId: fakeArmorBase.armorGroupId,
      });

      expect(prismaMock.armorBase.create).toHaveBeenCalledTimes(1);
      expect(result).not.toBeFalsy();
      expect(result).toBe(fakeArmorBase);
    });

    test("insertArmorBase handles name conflict", async () => {
      const fakeArmorBase = getFakeArmorBase();
      prismaMock.armorBase.findMany.mockResolvedValue([fakeArmorBase]);

      const result = await insertArmorBase({
        ...fakeArmorBase,
        traitIds: [],
        armorGroupId: fakeArmorBase.armorGroupId,
      });

      expect(result).toStrictEqual({
        code: ErrorCode.DataConflict,
        message: "There is already a Armor Base record with that name",
      });
    });
  });

  describe("Update ArmorBase", () => {
    test("updateArmorBase updates and returns updated ArmorBase", async () => {
      const newArmorBaseName = "Updated Name";
      const fakeArmorBase = getFakeArmorBase({
        id: "cl1v51jp9000eqofg5bnu90gd",
      });
      prismaMock.armorBase.update.mockResolvedValue({
        ...fakeArmorBase,
        name: newArmorBaseName,
      });

      const result = await updateArmorBase(
        { id: fakeArmorBase.id },
        { name: newArmorBaseName }
      );

      expect(prismaMock.armorBase.update).toHaveBeenCalledTimes(1);
      expect(result).not.toBeFalsy();
      expect(result).toStrictEqual({
        ...fakeArmorBase,
        name: newArmorBaseName,
      });
    });
  });

  describe("Delete ArmorBase", () => {
    test("deleteArmorBase deletes and returns deleted ArmorBase", async () => {
      const now = new Date();
      const fakeArmorBase = getFakeArmorBase({
        id: "cl1v51jp9000eqofg5bnu90gd",
      });
      prismaMock.armorBase.findUnique.mockResolvedValue(fakeArmorBase);
      prismaMock.armorBase.update.mockResolvedValue({
        ...fakeArmorBase,
        deletedAt: now,
      });

      const result = await deleteArmorBase({ id: fakeArmorBase.id });

      expect(prismaMock.armorBase.update).toHaveBeenCalledTimes(1);
      expect(result).not.toBeFalsy();
      expect(result).toStrictEqual({
        ...fakeArmorBase,
        deletedAt: now,
      });
    });

    test("deleteArmorBase handles non-existing ArmorBase", async () => {
      const fakeArmorBaseId = "nonexistent-id";

      prismaMock.armorBase.findUnique.mockResolvedValue(null);

      const result = await deleteArmorBase({ id: fakeArmorBaseId });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Armor Base Not Found",
      });
      expect(prismaMock.armorBase.update).not.toHaveBeenCalled();
    });
  });
});
