import {
  ActionCost,
  Rarity,
  SpellArea,
  SpellComponent,
  SpellSaveType,
  SpellTargetType,
  SpellTradition,
} from "@prisma/client";
import { getFakeSpell, getFakeSpellHeightening } from "../../../testing/fakes";
import { mockCount } from "../../../testing/mock-pagination";
import { prismaMock } from "../../../testing/mock-prisma";
import { getPaginationOptions } from "../../../utils/pagination";
import { ErrorCode } from "../../../utils/shared-types";
import {
  deleteSpell,
  getSpell,
  insertSpell,
  searchSpells,
  updateSpell,
  withDerivedIsCantrip,
} from "../spell";

const baseSpellInput = {
  name: "Test Spell",
  description: "A test spell description.",
  rank: 1,
  isFocus: false,
  traditions: [SpellTradition.Arcane] as SpellTradition[],
  rarity: Rarity.Common,
  components: [] as SpellComponent[],
  actionCost: ActionCost.One,
  castTimeText: null,
  range: null,
  targets: null,
  targetType: SpellTargetType.None,
  areaType: SpellArea.None,
  areaSize: null,
  duration: null,
  savingThrow: SpellSaveType.None,
  basicSave: false,
  traitIds: [] as string[],
  heightenings: [] as Array<{ interval: number | null; fixedRank: number | null; effect: string }>,
};

describe("Spell tests", () => {
  describe("Search Spells", () => {
    test("searchSpells returns spells", async () => {
      const fakeSpell = { ...getFakeSpell(), traits: [], heightenings: [] };
      prismaMock.spell.findMany.mockResolvedValue([fakeSpell] as any);
      mockCount(prismaMock.spell, 1);

      const results = await searchSpells({}, getPaginationOptions({}));

      expect(results).toStrictEqual({ items: [fakeSpell], count: 1 });
    });

    test("searchSpells handles empty results", async () => {
      prismaMock.spell.findMany.mockResolvedValue([]);
      mockCount(prismaMock.spell, 0);

      const results = await searchSpells({}, getPaginationOptions({}));

      expect(results).toStrictEqual({ items: [], count: 0 });
    });

    test("searchSpells applies OR clause on name and description for search filter", async () => {
      prismaMock.spell.findMany.mockResolvedValue([]);
      mockCount(prismaMock.spell, 0);

      await searchSpells({ search: "fire" }, getPaginationOptions({}));

      expect(prismaMock.spell.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { name: { contains: "fire", mode: "insensitive" } },
              { description: { contains: "fire", mode: "insensitive" } },
            ],
          }),
        })
      );
    });

    test("searchSpells applies has filter for tradition", async () => {
      prismaMock.spell.findMany.mockResolvedValue([]);
      mockCount(prismaMock.spell, 0);

      await searchSpells({ tradition: SpellTradition.Divine }, getPaginationOptions({}));

      expect(prismaMock.spell.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            traditions: { has: SpellTradition.Divine },
          }),
        })
      );
    });

    test("searchSpells applies gte and lte for minRank and maxRank", async () => {
      prismaMock.spell.findMany.mockResolvedValue([]);
      mockCount(prismaMock.spell, 0);

      await searchSpells({ minRank: 1, maxRank: 3 }, getPaginationOptions({}));

      expect(prismaMock.spell.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            rank: expect.objectContaining({ gte: 1, lte: 3 }),
          }),
        })
      );
    });

    test("searchSpells maps isCantrip true to rank equals 0", async () => {
      prismaMock.spell.findMany.mockResolvedValue([]);
      mockCount(prismaMock.spell, 0);

      await searchSpells({ isCantrip: true }, getPaginationOptions({}));

      expect(prismaMock.spell.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            rank: expect.objectContaining({ equals: 0 }),
          }),
        })
      );
    });

    test("searchSpells maps isCantrip false to rank gt 0", async () => {
      prismaMock.spell.findMany.mockResolvedValue([]);
      mockCount(prismaMock.spell, 0);

      await searchSpells({ isCantrip: false }, getPaginationOptions({}));

      expect(prismaMock.spell.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            rank: expect.objectContaining({ gt: 0 }),
          }),
        })
      );
    });
  });

  describe("Get Spell", () => {
    test("getSpell returns spell by id", async () => {
      const fakeSpell = { ...getFakeSpell(), traits: [], heightenings: [] };
      prismaMock.spell.findUniqueOrThrow.mockResolvedValue(fakeSpell as any);

      const result = await getSpell({ id: fakeSpell.id });

      expect(result).toBe(fakeSpell);
    });

    test("getSpell throws when findUniqueOrThrow rejects", async () => {
      prismaMock.spell.findUniqueOrThrow.mockRejectedValue(new Error("Spell not found"));

      await expect(getSpell({ id: "missing-id" })).rejects.toThrow("Spell not found");
    });
  });

  describe("withDerivedIsCantrip", () => {
    test("sets isCantrip to true when rank is 0", () => {
      const spell = getFakeSpell({ rank: 0 });
      expect(withDerivedIsCantrip(spell).isCantrip).toBe(true);
    });

    test("sets isCantrip to false when rank is greater than 0", () => {
      const spell = getFakeSpell({ rank: 3 });
      expect(withDerivedIsCantrip(spell).isCantrip).toBe(false);
    });
  });

  describe("Insert Spell", () => {
    test("insertSpell creates a spell with heightenings", async () => {
      const fakeHeightening = getFakeSpellHeightening({ interval: 1, fixedRank: null });
      const fakeSpell = {
        ...getFakeSpell(),
        traits: [],
        heightenings: [fakeHeightening],
      };
      prismaMock.spell.findFirst.mockResolvedValue(null);
      prismaMock.spell.create.mockResolvedValue(fakeSpell as any);

      const result = await insertSpell({
        ...baseSpellInput,
        heightenings: [{ interval: 1, fixedRank: null, effect: "Increase healing by 1d8." }],
      });

      expect(prismaMock.spell.create).toHaveBeenCalledTimes(1);
      expect(result).toBe(fakeSpell);
    });

    test("insertSpell returns 404 when a traitId does not exist", async () => {
      prismaMock.trait.findMany.mockResolvedValue([]);

      const result = await insertSpell({
        ...baseSpellInput,
        traitIds: ["missing-trait-id"],
      });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Trait not found",
      });
      expect(prismaMock.spell.create).not.toHaveBeenCalled();
    });

    test("insertSpell returns 409 when an active spell with the same name exists", async () => {
      const existing = { id: "existing-id", deletedAt: null };
      prismaMock.spell.findFirst.mockResolvedValue(existing as any);

      const result = await insertSpell(baseSpellInput);

      expect(result).toStrictEqual({
        code: ErrorCode.DataConflict,
        message: "A spell with that name already exists",
      });
      expect(prismaMock.spell.create).not.toHaveBeenCalled();
    });

    test("insertSpell allows creation when existing spell is soft-deleted", async () => {
      const softDeleted = { id: "soft-deleted-id", deletedAt: new Date() };
      const fakeSpell = { ...getFakeSpell(), traits: [], heightenings: [] };
      prismaMock.spell.findFirst.mockResolvedValue(softDeleted as any);
      prismaMock.spell.create.mockResolvedValue(fakeSpell as any);

      const result = await insertSpell(baseSpellInput);

      expect(prismaMock.spell.create).toHaveBeenCalledTimes(1);
      expect(result).toBe(fakeSpell);
    });

    test("insertSpell rejects when a heightening has both interval and fixedRank set", async () => {
      const result = await insertSpell({
        ...baseSpellInput,
        heightenings: [{ interval: 1, fixedRank: 3, effect: "Both set — invalid." }],
      });

      expect(result).toStrictEqual({
        code: ErrorCode.BadRequest,
        message: "Each heightening must have exactly one of `interval` or `fixedRank` set",
      });
      expect(prismaMock.spell.create).not.toHaveBeenCalled();
    });

    test("insertSpell rejects when a heightening has neither interval nor fixedRank set", async () => {
      const result = await insertSpell({
        ...baseSpellInput,
        heightenings: [{ interval: null, fixedRank: null, effect: "Neither set — invalid." }],
      });

      expect(result).toStrictEqual({
        code: ErrorCode.BadRequest,
        message: "Each heightening must have exactly one of `interval` or `fixedRank` set",
      });
      expect(prismaMock.spell.create).not.toHaveBeenCalled();
    });
  });

  describe("Update Spell", () => {
    test("updateSpell updates a spell without touching heightenings", async () => {
      const fakeSpell = getFakeSpell({ deletedAt: null });
      const updated = { ...fakeSpell, name: "Updated Name" };
      prismaMock.spell.findUnique.mockResolvedValue(fakeSpell);
      prismaMock.spell.update.mockResolvedValue(updated);

      const result = await updateSpell({ id: fakeSpell.id }, { name: "Updated Name" });

      expect(prismaMock.spell.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.$transaction).not.toHaveBeenCalled();
      expect(result).toStrictEqual(updated);
    });

    test("updateSpell with heightenings runs $transaction to delete then create", async () => {
      const fakeSpell = getFakeSpell({ deletedAt: null });
      const updated = { ...fakeSpell, name: "Updated" };
      prismaMock.spell.findUnique.mockResolvedValue(fakeSpell);
      prismaMock.$transaction.mockResolvedValueOnce([undefined, undefined, updated]);

      const result = await updateSpell(
        { id: fakeSpell.id },
        {
          name: "Updated",
          heightenings: [{ interval: 1, fixedRank: null, effect: "New effect." }],
        }
      );

      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
      expect(prismaMock.spellHeightening.deleteMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { spellId: fakeSpell.id } })
      );
      expect(prismaMock.spellHeightening.createMany).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(updated);
    });

    test("updateSpell returns 404 when spell does not exist", async () => {
      prismaMock.spell.findUnique.mockResolvedValue(null);

      const result = await updateSpell({ id: "missing-id" }, { name: "Whatever" });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Spell Not Found",
      });
      expect(prismaMock.spell.update).not.toHaveBeenCalled();
    });

    test("updateSpell returns 404 when spell is already soft-deleted", async () => {
      const deletedSpell = getFakeSpell({ deletedAt: new Date() });
      prismaMock.spell.findUnique.mockResolvedValue(deletedSpell);

      const result = await updateSpell({ id: deletedSpell.id }, { name: "Whatever" });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Spell Not Found",
      });
      expect(prismaMock.spell.update).not.toHaveBeenCalled();
    });
  });

  describe("Delete Spell", () => {
    test("deleteSpell soft-deletes an active spell", async () => {
      const fakeSpell = getFakeSpell({ deletedAt: null });
      const deleted = { ...fakeSpell, deletedAt: new Date() };
      prismaMock.spell.findUnique.mockResolvedValue(fakeSpell);
      prismaMock.spell.update.mockResolvedValue(deleted);

      const result = await deleteSpell({ id: fakeSpell.id });

      expect(prismaMock.spell.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ deletedAt: expect.any(Date) }),
        })
      );
      expect((result as typeof deleted).deletedAt).toBeTruthy();
    });

    test("deleteSpell returns 404 when spell does not exist", async () => {
      prismaMock.spell.findUnique.mockResolvedValue(null);

      const result = await deleteSpell({ id: "missing-id" });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Spell Not Found",
      });
      expect(prismaMock.spell.update).not.toHaveBeenCalled();
    });

    test("deleteSpell returns 404 when spell is already soft-deleted", async () => {
      const deletedSpell = getFakeSpell({ deletedAt: new Date() });
      prismaMock.spell.findUnique.mockResolvedValue(deletedSpell);

      const result = await deleteSpell({ id: deletedSpell.id });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Spell Not Found",
      });
      expect(prismaMock.spell.update).not.toHaveBeenCalled();
    });
  });
});
