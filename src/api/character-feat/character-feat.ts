import { CharacterFeat, FeatType, Prisma, UserRole } from "@prisma/client";
import prisma from "../../integrations/prisma/prisma-client";
import { isOwner } from "../../middleware/security/authorization";
import {
  ErrorCode,
  ErrorResult,
  SearchResult,
} from "../../utils/shared-types";
import { logDebug } from "../../utils/logging";

const subService = "character-feat/service";

type CallerAuth = { userId: string; role: UserRole };

export const characterFeatSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  characterId: true,
  featId: true,
  levelItWasTaken: true,
  slotType: true,
  feat: {
    select: {
      id: true,
      name: true,
      featType: true,
      level: true,
      rarity: true,
    },
  },
};

export const characterFeatArgs = Prisma.validator<Prisma.CharacterFeatDefaultArgs>()({
  select: characterFeatSelect,
});

export type CharacterFeatResult = Prisma.CharacterFeatGetPayload<typeof characterFeatArgs>;

export const listCharacterFeats = async (
  characterId: string,
  callerAuth?: CallerAuth
): Promise<SearchResult<CharacterFeatResult> | ErrorResult> => {
  if (callerAuth && callerAuth.role !== UserRole.Admin) {
    const character = await prisma.character.findUnique({
      select: { createdByUserId: true, assignedUserId: true },
      where: { id: characterId },
    });
    if (!character || !isOwner(character, callerAuth.userId)) {
      return { code: ErrorCode.Forbidden, message: "Access denied" };
    }
  }

  const items = await prisma.characterFeat.findMany({
    select: characterFeatSelect,
    where: { characterId, deletedAt: null },
  });

  logDebug({
    subService,
    message: `Listed character feats for character ${characterId}`,
    details: { count: items.length },
  });
  return { items, count: items.length };
};

export const assignFeatToCharacter = async (
  characterId: string,
  data: { featId: string; levelItWasTaken: number; slotType: FeatType },
  callerAuth?: CallerAuth
): Promise<CharacterFeatResult | ErrorResult> => {
  const character = await prisma.character.findUnique({
    select: { id: true, createdByUserId: true, assignedUserId: true },
    where: { id: characterId },
  });
  if (!character) {
    return { code: ErrorCode.NotFound, message: "Character not found" };
  }
  if (callerAuth && callerAuth.role !== UserRole.Admin && !isOwner(character, callerAuth.userId)) {
    return { code: ErrorCode.Forbidden, message: "Access denied" };
  }

  const feat = await prisma.feat.findUnique({
    select: { id: true },
    where: { id: data.featId },
  });
  if (!feat) {
    return { code: ErrorCode.NotFound, message: "Feat not found" };
  }

  const existing = await prisma.characterFeat.findFirst({
    select: { id: true, deletedAt: true },
    where: { characterId, featId: data.featId },
  });

  if (existing) {
    if (!existing.deletedAt) {
      return { code: ErrorCode.DataConflict, message: "This feat is already assigned to this character" };
    }
    return prisma.characterFeat.update({
      select: characterFeatSelect,
      where: { id: existing.id },
      data: { deletedAt: null, levelItWasTaken: data.levelItWasTaken, slotType: data.slotType },
    });
  }

  return prisma.characterFeat.create({
    select: characterFeatSelect,
    data: { characterId, ...data },
  });
};

export const removeFeatFromCharacter = async (
  { characterId, characterFeatId }: { characterId: string; characterFeatId: string },
  callerAuth?: CallerAuth
): Promise<CharacterFeat | ErrorResult> => {
  if (callerAuth && callerAuth.role !== UserRole.Admin) {
    const character = await prisma.character.findUnique({
      select: { createdByUserId: true, assignedUserId: true },
      where: { id: characterId },
    });
    if (!character || !isOwner(character, callerAuth.userId)) {
      return { code: ErrorCode.Forbidden, message: "Access denied" };
    }
  }

  const existing = await prisma.characterFeat.findUnique({
    select: { deletedAt: true, characterId: true },
    where: { id: characterFeatId },
  });
  if (!existing || existing.deletedAt || existing.characterId !== characterId) {
    return { code: ErrorCode.NotFound, message: "Character feat assignment Not Found" };
  }

  return prisma.characterFeat.update({
    data: { deletedAt: new Date() },
    where: { id: characterFeatId },
  });
};
