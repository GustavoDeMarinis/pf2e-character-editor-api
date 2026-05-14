import { CharacterSpell, Prisma, UserRole } from "@prisma/client";
import prisma from "../../integrations/prisma/prisma-client";
import { isOwner } from "../../middleware/security/authorization";
import {
  ErrorCode,
  ErrorResult,
  SearchResult,
} from "../../utils/shared-types";
import { logDebug } from "../../utils/logging";

const subService = "character-spell/service";

type CallerAuth = { userId: string; role: UserRole };

export const characterSpellSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  characterId: true,
  spellId: true,
  isPrepared: true,
  preparedAtRank: true,
  spell: {
    select: {
      id: true,
      name: true,
      rank: true,
      isFocus: true,
      traditions: true,
    },
  },
};

export const characterSpellArgs = Prisma.validator<Prisma.CharacterSpellDefaultArgs>()({
  select: characterSpellSelect,
});

export type CharacterSpellResult = Prisma.CharacterSpellGetPayload<typeof characterSpellArgs>;

export const listCharacterSpells = async (
  characterId: string,
  callerAuth?: CallerAuth
): Promise<SearchResult<CharacterSpellResult> | ErrorResult> => {
  if (callerAuth && callerAuth.role !== UserRole.Admin) {
    const character = await prisma.character.findUnique({
      select: { createdByUserId: true, assignedUserId: true },
      where: { id: characterId },
    });
    if (!character || !isOwner(character, callerAuth.userId)) {
      return { code: ErrorCode.Forbidden, message: "Access denied" };
    }
  }

  const items = await prisma.characterSpell.findMany({
    select: characterSpellSelect,
    where: { characterId, deletedAt: null },
  });

  logDebug({
    subService,
    message: `Listed character spells for character ${characterId}`,
    details: { count: items.length },
  });
  return { items, count: items.length };
};

export const assignSpellToCharacter = async (
  characterId: string,
  data: { spellId: string; isPrepared: boolean; preparedAtRank: number | null },
  callerAuth?: CallerAuth
): Promise<CharacterSpellResult | ErrorResult> => {
  const character = await prisma.character.findUnique({
    select: { id: true, createdByUserId: true, assignedUserId: true },
    where: { id: characterId },
  });
  if (!character) {
    return { code: ErrorCode.NotFound, message: "Character not found" };
  }
  if (
    callerAuth &&
    callerAuth.role !== UserRole.Admin &&
    !isOwner(character, callerAuth.userId)
  ) {
    return { code: ErrorCode.Forbidden, message: "Access denied" };
  }

  const spell = await prisma.spell.findUnique({
    select: { id: true },
    where: { id: data.spellId },
  });
  if (!spell) {
    return { code: ErrorCode.NotFound, message: "Spell not found" };
  }

  const existing = await prisma.characterSpell.findFirst({
    select: { id: true, deletedAt: true },
    where: {
      characterId,
      spellId: data.spellId,
      preparedAtRank: data.preparedAtRank,
    },
  });

  if (existing) {
    if (!existing.deletedAt) {
      return {
        code: ErrorCode.DataConflict,
        message: "This spell is already assigned to this character at that rank",
      };
    }
    return prisma.characterSpell.update({
      select: characterSpellSelect,
      where: { id: existing.id },
      data: {
        deletedAt: null,
        isPrepared: data.isPrepared,
        preparedAtRank: data.preparedAtRank,
      },
    });
  }

  return prisma.characterSpell.create({
    select: characterSpellSelect,
    data: { characterId, ...data },
  });
};

export const removeSpellFromCharacter = async (
  { characterId, characterSpellId }: { characterId: string; characterSpellId: string },
  callerAuth?: CallerAuth
): Promise<CharacterSpell | ErrorResult> => {
  if (callerAuth && callerAuth.role !== UserRole.Admin) {
    const character = await prisma.character.findUnique({
      select: { createdByUserId: true, assignedUserId: true },
      where: { id: characterId },
    });
    if (!character || !isOwner(character, callerAuth.userId)) {
      return { code: ErrorCode.Forbidden, message: "Access denied" };
    }
  }

  const existing = await prisma.characterSpell.findUnique({
    select: { deletedAt: true, characterId: true },
    where: { id: characterSpellId },
  });
  if (!existing || existing.deletedAt || existing.characterId !== characterId) {
    return { code: ErrorCode.NotFound, message: "Character spell assignment Not Found" };
  }

  return prisma.characterSpell.update({
    data: { deletedAt: new Date() },
    where: { id: characterSpellId },
  });
};
