import { Rarity } from "@prisma/client";
import { getFakeRitual, getFakeRitualHeightening } from "../../../testing/fakes";
import { mockCount } from "../../../testing/mock-pagination";
import { prismaMock } from "../../../testing/mock-prisma";
import { getPaginationOptions } from "../../../utils/pagination";
import { ErrorCode } from "../../../utils/shared-types";
import {
  deleteRitual,
  getRitual,
  insertRitual,
  searchRituals,
  updateRitual,
} from "../ritual";

const baseRitualInput = {
  name: "Test Ritual",
  description: "A test ritual description.",
  rank: 5,
  rarity: Rarity.Common,
  castTime: "1 day",
  cost: null,
  primaryCheck: "Religion (master)",
  secondaryCasters: 0,
  range: null,
  targets: null,
  duration: null,
  criticalSuccess: null,
  success: null,
  failure: null,
  criticalFailure: null,
  traitIds: [] as string[],
  secondaryCheckSkillIds: [] as string[],
  heightenings: [] as Array<{ fixedRank: number; effect: string }>,
};

describe("Ritual tests", () => {
  describe("Search Rituals", () => {
    test("searchRituals returns rituals", async () => {
      const fakeRitual = {
        ...getFakeRitual(),
        traits: [],
        secondaryCheckSkills: [],
        heightenings: [],
      };
      prismaMock.ritual.findMany.mockResolvedValue([fakeRitual] as any);
      mockCount(prismaMock.ritual, 1);

      const results = await searchRituals({}, getPaginationOptions({}));

      expect(results).toStrictEqual({ items: [fakeRitual], count: 1 });
    });

    test("searchRituals handles empty results", async () => {
      prismaMock.ritual.findMany.mockResolvedValue([]);
      mockCount(prismaMock.ritual, 0);

      const results = await searchRituals({}, getPaginationOptions({}));

      expect(results).toStrictEqual({ items: [], count: 0 });
    });

    test("searchRituals applies OR clause on name and description for search filter", async () => {
      prismaMock.ritual.findMany.mockResolvedValue([]);
      mockCount(prismaMock.ritual, 0);

      await searchRituals({ search: "resurrect" }, getPaginationOptions({}));

      expect(prismaMock.ritual.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { name: { contains: "resurrect", mode: "insensitive" } },
              { description: { contains: "resurrect", mode: "insensitive" } },
            ],
          }),
        })
      );
    });

    test("searchRituals applies gte and lte for minRank and maxRank", async () => {
      prismaMock.ritual.findMany.mockResolvedValue([]);
      mockCount(prismaMock.ritual, 0);

      await searchRituals({ minRank: 5, maxRank: 10 }, getPaginationOptions({}));

      expect(prismaMock.ritual.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            rank: expect.objectContaining({ gte: 5, lte: 10 }),
          }),
        })
      );
    });

    test("searchRituals applies traits.every mapping for traitIds", async () => {
      prismaMock.ritual.findMany.mockResolvedValue([]);
      mockCount(prismaMock.ritual, 0);

      const traitIds = ["trait-id-1", "trait-id-2"];
      await searchRituals({ traitIds }, getPaginationOptions({}));

      expect(prismaMock.ritual.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            traits: { every: { id: { in: traitIds } } },
          }),
        })
      );
    });

    test("searchRituals applies secondaryCheckSkills.every mapping for secondaryCheckSkillIds", async () => {
      prismaMock.ritual.findMany.mockResolvedValue([]);
      mockCount(prismaMock.ritual, 0);

      const secondaryCheckSkillIds = ["skill-id-1"];
      await searchRituals({ secondaryCheckSkillIds }, getPaginationOptions({}));

      expect(prismaMock.ritual.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            secondaryCheckSkills: {
              every: { id: { in: secondaryCheckSkillIds } },
            },
          }),
        })
      );
    });
  });

  describe("Get Ritual", () => {
    test("getRitual returns ritual by id", async () => {
      const fakeRitual = {
        ...getFakeRitual(),
        traits: [],
        secondaryCheckSkills: [],
        heightenings: [],
      };
      prismaMock.ritual.findUniqueOrThrow.mockResolvedValue(fakeRitual as any);

      const result = await getRitual({ id: fakeRitual.id });

      expect(result).toBe(fakeRitual);
    });

    test("getRitual throws when findUniqueOrThrow rejects", async () => {
      prismaMock.ritual.findUniqueOrThrow.mockRejectedValue(
        new Error("Ritual not found")
      );

      await expect(getRitual({ id: "missing-id" })).rejects.toThrow(
        "Ritual not found"
      );
    });
  });

  describe("Insert Ritual", () => {
    test("insertRitual creates a ritual with nested heightenings and secondaryCheckSkills", async () => {
      const fakeHeightening = getFakeRitualHeightening({ fixedRank: 10 });
      const fakeRitual = {
        ...getFakeRitual(),
        traits: [],
        secondaryCheckSkills: [{ id: "skill-1", name: "Medicine" }],
        heightenings: [fakeHeightening],
      };
      prismaMock.skill.findMany.mockResolvedValue([{ id: "skill-1" }] as any);
      prismaMock.ritual.findFirst.mockResolvedValue(null);
      prismaMock.ritual.create.mockResolvedValue(fakeRitual as any);

      const result = await insertRitual({
        ...baseRitualInput,
        secondaryCheckSkillIds: ["skill-1"],
        heightenings: [{ fixedRank: 10, effect: "Resurrect a creature dead for up to 1 century." }],
      });

      expect(prismaMock.ritual.create).toHaveBeenCalledTimes(1);
      expect(result).toBe(fakeRitual);
    });

    test("insertRitual returns 404 when a traitId does not exist", async () => {
      prismaMock.trait.findMany.mockResolvedValue([]);

      const result = await insertRitual({
        ...baseRitualInput,
        traitIds: ["missing-trait-id"],
      });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Trait not found",
      });
      expect(prismaMock.ritual.create).not.toHaveBeenCalled();
    });

    test("insertRitual returns 404 when a secondaryCheckSkillId does not exist", async () => {
      prismaMock.skill.findMany.mockResolvedValue([]);

      const result = await insertRitual({
        ...baseRitualInput,
        secondaryCheckSkillIds: ["missing-skill-id"],
      });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Skill not found",
      });
      expect(prismaMock.ritual.create).not.toHaveBeenCalled();
    });

    test("insertRitual returns 409 when an active ritual with the same name exists", async () => {
      const existing = { id: "existing-id", deletedAt: null };
      prismaMock.ritual.findFirst.mockResolvedValue(existing as any);

      const result = await insertRitual(baseRitualInput);

      expect(result).toStrictEqual({
        code: ErrorCode.DataConflict,
        message: "A ritual with that name already exists",
      });
      expect(prismaMock.ritual.create).not.toHaveBeenCalled();
    });

    test("insertRitual allows creation when existing ritual is soft-deleted", async () => {
      const softDeleted = { id: "soft-deleted-id", deletedAt: new Date() };
      const fakeRitual = {
        ...getFakeRitual(),
        traits: [],
        secondaryCheckSkills: [],
        heightenings: [],
      };
      prismaMock.ritual.findFirst.mockResolvedValue(softDeleted as any);
      prismaMock.ritual.create.mockResolvedValue(fakeRitual as any);

      const result = await insertRitual(baseRitualInput);

      expect(prismaMock.ritual.create).toHaveBeenCalledTimes(1);
      expect(result).toBe(fakeRitual);
    });
  });

  describe("Update Ritual", () => {
    test("updateRitual updates a ritual without touching heightenings", async () => {
      const fakeRitual = getFakeRitual({ deletedAt: null });
      const updated = { ...fakeRitual, name: "Updated Name" };
      prismaMock.ritual.findUnique.mockResolvedValue(fakeRitual);
      prismaMock.ritual.update.mockResolvedValue(updated);

      const result = await updateRitual(
        { id: fakeRitual.id },
        { name: "Updated Name" }
      );

      expect(prismaMock.ritual.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.$transaction).not.toHaveBeenCalled();
      expect(result).toStrictEqual(updated);
    });

    test("updateRitual with heightenings runs $transaction (deleteMany + createMany called once)", async () => {
      const fakeRitual = getFakeRitual({ deletedAt: null });
      const updated = { ...fakeRitual, name: "Updated" };
      prismaMock.ritual.findUnique.mockResolvedValue(fakeRitual);
      prismaMock.$transaction.mockResolvedValueOnce([undefined, undefined, updated]);

      const result = await updateRitual(
        { id: fakeRitual.id },
        {
          name: "Updated",
          heightenings: [{ fixedRank: 7, effect: "Replacement effect at rank 7." }],
        }
      );

      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
      expect(prismaMock.ritualHeightening.deleteMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { ritualId: fakeRitual.id } })
      );
      expect(prismaMock.ritualHeightening.createMany).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(updated);
    });

    test("updateRitual returns 404 when ritual does not exist", async () => {
      prismaMock.ritual.findUnique.mockResolvedValue(null);

      const result = await updateRitual(
        { id: "missing-id" },
        { name: "Whatever" }
      );

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Ritual Not Found",
      });
      expect(prismaMock.ritual.update).not.toHaveBeenCalled();
    });

    test("updateRitual returns 404 when ritual is already soft-deleted", async () => {
      const deletedRitual = getFakeRitual({ deletedAt: new Date() });
      prismaMock.ritual.findUnique.mockResolvedValue(deletedRitual);

      const result = await updateRitual(
        { id: deletedRitual.id },
        { name: "Whatever" }
      );

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Ritual Not Found",
      });
      expect(prismaMock.ritual.update).not.toHaveBeenCalled();
    });
  });

  describe("Delete Ritual", () => {
    test("deleteRitual soft-deletes an active ritual", async () => {
      const fakeRitual = getFakeRitual({ deletedAt: null });
      const deleted = { ...fakeRitual, deletedAt: new Date() };
      prismaMock.ritual.findUnique.mockResolvedValue(fakeRitual);
      prismaMock.ritual.update.mockResolvedValue(deleted);

      const result = await deleteRitual({ id: fakeRitual.id });

      expect(prismaMock.ritual.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ deletedAt: expect.any(Date) }),
        })
      );
      expect((result as typeof deleted).deletedAt).toBeTruthy();
    });

    test("deleteRitual returns 404 when ritual does not exist", async () => {
      prismaMock.ritual.findUnique.mockResolvedValue(null);

      const result = await deleteRitual({ id: "missing-id" });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Ritual Not Found",
      });
      expect(prismaMock.ritual.update).not.toHaveBeenCalled();
    });

    test("deleteRitual returns 404 when ritual is already soft-deleted", async () => {
      const deletedRitual = getFakeRitual({ deletedAt: new Date() });
      prismaMock.ritual.findUnique.mockResolvedValue(deletedRitual);

      const result = await deleteRitual({ id: deletedRitual.id });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Ritual Not Found",
      });
      expect(prismaMock.ritual.update).not.toHaveBeenCalled();
    });
  });
});
