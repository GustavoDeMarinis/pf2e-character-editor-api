import { CharacterCondition, Prisma, UserRole } from "@prisma/client";
import prisma from "../../integrations/prisma/prisma-client";
import { isOwner } from "../../middleware/security/authorization";
import {
  ErrorCode,
  ErrorResult,
  SearchResult,
} from "../../utils/shared-types";
import { logDebug } from "../../utils/logging";

const subService = "character-condition/service";

type CallerAuth = { userId: string; role: UserRole };

export const characterConditionSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  characterId: true,
  conditionId: true,
  value: true,
  source: true,
  appliedAt: true,
  expiresAt: true,
  condition: { select: { id: true, name: true, hasValue: true } },
};

export const characterConditionArgs =
  Prisma.validator<Prisma.CharacterConditionDefaultArgs>()({
    select: characterConditionSelect,
  });

export type CharacterConditionResult = Prisma.CharacterConditionGetPayload<
  typeof characterConditionArgs
>;

type CharacterConditionToInsert = {
  conditionId: string;
  value?: number | null;
  source?: string;
  expiresAt?: Date | null;
};

type CharacterConditionToPatch = {
  value?: number | null;
  source?: string | null;
  expiresAt?: Date | null;
};

export const listCharacterConditions = async (
  characterId: string,
  { currentlyActive }: { currentlyActive?: boolean },
  callerAuth?: CallerAuth
): Promise<SearchResult<CharacterConditionResult> | ErrorResult> => {
  const character = await prisma.character.findUnique({
    select: { createdByUserId: true, assignedUserId: true },
    where: { id: characterId },
  });
  if (!character) {
    return { code: ErrorCode.NotFound, message: "Character not found" };
  }
  if (callerAuth && callerAuth.role !== UserRole.Admin && !isOwner(character, callerAuth.userId)) {
    return { code: ErrorCode.Forbidden, message: "Access denied" };
  }

  const where: Prisma.CharacterConditionWhereInput = { characterId, deletedAt: null };
  if (currentlyActive === true) {
    where.OR = [{ expiresAt: null }, { expiresAt: { gt: new Date() } }];
  }

  const items = await prisma.characterCondition.findMany({
    select: characterConditionSelect,
    where,
  });

  logDebug({
    subService,
    message: `Listed character conditions for character ${characterId}`,
    details: { count: items.length },
  });
  return { items, count: items.length };
};

export const applyConditionToCharacter = async (
  characterId: string,
  data: CharacterConditionToInsert,
  callerAuth?: CallerAuth
): Promise<CharacterConditionResult | ErrorResult> => {
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

  const condition = await prisma.condition.findUnique({
    select: { id: true, hasValue: true },
    where: { id: data.conditionId },
  });
  if (!condition) {
    return { code: ErrorCode.NotFound, message: "Condition not found" };
  }

  if (!condition.hasValue && data.value != null) {
    return { code: ErrorCode.BadRequest, message: "This condition does not accept a value" };
  }
  if (condition.hasValue && data.value == null) {
    return { code: ErrorCode.BadRequest, message: "This condition requires a value" };
  }

  return prisma.characterCondition.create({
    select: characterConditionSelect,
    data: { characterId, ...data },
  });
};

export const updateCharacterCondition = async (
  { characterId, characterConditionId }: { characterId: string; characterConditionId: string },
  patch: CharacterConditionToPatch,
  callerAuth?: CallerAuth
): Promise<CharacterCondition | ErrorResult> => {
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

  const existing = await prisma.characterCondition.findUnique({
    select: {
      characterId: true,
      deletedAt: true,
      condition: { select: { hasValue: true } },
    },
    where: { id: characterConditionId },
  });
  if (!existing || existing.deletedAt || existing.characterId !== characterId) {
    return { code: ErrorCode.NotFound, message: "Character condition assignment Not Found" };
  }

  if (patch.value !== undefined) {
    if (patch.value != null && !existing.condition.hasValue) {
      return { code: ErrorCode.BadRequest, message: "This condition does not accept a value" };
    }
    if (patch.value == null && existing.condition.hasValue) {
      return { code: ErrorCode.BadRequest, message: "This condition requires a value" };
    }
  }

  return prisma.characterCondition.update({
    data: patch,
    where: { id: characterConditionId },
  });
};

export const removeConditionFromCharacter = async (
  { characterId, characterConditionId }: { characterId: string; characterConditionId: string },
  callerAuth?: CallerAuth
): Promise<CharacterCondition | ErrorResult> => {
  if (callerAuth && callerAuth.role !== UserRole.Admin) {
    const character = await prisma.character.findUnique({
      select: { createdByUserId: true, assignedUserId: true },
      where: { id: characterId },
    });
    if (!character || !isOwner(character, callerAuth.userId)) {
      return { code: ErrorCode.Forbidden, message: "Access denied" };
    }
  }

  const existing = await prisma.characterCondition.findUnique({
    select: { deletedAt: true, characterId: true },
    where: { id: characterConditionId },
  });
  if (!existing || existing.deletedAt || existing.characterId !== characterId) {
    return { code: ErrorCode.NotFound, message: "Character condition assignment Not Found" };
  }

  return prisma.characterCondition.update({
    data: { deletedAt: new Date() },
    where: { id: characterConditionId },
  });
};
