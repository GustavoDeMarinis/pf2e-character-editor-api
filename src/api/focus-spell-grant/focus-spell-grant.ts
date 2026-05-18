import { FocusSpellGrant, Prisma } from "@prisma/client";
import prisma from "../../integrations/prisma/prisma-client";
import {
  ErrorCode,
  ErrorResult,
  PaginationOptions,
  SearchResult,
} from "../../utils/shared-types";
import { handleSort } from "../../utils/sorting";
import { getQueryCount } from "../../utils/pagination";
import { logDebug } from "../../utils/logging";

const subService = "focus-spell-grant/service";

export const focusSpellGrantSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  spell: {
    select: {
      id: true,
      name: true,
      rank: true,
      isFocus: true,
      traditions: true,
      rarity: true,
    },
  },
  characterClass: {
    select: {
      id: true,
      className: true,
    },
  },
  domain: {
    select: {
      id: true,
      name: true,
    },
  },
};

export const focusSpellGrantArgs =
  Prisma.validator<Prisma.FocusSpellGrantDefaultArgs>()({
    select: focusSpellGrantSelect,
  });

export type FocusSpellGrantResult = Prisma.FocusSpellGrantGetPayload<
  typeof focusSpellGrantArgs
>;

type FocusSpellGrantToInsert = {
  spellId: string;
  characterClassId?: string;
  domainId?: string;
};

type FocusSpellGrantToUpdate = {
  spellId?: string;
  characterClassId?: string | null;
  domainId?: string | null;
};

const hasExactlyOneScope = (
  characterClassId: string | null | undefined,
  domainId: string | null | undefined
): boolean => {
  const hasClass = characterClassId != null;
  const hasDomain = domainId != null;
  return hasClass !== hasDomain;
};

const validateSpellIsFocus = async (
  spellId: string
): Promise<ErrorResult | null> => {
  const spell = await prisma.spell.findUnique({
    select: { id: true, isFocus: true },
    where: { id: spellId },
  });
  if (!spell) {
    return { code: ErrorCode.NotFound, message: "Spell not found" };
  }
  if (!spell.isFocus) {
    return {
      code: ErrorCode.BadRequest,
      message: "Spell is not a focus spell",
    };
  }
  return null;
};

const validateCharacterClassExists = async (
  characterClassId: string
): Promise<ErrorResult | null> => {
  const characterClass = await prisma.characterClass.findUnique({
    select: { id: true },
    where: { id: characterClassId },
  });
  if (!characterClass) {
    return { code: ErrorCode.NotFound, message: "CharacterClass not found" };
  }
  return null;
};

const validateDomainExists = async (
  domainId: string
): Promise<ErrorResult | null> => {
  const domain = await prisma.domain.findUnique({
    select: { id: true },
    where: { id: domainId },
  });
  if (!domain) {
    return { code: ErrorCode.NotFound, message: "Domain not found" };
  }
  return null;
};

export const searchFocusSpellGrants = async (
  search: {
    spellId?: string;
    characterClassId?: string;
    domainId?: string;
    isActive?: boolean;
  },
  { skip, take }: PaginationOptions,
  sort?: string
): Promise<SearchResult<FocusSpellGrantResult> | ErrorResult> => {
  const { isActive, ...searchFilters } = search;
  const where: Prisma.FocusSpellGrantWhereInput = { ...searchFilters };

  if (isActive !== undefined) {
    where.deletedAt = !isActive ? { not: null } : null;
  }

  const orderBy = handleSort(sort);
  const items = await prisma.focusSpellGrant.findMany({
    select: focusSpellGrantSelect,
    skip,
    take,
    orderBy,
    where,
  });
  const count = await getQueryCount(prisma.focusSpellGrant, where);

  logDebug({
    subService,
    message: `FocusSpellGrant Search found (${count}) results`,
    details: { count, filter: where },
  });
  return { items, count };
};

export const getFocusSpellGrant = async ({
  id,
}: Required<Pick<Prisma.FocusSpellGrantWhereUniqueInput, "id">>): Promise<
  FocusSpellGrantResult | ErrorResult
> => {
  const focusSpellGrant = await prisma.focusSpellGrant.findUniqueOrThrow({
    where: { id },
    select: focusSpellGrantSelect,
  });
  logDebug({
    subService,
    message: "FocusSpellGrant Retrieved by Id",
    details: { focusSpellGrant },
  });
  return focusSpellGrant;
};

export const insertFocusSpellGrant = async (
  focusSpellGrantToInsert: FocusSpellGrantToInsert
): Promise<FocusSpellGrantResult | ErrorResult> => {
  const { spellId, characterClassId, domainId } = focusSpellGrantToInsert;

  if (!hasExactlyOneScope(characterClassId, domainId)) {
    return {
      code: ErrorCode.BadRequest,
      message: "Exactly one of characterClassId or domainId must be set",
    };
  }

  const spellError = await validateSpellIsFocus(spellId);
  if (spellError) return spellError;

  if (characterClassId !== undefined) {
    const classError = await validateCharacterClassExists(characterClassId);
    if (classError) return classError;
  }
  if (domainId !== undefined) {
    const domainError = await validateDomainExists(domainId);
    if (domainError) return domainError;
  }

  if (characterClassId !== undefined) {
    const existing = await prisma.focusSpellGrant.findFirst({
      select: { id: true, deletedAt: true },
      where: { spellId, characterClassId },
    });
    if (existing && !existing.deletedAt) {
      return {
        code: ErrorCode.DataConflict,
        message:
          "A grant for this spell already exists for the same class",
      };
    }
  } else if (domainId !== undefined) {
    const existing = await prisma.focusSpellGrant.findFirst({
      select: { id: true, deletedAt: true },
      where: { spellId, domainId },
    });
    if (existing && !existing.deletedAt) {
      return {
        code: ErrorCode.DataConflict,
        message:
          "A grant for this spell already exists for the same domain",
      };
    }
  }

  const data: Prisma.FocusSpellGrantUncheckedCreateInput = {
    spellId,
    characterClassId: characterClassId ?? null,
    domainId: domainId ?? null,
  };
  return prisma.focusSpellGrant.create({
    select: focusSpellGrantSelect,
    data,
  });
};

export const updateFocusSpellGrant = async (
  { id }: Prisma.FocusSpellGrantWhereUniqueInput,
  focusSpellGrantToUpdate: FocusSpellGrantToUpdate
): Promise<FocusSpellGrant | ErrorResult> => {
  const existing = await prisma.focusSpellGrant.findUnique({
    select: {
      id: true,
      deletedAt: true,
      spellId: true,
      characterClassId: true,
      domainId: true,
    },
    where: { id },
  });
  if (!existing || existing.deletedAt) {
    return { code: ErrorCode.NotFound, message: "FocusSpellGrant Not Found" };
  }

  const mergedCharacterClassId =
    focusSpellGrantToUpdate.characterClassId !== undefined
      ? focusSpellGrantToUpdate.characterClassId
      : existing.characterClassId;
  const mergedDomainId =
    focusSpellGrantToUpdate.domainId !== undefined
      ? focusSpellGrantToUpdate.domainId
      : existing.domainId;

  if (!hasExactlyOneScope(mergedCharacterClassId, mergedDomainId)) {
    return {
      code: ErrorCode.BadRequest,
      message: "Exactly one of characterClassId or domainId must be set",
    };
  }

  if (focusSpellGrantToUpdate.spellId !== undefined) {
    const spellError = await validateSpellIsFocus(
      focusSpellGrantToUpdate.spellId
    );
    if (spellError) return spellError;
  }
  if (
    focusSpellGrantToUpdate.characterClassId !== undefined &&
    focusSpellGrantToUpdate.characterClassId !== null
  ) {
    const classError = await validateCharacterClassExists(
      focusSpellGrantToUpdate.characterClassId
    );
    if (classError) return classError;
  }
  if (
    focusSpellGrantToUpdate.domainId !== undefined &&
    focusSpellGrantToUpdate.domainId !== null
  ) {
    const domainError = await validateDomainExists(
      focusSpellGrantToUpdate.domainId
    );
    if (domainError) return domainError;
  }

  const data: Prisma.FocusSpellGrantUncheckedUpdateInput = {};
  if (focusSpellGrantToUpdate.spellId !== undefined) {
    data.spellId = focusSpellGrantToUpdate.spellId;
  }
  if (focusSpellGrantToUpdate.characterClassId !== undefined) {
    data.characterClassId = focusSpellGrantToUpdate.characterClassId;
  }
  if (focusSpellGrantToUpdate.domainId !== undefined) {
    data.domainId = focusSpellGrantToUpdate.domainId;
  }

  return prisma.focusSpellGrant.update({ where: { id }, data });
};

export const deleteFocusSpellGrant = async ({
  id,
}: Prisma.FocusSpellGrantWhereUniqueInput): Promise<
  FocusSpellGrant | ErrorResult
> => {
  const existing = await prisma.focusSpellGrant.findUnique({
    select: { deletedAt: true },
    where: { id },
  });
  if (!existing || existing.deletedAt) {
    return { code: ErrorCode.NotFound, message: "FocusSpellGrant Not Found" };
  }
  return prisma.focusSpellGrant.update({
    data: { deletedAt: new Date() },
    where: { id },
  });
};
