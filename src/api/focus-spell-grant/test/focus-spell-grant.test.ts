import { getFakeFocusSpellGrant, getFakeSpell } from "../../../testing/fakes";
import { mockCount } from "../../../testing/mock-pagination";
import { prismaMock } from "../../../testing/mock-prisma";
import { getPaginationOptions } from "../../../utils/pagination";
import { ErrorCode } from "../../../utils/shared-types";
import {
  deleteFocusSpellGrant,
  getFocusSpellGrant,
  insertFocusSpellGrant,
  searchFocusSpellGrants,
  updateFocusSpellGrant,
} from "../focus-spell-grant";

describe("FocusSpellGrant tests", () => {
  describe("Search FocusSpellGrants", () => {
    test("searchFocusSpellGrants returns grants", async () => {
      const fakeGrant = {
        ...getFakeFocusSpellGrant(),
        spell: { id: "spell-1", name: "Lay on Hands", rank: 1, isFocus: true, traditions: [], rarity: "Common" },
        characterClass: { id: "class-1", className: "Champion" },
        domain: null,
      };
      prismaMock.focusSpellGrant.findMany.mockResolvedValue([fakeGrant] as any);
      mockCount(prismaMock.focusSpellGrant, 1);

      const results = await searchFocusSpellGrants({}, getPaginationOptions({}));

      expect(results).toStrictEqual({ items: [fakeGrant], count: 1 });
    });

    test("searchFocusSpellGrants handles empty results", async () => {
      prismaMock.focusSpellGrant.findMany.mockResolvedValue([]);
      mockCount(prismaMock.focusSpellGrant, 0);

      const results = await searchFocusSpellGrants({}, getPaginationOptions({}));

      expect(results).toStrictEqual({ items: [], count: 0 });
    });

    test("searchFocusSpellGrants applies spellId, characterClassId, domainId filters verbatim", async () => {
      prismaMock.focusSpellGrant.findMany.mockResolvedValue([]);
      mockCount(prismaMock.focusSpellGrant, 0);

      await searchFocusSpellGrants(
        { spellId: "spell-1", characterClassId: "class-1", domainId: "domain-1" },
        getPaginationOptions({})
      );

      expect(prismaMock.focusSpellGrant.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            spellId: "spell-1",
            characterClassId: "class-1",
            domainId: "domain-1",
          }),
        })
      );
    });

    test("searchFocusSpellGrants maps isActive=true to deletedAt: null", async () => {
      prismaMock.focusSpellGrant.findMany.mockResolvedValue([]);
      mockCount(prismaMock.focusSpellGrant, 0);

      await searchFocusSpellGrants({ isActive: true }, getPaginationOptions({}));

      expect(prismaMock.focusSpellGrant.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ deletedAt: null }),
        })
      );
    });

    test("searchFocusSpellGrants maps isActive=false to deletedAt: { not: null }", async () => {
      prismaMock.focusSpellGrant.findMany.mockResolvedValue([]);
      mockCount(prismaMock.focusSpellGrant, 0);

      await searchFocusSpellGrants({ isActive: false }, getPaginationOptions({}));

      expect(prismaMock.focusSpellGrant.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ deletedAt: { not: null } }),
        })
      );
    });
  });

  describe("Get FocusSpellGrant", () => {
    test("getFocusSpellGrant returns grant by id", async () => {
      const fakeGrant = {
        ...getFakeFocusSpellGrant(),
        spell: { id: "spell-1", name: "Lay on Hands", rank: 1, isFocus: true, traditions: [], rarity: "Common" },
        characterClass: null,
        domain: { id: "domain-1", name: "Healing" },
      };
      prismaMock.focusSpellGrant.findUniqueOrThrow.mockResolvedValue(fakeGrant as any);

      const result = await getFocusSpellGrant({ id: fakeGrant.id });

      expect(result).toBe(fakeGrant);
    });

    test("getFocusSpellGrant throws when findUniqueOrThrow rejects", async () => {
      prismaMock.focusSpellGrant.findUniqueOrThrow.mockRejectedValue(
        new Error("FocusSpellGrant not found")
      );

      await expect(getFocusSpellGrant({ id: "missing-id" })).rejects.toThrow(
        "FocusSpellGrant not found"
      );
    });
  });

  describe("Insert FocusSpellGrant", () => {
    test("insertFocusSpellGrant happy path (class-scoped) returns nested payload", async () => {
      const focusSpell = getFakeSpell({ isFocus: true });
      const fakeGrant = {
        ...getFakeFocusSpellGrant({
          spellId: focusSpell.id,
          characterClassId: "class-1",
        }),
        spell: { id: focusSpell.id, name: focusSpell.name, rank: 1, isFocus: true, traditions: [], rarity: "Common" },
        characterClass: { id: "class-1", className: "Champion" },
        domain: null,
      };
      prismaMock.spell.findUnique.mockResolvedValue({ id: focusSpell.id, isFocus: true } as any);
      prismaMock.characterClass.findUnique.mockResolvedValue({ id: "class-1" } as any);
      prismaMock.focusSpellGrant.findFirst.mockResolvedValue(null);
      prismaMock.focusSpellGrant.create.mockResolvedValue(fakeGrant as any);

      const result = await insertFocusSpellGrant({
        spellId: focusSpell.id,
        characterClassId: "class-1",
      });

      expect(prismaMock.focusSpellGrant.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            spellId: focusSpell.id,
            characterClassId: "class-1",
            domainId: null,
          }),
        })
      );
      expect(result).toBe(fakeGrant);
    });

    test("insertFocusSpellGrant happy path (domain-scoped) returns nested payload", async () => {
      const focusSpell = getFakeSpell({ isFocus: true });
      const fakeGrant = {
        ...getFakeFocusSpellGrant({
          spellId: focusSpell.id,
          domainId: "domain-1",
        }),
        spell: { id: focusSpell.id, name: focusSpell.name, rank: 1, isFocus: true, traditions: [], rarity: "Common" },
        characterClass: null,
        domain: { id: "domain-1", name: "Healing" },
      };
      prismaMock.spell.findUnique.mockResolvedValue({ id: focusSpell.id, isFocus: true } as any);
      prismaMock.domain.findUnique.mockResolvedValue({ id: "domain-1" } as any);
      prismaMock.focusSpellGrant.findFirst.mockResolvedValue(null);
      prismaMock.focusSpellGrant.create.mockResolvedValue(fakeGrant as any);

      const result = await insertFocusSpellGrant({
        spellId: focusSpell.id,
        domainId: "domain-1",
      });

      expect(prismaMock.focusSpellGrant.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            spellId: focusSpell.id,
            characterClassId: null,
            domainId: "domain-1",
          }),
        })
      );
      expect(result).toBe(fakeGrant);
    });

    test("insertFocusSpellGrant returns 400 when both characterClassId and domainId are set (defence-in-depth)", async () => {
      const result = await insertFocusSpellGrant({
        spellId: "spell-1",
        characterClassId: "class-1",
        domainId: "domain-1",
      });

      expect(result).toStrictEqual({
        code: ErrorCode.BadRequest,
        message: "Exactly one of characterClassId or domainId must be set",
      });
      expect(prismaMock.focusSpellGrant.create).not.toHaveBeenCalled();
    });

    test("insertFocusSpellGrant returns 400 when neither characterClassId nor domainId is set (defence-in-depth)", async () => {
      const result = await insertFocusSpellGrant({ spellId: "spell-1" });

      expect(result).toStrictEqual({
        code: ErrorCode.BadRequest,
        message: "Exactly one of characterClassId or domainId must be set",
      });
      expect(prismaMock.focusSpellGrant.create).not.toHaveBeenCalled();
    });

    test("insertFocusSpellGrant returns 404 when spellId is missing", async () => {
      prismaMock.spell.findUnique.mockResolvedValue(null);

      const result = await insertFocusSpellGrant({
        spellId: "missing-spell",
        characterClassId: "class-1",
      });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Spell not found",
      });
      expect(prismaMock.focusSpellGrant.create).not.toHaveBeenCalled();
    });

    test("insertFocusSpellGrant returns 400 when the referenced spell has isFocus: false", async () => {
      prismaMock.spell.findUnique.mockResolvedValue({ id: "spell-1", isFocus: false } as any);

      const result = await insertFocusSpellGrant({
        spellId: "spell-1",
        characterClassId: "class-1",
      });

      expect(result).toStrictEqual({
        code: ErrorCode.BadRequest,
        message: "Spell is not a focus spell",
      });
      expect(prismaMock.focusSpellGrant.create).not.toHaveBeenCalled();
    });

    test("insertFocusSpellGrant returns 404 when characterClassId is missing", async () => {
      prismaMock.spell.findUnique.mockResolvedValue({ id: "spell-1", isFocus: true } as any);
      prismaMock.characterClass.findUnique.mockResolvedValue(null);

      const result = await insertFocusSpellGrant({
        spellId: "spell-1",
        characterClassId: "missing-class",
      });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "CharacterClass not found",
      });
      expect(prismaMock.focusSpellGrant.create).not.toHaveBeenCalled();
    });

    test("insertFocusSpellGrant returns 404 when domainId is missing", async () => {
      prismaMock.spell.findUnique.mockResolvedValue({ id: "spell-1", isFocus: true } as any);
      prismaMock.domain.findUnique.mockResolvedValue(null);

      const result = await insertFocusSpellGrant({
        spellId: "spell-1",
        domainId: "missing-domain",
      });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Domain not found",
      });
      expect(prismaMock.focusSpellGrant.create).not.toHaveBeenCalled();
    });

    test("insertFocusSpellGrant returns 409 on active duplicate (spellId, characterClassId)", async () => {
      prismaMock.spell.findUnique.mockResolvedValue({ id: "spell-1", isFocus: true } as any);
      prismaMock.characterClass.findUnique.mockResolvedValue({ id: "class-1" } as any);
      prismaMock.focusSpellGrant.findFirst.mockResolvedValue({ id: "existing", deletedAt: null } as any);

      const result = await insertFocusSpellGrant({
        spellId: "spell-1",
        characterClassId: "class-1",
      });

      expect(result).toStrictEqual({
        code: ErrorCode.DataConflict,
        message: "A grant for this spell already exists for the same class",
      });
      expect(prismaMock.focusSpellGrant.create).not.toHaveBeenCalled();
    });

    test("insertFocusSpellGrant allows creation when only a soft-deleted (spellId, characterClassId) match exists", async () => {
      const fakeGrant = getFakeFocusSpellGrant();
      prismaMock.spell.findUnique.mockResolvedValue({ id: "spell-1", isFocus: true } as any);
      prismaMock.characterClass.findUnique.mockResolvedValue({ id: "class-1" } as any);
      prismaMock.focusSpellGrant.findFirst.mockResolvedValue({ id: "soft-deleted", deletedAt: new Date() } as any);
      prismaMock.focusSpellGrant.create.mockResolvedValue(fakeGrant as any);

      const result = await insertFocusSpellGrant({
        spellId: "spell-1",
        characterClassId: "class-1",
      });

      expect(prismaMock.focusSpellGrant.create).toHaveBeenCalledTimes(1);
      expect(result).toBe(fakeGrant);
    });

    test("insertFocusSpellGrant returns 409 on active duplicate (spellId, domainId)", async () => {
      prismaMock.spell.findUnique.mockResolvedValue({ id: "spell-1", isFocus: true } as any);
      prismaMock.domain.findUnique.mockResolvedValue({ id: "domain-1" } as any);
      prismaMock.focusSpellGrant.findFirst.mockResolvedValue({ id: "existing", deletedAt: null } as any);

      const result = await insertFocusSpellGrant({
        spellId: "spell-1",
        domainId: "domain-1",
      });

      expect(result).toStrictEqual({
        code: ErrorCode.DataConflict,
        message: "A grant for this spell already exists for the same domain",
      });
      expect(prismaMock.focusSpellGrant.create).not.toHaveBeenCalled();
    });

    test("insertFocusSpellGrant allows creation when only a soft-deleted (spellId, domainId) match exists", async () => {
      const fakeGrant = getFakeFocusSpellGrant();
      prismaMock.spell.findUnique.mockResolvedValue({ id: "spell-1", isFocus: true } as any);
      prismaMock.domain.findUnique.mockResolvedValue({ id: "domain-1" } as any);
      prismaMock.focusSpellGrant.findFirst.mockResolvedValue({ id: "soft-deleted", deletedAt: new Date() } as any);
      prismaMock.focusSpellGrant.create.mockResolvedValue(fakeGrant as any);

      const result = await insertFocusSpellGrant({
        spellId: "spell-1",
        domainId: "domain-1",
      });

      expect(prismaMock.focusSpellGrant.create).toHaveBeenCalledTimes(1);
      expect(result).toBe(fakeGrant);
    });
  });

  describe("Update FocusSpellGrant", () => {
    test("updateFocusSpellGrant re-scopes class → domain (merged row passes XOR)", async () => {
      const existing = getFakeFocusSpellGrant({
        characterClassId: "class-1",
        domainId: null,
        deletedAt: null,
      });
      const updated = { ...existing, characterClassId: null, domainId: "domain-1" };
      prismaMock.focusSpellGrant.findUnique.mockResolvedValue(existing);
      prismaMock.domain.findUnique.mockResolvedValue({ id: "domain-1" } as any);
      prismaMock.focusSpellGrant.update.mockResolvedValue(updated);

      const result = await updateFocusSpellGrant(
        { id: existing.id },
        { characterClassId: null, domainId: "domain-1" }
      );

      expect(prismaMock.focusSpellGrant.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: existing.id },
          data: expect.objectContaining({
            characterClassId: null,
            domainId: "domain-1",
          }),
        })
      );
      expect(result).toStrictEqual(updated);
    });

    test("updateFocusSpellGrant returns 400 when merged row leaves both FKs populated", async () => {
      const existing = getFakeFocusSpellGrant({
        characterClassId: "class-1",
        domainId: null,
        deletedAt: null,
      });
      prismaMock.focusSpellGrant.findUnique.mockResolvedValue(existing);

      const result = await updateFocusSpellGrant(
        { id: existing.id },
        { domainId: "domain-1" }
      );

      expect(result).toStrictEqual({
        code: ErrorCode.BadRequest,
        message: "Exactly one of characterClassId or domainId must be set",
      });
      expect(prismaMock.focusSpellGrant.update).not.toHaveBeenCalled();
    });

    test("updateFocusSpellGrant returns 400 when merged row leaves neither FK populated", async () => {
      const existing = getFakeFocusSpellGrant({
        characterClassId: "class-1",
        domainId: null,
        deletedAt: null,
      });
      prismaMock.focusSpellGrant.findUnique.mockResolvedValue(existing);

      const result = await updateFocusSpellGrant(
        { id: existing.id },
        { characterClassId: null }
      );

      expect(result).toStrictEqual({
        code: ErrorCode.BadRequest,
        message: "Exactly one of characterClassId or domainId must be set",
      });
      expect(prismaMock.focusSpellGrant.update).not.toHaveBeenCalled();
    });

    test("updateFocusSpellGrant returns 404 when grant does not exist", async () => {
      prismaMock.focusSpellGrant.findUnique.mockResolvedValue(null);

      const result = await updateFocusSpellGrant(
        { id: "missing-id" },
        { characterClassId: "class-1" }
      );

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "FocusSpellGrant Not Found",
      });
      expect(prismaMock.focusSpellGrant.update).not.toHaveBeenCalled();
    });

    test("updateFocusSpellGrant returns 404 when grant is already soft-deleted", async () => {
      const deleted = getFakeFocusSpellGrant({
        characterClassId: "class-1",
        deletedAt: new Date(),
      });
      prismaMock.focusSpellGrant.findUnique.mockResolvedValue(deleted);

      const result = await updateFocusSpellGrant(
        { id: deleted.id },
        { characterClassId: "class-2" }
      );

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "FocusSpellGrant Not Found",
      });
      expect(prismaMock.focusSpellGrant.update).not.toHaveBeenCalled();
    });
  });

  describe("Delete FocusSpellGrant", () => {
    test("deleteFocusSpellGrant soft-deletes an active grant", async () => {
      const existing = getFakeFocusSpellGrant({ deletedAt: null });
      const deleted = { ...existing, deletedAt: new Date() };
      prismaMock.focusSpellGrant.findUnique.mockResolvedValue(existing);
      prismaMock.focusSpellGrant.update.mockResolvedValue(deleted);

      const result = await deleteFocusSpellGrant({ id: existing.id });

      expect(prismaMock.focusSpellGrant.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ deletedAt: expect.any(Date) }),
        })
      );
      expect((result as typeof deleted).deletedAt).toBeTruthy();
    });

    test("deleteFocusSpellGrant returns 404 when grant does not exist", async () => {
      prismaMock.focusSpellGrant.findUnique.mockResolvedValue(null);

      const result = await deleteFocusSpellGrant({ id: "missing-id" });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "FocusSpellGrant Not Found",
      });
      expect(prismaMock.focusSpellGrant.update).not.toHaveBeenCalled();
    });

    test("deleteFocusSpellGrant returns 404 when grant is already soft-deleted", async () => {
      const deleted = getFakeFocusSpellGrant({ deletedAt: new Date() });
      prismaMock.focusSpellGrant.findUnique.mockResolvedValue(deleted);

      const result = await deleteFocusSpellGrant({ id: deleted.id });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "FocusSpellGrant Not Found",
      });
      expect(prismaMock.focusSpellGrant.update).not.toHaveBeenCalled();
    });
  });
});
