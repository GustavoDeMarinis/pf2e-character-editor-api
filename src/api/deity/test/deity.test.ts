import cuid from "cuid";
import {
  getFakeDeity,
  getFakeDomain,
  getFakeTrait,
  getFakeWeaponBase,
} from "../../../testing/fakes";
import { mockCount } from "../../../testing/mock-pagination";
import { prismaMock } from "../../../testing/mock-prisma";
import { getPaginationOptions } from "../../../utils/pagination";
import { ErrorCode } from "../../../utils/shared-types";
import {
  deleteDeity,
  getDeity,
  insertDeity,
  searchDeities,
  updateDeity,
} from "../deity";

const baseInsert = (partial?: object) => ({
  name: "Test Deity",
  rarity: "Common" as const,
  edicts: ["Do good"],
  anathema: ["Do evil"],
  divineAttributes: ["Wisdom" as const],
  sanctification: "HolyOnly" as const,
  divineFont: "Heal" as const,
  divineSkillId: null,
  favoredWeaponId: null,
  domainIds: [] as string[],
  alternateDomainIds: [] as string[],
  traitIds: [] as string[],
  ...partial,
});

describe("Deity tests", () => {
  describe("Search Deity", () => {
    test("searchDeities returns deities", async () => {
      const pagination = getPaginationOptions({});
      const fakeDeity = getFakeDeity();
      prismaMock.deity.findMany.mockResolvedValue([fakeDeity]);
      mockCount(prismaMock.deity, 1);

      const results = await searchDeities({}, pagination);

      expect(results).toStrictEqual({ items: [fakeDeity], count: 1 });
    });

    test("searchDeities handles no results", async () => {
      const pagination = getPaginationOptions({});
      prismaMock.deity.findMany.mockResolvedValue([]);
      mockCount(prismaMock.deity, 0);

      const results = await searchDeities({}, pagination);

      expect(prismaMock.deity.findMany).toHaveBeenCalledTimes(1);
      expect(results).toStrictEqual({ items: [], count: 0 });
    });
  });

  describe("Get Deity", () => {
    test("should return a deity", async () => {
      const fakeDeity = getFakeDeity({ id: "test-id" });
      prismaMock.deity.findUniqueOrThrow.mockResolvedValue(fakeDeity);

      const result = await getDeity({ id: fakeDeity.id });

      expect(result).toBe(fakeDeity);
    });

    test("should throw when deity not found", async () => {
      prismaMock.deity.findUniqueOrThrow.mockRejectedValue(
        new Error("Deity not found")
      );

      await expect(getDeity({ id: "nonexistent-id" })).rejects.toThrow(
        "Deity not found"
      );
    });
  });

  describe("Insert Deity", () => {
    test("insertDeity creates and returns new deity", async () => {
      const fakeDeity = getFakeDeity();

      prismaMock.deity.findFirst.mockResolvedValue(null);
      prismaMock.deity.create.mockResolvedValue(fakeDeity);

      const result = await insertDeity(baseInsert({ name: fakeDeity.name }));

      expect(prismaMock.deity.create).toHaveBeenCalledTimes(1);
      expect(result).toBe(fakeDeity);
    });

    test("insertDeity returns 409 when active deity with same name exists", async () => {
      const fakeDeity = getFakeDeity();

      prismaMock.deity.findFirst.mockResolvedValue(fakeDeity);

      const result = await insertDeity(baseInsert({ name: fakeDeity.name }));

      expect(result).toStrictEqual({
        code: ErrorCode.DataConflict,
        message: "A deity with that name already exists",
      });
      expect(prismaMock.deity.create).not.toHaveBeenCalled();
    });

    test("insertDeity allows creation when existing match is soft-deleted", async () => {
      const fakeDeity = getFakeDeity();
      const softDeleted = getFakeDeity({ name: fakeDeity.name, deletedAt: new Date() });

      prismaMock.deity.findFirst.mockResolvedValue(softDeleted);
      prismaMock.deity.create.mockResolvedValue(fakeDeity);

      const result = await insertDeity(baseInsert({ name: fakeDeity.name }));

      expect(prismaMock.deity.create).toHaveBeenCalledTimes(1);
      expect(result).toBe(fakeDeity);
    });

    test("insertDeity returns 404 when divineSkillId does not exist", async () => {
      const skillId = cuid();

      prismaMock.skill.findUnique.mockResolvedValue(null);

      const result = await insertDeity(baseInsert({ divineSkillId: skillId }));

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Skill not found",
      });
      expect(prismaMock.deity.create).not.toHaveBeenCalled();
    });

    test("insertDeity returns 404 when favoredWeaponId does not exist", async () => {
      const fakeWeapon = getFakeWeaponBase();

      prismaMock.skill.findUnique.mockResolvedValue(null);
      prismaMock.weaponBase.findUnique.mockResolvedValue(null);

      const result = await insertDeity(
        baseInsert({ favoredWeaponId: fakeWeapon.id })
      );

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Weapon not found",
      });
      expect(prismaMock.deity.create).not.toHaveBeenCalled();
    });

    test("insertDeity returns 404 when a domainIds entry does not exist", async () => {
      const domainId = cuid();

      prismaMock.domain.findUnique.mockResolvedValue(null);

      const result = await insertDeity(baseInsert({ domainIds: [domainId] }));

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Domain not found",
      });
      expect(prismaMock.deity.create).not.toHaveBeenCalled();
    });

    test("insertDeity returns 404 when an alternateDomainIds entry does not exist", async () => {
      const fakeDomain = getFakeDomain();
      const missingId = cuid();

      prismaMock.domain.findUnique
        .mockResolvedValueOnce(fakeDomain)
        .mockResolvedValueOnce(null);

      const result = await insertDeity(
        baseInsert({
          domainIds: [fakeDomain.id],
          alternateDomainIds: [missingId],
        })
      );

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Domain not found",
      });
      expect(prismaMock.deity.create).not.toHaveBeenCalled();
    });
  });

  describe("Update Deity", () => {
    test("updateDeity updates and returns updated deity", async () => {
      const newName = "Updated Deity";
      const fakeDeity = getFakeDeity({ id: "test-id" });

      prismaMock.deity.findUnique.mockResolvedValue(fakeDeity);
      prismaMock.deity.update.mockResolvedValue({ ...fakeDeity, name: newName });

      const result = await updateDeity({ id: fakeDeity.id }, { name: newName });

      expect(prismaMock.deity.update).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual({ ...fakeDeity, name: newName });
    });

    test("updateDeity returns 404 when deity not found", async () => {
      prismaMock.deity.findUnique.mockResolvedValue(null);

      const result = await updateDeity({ id: "nonexistent-id" }, { name: "X" });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Deity Not Found",
      });
      expect(prismaMock.deity.update).not.toHaveBeenCalled();
    });

    test("updateDeity returns 404 when deity is already deleted", async () => {
      const fakeDeity = getFakeDeity({ deletedAt: new Date() });
      prismaMock.deity.findUnique.mockResolvedValue(fakeDeity);

      const result = await updateDeity({ id: fakeDeity.id }, { name: "X" });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Deity Not Found",
      });
      expect(prismaMock.deity.update).not.toHaveBeenCalled();
    });
  });

  describe("Delete Deity", () => {
    test("deleteDeity soft-deletes and returns deity", async () => {
      const now = new Date();
      const fakeDeity = getFakeDeity({ id: "test-id" });

      prismaMock.deity.findUnique.mockResolvedValue(fakeDeity);
      prismaMock.deity.update.mockResolvedValue({ ...fakeDeity, deletedAt: now });

      const result = await deleteDeity({ id: fakeDeity.id });

      expect(prismaMock.deity.update).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual({ ...fakeDeity, deletedAt: now });
    });

    test("deleteDeity returns 404 for non-existing deity", async () => {
      prismaMock.deity.findUnique.mockResolvedValue(null);

      const result = await deleteDeity({ id: "nonexistent-id" });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Deity Not Found",
      });
      expect(prismaMock.deity.update).not.toHaveBeenCalled();
    });

    test("deleteDeity returns 404 for already-deleted deity", async () => {
      const fakeDeity = getFakeDeity({ deletedAt: new Date() });
      prismaMock.deity.findUnique.mockResolvedValue(fakeDeity);

      const result = await deleteDeity({ id: fakeDeity.id });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Deity Not Found",
      });
      expect(prismaMock.deity.update).not.toHaveBeenCalled();
    });
  });
});
