import { getFakeWeaponBase } from "../../../testing/fakes";
import { mockCount } from "../../../testing/mock-pagination";
import { prismaMock } from "../../../testing/mock-prisma";
import { traitIds } from "../../../utils/global-const";
import { getPaginationOptions } from "../../../utils/pagination";
import { ErrorCode } from "../../../utils/shared-types";
import {
  deleteWeaponBase,
  getWeaponBase,
  insertWeaponBase,
  searchWeaponBase,
  updateWeaponBase,
} from "../weapon-base";

describe("WeaponBase tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Search WeaponBase", () => {
    test("searchWeaponBase returns Weapon Base", async () => {
      const pagination = getPaginationOptions({});
      const fakeWeaponBase = getFakeWeaponBase();

      prismaMock.weaponBase.findMany.mockResolvedValue([fakeWeaponBase]);
      mockCount(prismaMock.weaponBase, 1);

      const results = await searchWeaponBase(
        { category: fakeWeaponBase.category },
        pagination
      );

      expect(prismaMock.weaponBase.findMany).toHaveBeenCalledTimes(1);
      expect(results).toStrictEqual({
        items: [fakeWeaponBase],
        count: 1,
      });
    });
  });

  describe("Get WeaponBase", () => {
    test("Should return a WeaponBase", async () => {
      const fakeWeaponBase = getFakeWeaponBase({
        id: "cl1v51jp9000eqofg5bnu90gd",
      });
      prismaMock.weaponBase.findUniqueOrThrow.mockResolvedValue(fakeWeaponBase);
      const weaponBase = await getWeaponBase({ id: fakeWeaponBase.id });
      expect(weaponBase).not.toBeFalsy();
      expect(weaponBase).toBe(fakeWeaponBase);
    });

    test("Should throw an error when Weapon Base not found", async () => {
      const fakeWeaponBaseId = "nonexistent-id";
      prismaMock.weaponBase.findUniqueOrThrow.mockRejectedValue(
        new Error("Weapon Base not found")
      );

      await expect(getWeaponBase({ id: fakeWeaponBaseId })).rejects.toThrow(
        "Weapon Base not found"
      );
      expect(prismaMock.weaponBase.findUniqueOrThrow).toHaveBeenCalledTimes(1);
    });
  });

  describe("Insert WeaponBase", () => {
    test("insertWeaponBase inserts and returns new WeaponBase", async () => {
      const fakeWeaponBase = getFakeWeaponBase();
      prismaMock.weaponBase.findMany.mockResolvedValue([]);
      prismaMock.weaponBase.create.mockResolvedValue(fakeWeaponBase);
      const result = await insertWeaponBase({
        ...fakeWeaponBase,
        traitIds: [traitIds.nonlethal],
      });

      expect(prismaMock.weaponBase.create).toHaveBeenCalledTimes(1);
      expect(result).not.toBeFalsy();
      expect(result).toBe(fakeWeaponBase);
    });

    test("insertWeaponBase handles Weapon Base conflict", async () => {
      const fakeWeaponBase = getFakeWeaponBase();
      prismaMock.weaponBase.findMany.mockResolvedValue([fakeWeaponBase]);

      const result = await insertWeaponBase({
        ...fakeWeaponBase,
        traitIds: [traitIds.nonlethal],
      });

      expect(result).toStrictEqual({
        code: ErrorCode.DataConflict,
        message: "There is already a Weapon Base record with that name",
      });
    });
  });

  describe("Update WeaponBase", () => {
    test("updateWeaponBase updates and returns updated WeaponBase", async () => {
      const newWeaponBase = "Pepi";
      const fakeWeaponBase = getFakeWeaponBase({
        id: "cl1v51jp9000eqofg5bnu90gd",
      });
      prismaMock.weaponBase.update.mockResolvedValue({
        ...fakeWeaponBase,
        name: newWeaponBase,
      });
      const result = await updateWeaponBase(
        { id: fakeWeaponBase.id },
        {
          name: newWeaponBase,
        }
      );

      expect(prismaMock.weaponBase.update).toHaveBeenCalledTimes(1);
      expect(result).not.toBeFalsy();
      expect(result).toStrictEqual({
        ...fakeWeaponBase,
        name: newWeaponBase,
      });
    });
  });

  describe("Delete WeaponBase", () => {
    test("deleteWeaponBase deletes and returns deleted WeaponBase", async () => {
      const now = new Date();
      const fakeWeaponBase = getFakeWeaponBase({
        id: "cl1v51jp9000eqofg5bnu90gd",
      });
      prismaMock.weaponBase.findUnique.mockResolvedValue(fakeWeaponBase);
      prismaMock.weaponBase.update.mockResolvedValue({
        ...fakeWeaponBase,
        deletedAt: now,
      });
      const result = await deleteWeaponBase({ id: fakeWeaponBase.id });

      expect(prismaMock.weaponBase.update).toHaveBeenCalledTimes(1);
      expect(result).not.toBeFalsy();
      expect(result).toStrictEqual({
        ...fakeWeaponBase,
        deletedAt: now,
      });
    });

    test("deleteWeaponBase handles non-existing WeaponBase", async () => {
      const fakeWeaponBaseId = "nonexistent-id";

      prismaMock.weaponBase.findUnique.mockResolvedValue(null);

      const result = await deleteWeaponBase({ id: fakeWeaponBaseId });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Weapon Base Not Found",
      });
      expect(prismaMock.weaponBase.update).not.toHaveBeenCalled();
    });
  });
});
