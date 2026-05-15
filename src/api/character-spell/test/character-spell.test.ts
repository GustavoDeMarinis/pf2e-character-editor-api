import { UserRole } from "@prisma/client";
import {
  getFakeCharacter,
  getFakeCharacterSpell,
  getFakeCurrentUserAuthorization,
  getFakeSpell,
} from "../../../testing/fakes";
import { prismaMock } from "../../../testing/mock-prisma";
import { ErrorCode } from "../../../utils/shared-types";
import {
  assignSpellToCharacter,
  listCharacterSpells,
  removeSpellFromCharacter,
} from "../character-spell";

describe("CharacterSpell tests", () => {
  describe("List Character Spells", () => {
    test("listCharacterSpells returns active spell assignments", async () => {
      const fakeCharacterSpell = { ...getFakeCharacterSpell(), spell: { id: "spell-id", name: "Fireball", rank: 3, isFocus: false, traditions: [] } };
      prismaMock.characterSpell.findMany.mockResolvedValue([fakeCharacterSpell] as any);

      const result = await listCharacterSpells(fakeCharacterSpell.characterId);

      expect(result).toStrictEqual({
        items: [fakeCharacterSpell],
        count: 1,
      });
    });
  });

  describe("Assign Spell to Character", () => {
    test("assignSpellToCharacter creates and returns the assignment (Admin)", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      const fakeCharacter = getFakeCharacter();
      const fakeSpell = getFakeSpell();
      const fakeCharacterSpell = {
        ...getFakeCharacterSpell({ characterId: fakeCharacter.id, spellId: fakeSpell.id }),
        spell: { id: fakeSpell.id, name: fakeSpell.name, rank: fakeSpell.rank, isFocus: fakeSpell.isFocus, traditions: fakeSpell.traditions },
      };

      prismaMock.character.findUnique.mockResolvedValue(fakeCharacter);
      prismaMock.spell.findUnique.mockResolvedValue(fakeSpell);
      prismaMock.characterSpell.findFirst.mockResolvedValue(null);
      prismaMock.characterSpell.create.mockResolvedValue(fakeCharacterSpell as any);

      const result = await assignSpellToCharacter(
        fakeCharacter.id,
        { spellId: fakeSpell.id, isPrepared: false, preparedAtRank: null },
        adminAuth
      );

      expect(prismaMock.characterSpell.create).toHaveBeenCalledTimes(1);
      expect(result).toBe(fakeCharacterSpell);
    });

    test("assignSpellToCharacter returns 404 when character not found", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      prismaMock.character.findUnique.mockResolvedValue(null);

      const result = await assignSpellToCharacter(
        "missing-character-id",
        { spellId: "spell-id", isPrepared: false, preparedAtRank: null },
        adminAuth
      );

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Character not found",
      });
      expect(prismaMock.characterSpell.create).not.toHaveBeenCalled();
    });

    test("assignSpellToCharacter returns 404 when spell not found", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      const fakeCharacter = getFakeCharacter();
      prismaMock.character.findUnique.mockResolvedValue(fakeCharacter);
      prismaMock.spell.findUnique.mockResolvedValue(null);

      const result = await assignSpellToCharacter(
        fakeCharacter.id,
        { spellId: "missing-spell-id", isPrepared: false, preparedAtRank: null },
        adminAuth
      );

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Spell not found",
      });
      expect(prismaMock.characterSpell.create).not.toHaveBeenCalled();
    });

    test("assignSpellToCharacter returns 409 when spell already actively assigned at that rank", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      const fakeCharacter = getFakeCharacter();
      const fakeSpell = getFakeSpell();
      const existing = getFakeCharacterSpell({
        characterId: fakeCharacter.id,
        spellId: fakeSpell.id,
        preparedAtRank: 1,
        deletedAt: null,
      });

      prismaMock.character.findUnique.mockResolvedValue(fakeCharacter);
      prismaMock.spell.findUnique.mockResolvedValue(fakeSpell);
      prismaMock.characterSpell.findFirst.mockResolvedValue(existing);

      const result = await assignSpellToCharacter(
        fakeCharacter.id,
        { spellId: fakeSpell.id, isPrepared: true, preparedAtRank: 1 },
        adminAuth
      );

      expect(result).toStrictEqual({
        code: ErrorCode.DataConflict,
        message: "This spell is already assigned to this character at that rank",
      });
      expect(prismaMock.characterSpell.create).not.toHaveBeenCalled();
    });

    test("assignSpellToCharacter reactivates a soft-deleted assignment", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      const fakeCharacter = getFakeCharacter();
      const fakeSpell = getFakeSpell();
      const softDeleted = getFakeCharacterSpell({
        characterId: fakeCharacter.id,
        spellId: fakeSpell.id,
        preparedAtRank: 1,
        deletedAt: new Date(),
      });
      const reactivated = {
        ...softDeleted,
        deletedAt: null,
        spell: { id: fakeSpell.id, name: fakeSpell.name, rank: fakeSpell.rank, isFocus: fakeSpell.isFocus, traditions: fakeSpell.traditions },
      };

      prismaMock.character.findUnique.mockResolvedValue(fakeCharacter);
      prismaMock.spell.findUnique.mockResolvedValue(fakeSpell);
      prismaMock.characterSpell.findFirst.mockResolvedValue(softDeleted);
      prismaMock.characterSpell.update.mockResolvedValue(reactivated as any);

      const result = await assignSpellToCharacter(
        fakeCharacter.id,
        { spellId: fakeSpell.id, isPrepared: true, preparedAtRank: 1 },
        adminAuth
      );

      expect(prismaMock.characterSpell.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.characterSpell.create).not.toHaveBeenCalled();
      expect(result).toStrictEqual(reactivated);
    });

    test("assignSpellToCharacter allows the same spell at a different preparedAtRank", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      const fakeCharacter = getFakeCharacter();
      const fakeSpell = getFakeSpell();
      const fakeCharacterSpell = {
        ...getFakeCharacterSpell({ characterId: fakeCharacter.id, spellId: fakeSpell.id, preparedAtRank: 2 }),
        spell: { id: fakeSpell.id, name: fakeSpell.name, rank: fakeSpell.rank, isFocus: fakeSpell.isFocus, traditions: fakeSpell.traditions },
      };

      prismaMock.character.findUnique.mockResolvedValue(fakeCharacter);
      prismaMock.spell.findUnique.mockResolvedValue(fakeSpell);
      prismaMock.characterSpell.findFirst.mockResolvedValue(null);
      prismaMock.characterSpell.create.mockResolvedValue(fakeCharacterSpell as any);

      const result = await assignSpellToCharacter(
        fakeCharacter.id,
        { spellId: fakeSpell.id, isPrepared: true, preparedAtRank: 2 },
        adminAuth
      );

      expect(prismaMock.characterSpell.create).toHaveBeenCalledTimes(1);
      expect(result).toBe(fakeCharacterSpell);
    });

    test("assignSpellToCharacter returns 403 when Player is not owner of the character", async () => {
      const playerAuth = getFakeCurrentUserAuthorization({
        role: UserRole.Player,
        userId: "player-user-id",
      });
      const fakeCharacter = getFakeCharacter({
        createdByUserId: "other-user-id",
        assignedUserId: "other-user-id",
      });
      prismaMock.character.findUnique.mockResolvedValue(fakeCharacter);

      const result = await assignSpellToCharacter(
        fakeCharacter.id,
        { spellId: "spell-id", isPrepared: false, preparedAtRank: null },
        playerAuth
      );

      expect(result).toStrictEqual({
        code: ErrorCode.Forbidden,
        message: "Access denied",
      });
      expect(prismaMock.characterSpell.create).not.toHaveBeenCalled();
    });
  });

  describe("Remove Spell from Character", () => {
    test("removeSpellFromCharacter soft-deletes the assignment (Admin)", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      const fakeCharacterSpell = getFakeCharacterSpell({ deletedAt: null });
      const deleted = { ...fakeCharacterSpell, deletedAt: new Date() };

      prismaMock.characterSpell.findUnique.mockResolvedValue(fakeCharacterSpell);
      prismaMock.characterSpell.update.mockResolvedValue(deleted);

      const result = await removeSpellFromCharacter(
        { characterId: fakeCharacterSpell.characterId, characterSpellId: fakeCharacterSpell.id },
        adminAuth
      );

      expect(prismaMock.characterSpell.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ deletedAt: expect.any(Date) }),
        })
      );
      expect(prismaMock.character.findUnique).not.toHaveBeenCalled();
      expect((result as typeof deleted).deletedAt).toBeTruthy();
    });

    test("removeSpellFromCharacter returns 404 when assignment does not exist", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      prismaMock.characterSpell.findUnique.mockResolvedValue(null);

      const result = await removeSpellFromCharacter(
        { characterId: "char-id", characterSpellId: "nonexistent" },
        adminAuth
      );

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Character spell assignment Not Found",
      });
      expect(prismaMock.characterSpell.update).not.toHaveBeenCalled();
    });

    test("removeSpellFromCharacter returns 404 when assignment is already soft-deleted", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      const fakeCharacterSpell = getFakeCharacterSpell({ deletedAt: new Date() });
      prismaMock.characterSpell.findUnique.mockResolvedValue(fakeCharacterSpell);

      const result = await removeSpellFromCharacter(
        { characterId: fakeCharacterSpell.characterId, characterSpellId: fakeCharacterSpell.id },
        adminAuth
      );

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Character spell assignment Not Found",
      });
      expect(prismaMock.characterSpell.update).not.toHaveBeenCalled();
    });

    test("removeSpellFromCharacter returns 403 when Player is not owner of the character", async () => {
      const playerAuth = getFakeCurrentUserAuthorization({
        role: UserRole.Player,
        userId: "player-user-id",
      });
      const fakeCharacter = getFakeCharacter({
        createdByUserId: "other-user-id",
        assignedUserId: "other-user-id",
      });
      prismaMock.character.findUnique.mockResolvedValue(fakeCharacter);

      const result = await removeSpellFromCharacter(
        { characterId: fakeCharacter.id, characterSpellId: "some-spell-id" },
        playerAuth
      );

      expect(result).toStrictEqual({
        code: ErrorCode.Forbidden,
        message: "Access denied",
      });
      expect(prismaMock.characterSpell.findUnique).not.toHaveBeenCalled();
      expect(prismaMock.characterSpell.update).not.toHaveBeenCalled();
    });
  });
});
