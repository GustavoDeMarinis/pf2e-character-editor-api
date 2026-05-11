import { Feat, FeatType, Prisma, Rarity } from "@prisma/client";
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

const subService = "feat/service";

export const featSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  name: true,
  description: true,
  featType: true,
  level: true,
  actionCost: true,
  rarity: true,
  prerequisites: true,
  frequency: true,
  trigger: true,
  requirements: true,
  traits: {
    select: {
      id: true,
      name: true,
    },
  },
  ancestry: {
    select: {
      id: true,
      name: true,
    },
  },
  ancestryId: true,
  characterClass: {
    select: {
      id: true,
      className: true,
    },
  },
  characterClassId: true,
  skill: {
    select: {
      id: true,
      name: true,
    },
  },
  skillId: true,
};

export const featArgs = Prisma.validator<Prisma.FeatDefaultArgs>()({
  select: featSelect,
});

export type FeatResult = Prisma.FeatGetPayload<typeof featArgs>;

type FeatToInsert = Pick<
  Prisma.FeatUncheckedCreateInput,
  | "name"
  | "description"
  | "featType"
  | "level"
  | "actionCost"
  | "rarity"
  | "prerequisites"
  | "frequency"
  | "trigger"
  | "requirements"
  | "ancestryId"
  | "characterClassId"
  | "skillId"
> & { traitIds: string[] };

export const searchFeats = async (
  search: {
    search?: string;
    featType?: FeatType;
    level?: number;
    maxLevel?: number;
    ancestryId?: string;
    characterClassId?: string;
    skillId?: string;
    rarity?: Rarity;
    isActive?: boolean;
  },
  { skip, take }: PaginationOptions,
  sort?: string
): Promise<SearchResult<FeatResult> | ErrorResult> => {
  const { isActive, search: searchText, level, maxLevel, ...rest } = search;
  const where: Prisma.FeatWhereInput = { ...rest };

  if (searchText) {
    where.OR = [
      { name: { contains: searchText, mode: "insensitive" } },
      { description: { contains: searchText, mode: "insensitive" } },
    ];
  }

  if (level !== undefined && maxLevel !== undefined) {
    where.level = { equals: level, lte: maxLevel };
  } else if (level !== undefined) {
    where.level = level;
  } else if (maxLevel !== undefined) {
    where.level = { lte: maxLevel };
  }

  if (isActive !== undefined) {
    where.deletedAt = !isActive ? { not: null } : null;
  }

  const orderBy = handleSort(sort);
  const items = await prisma.feat.findMany({
    select: featSelect,
    skip,
    take,
    orderBy,
    where,
  });
  const count = await getQueryCount(prisma.feat, where);

  logDebug({
    subService,
    message: `Feat Search found (${count}) results`,
    details: { count, filter: where },
  });
  return { items, count };
};

export const getFeat = async ({
  id,
}: Required<Pick<Prisma.FeatWhereUniqueInput, "id">>): Promise<
  FeatResult | ErrorResult
> => {
  const feat = await prisma.feat.findUniqueOrThrow({
    where: { id },
    select: featSelect,
  });
  logDebug({
    subService,
    message: "Feat Retrieved by Id",
    details: { feat },
  });
  return feat;
};

export const insertFeat = async (
  featToInsert: FeatToInsert
): Promise<FeatResult | ErrorResult> => {
  const { ancestryId, characterClassId, skillId, featType } = featToInsert;

  // Defence-in-depth: typed-FK rule (AJV is primary)
  if (featType === FeatType.Ancestry && !ancestryId) {
    return { code: ErrorCode.BadRequest, message: "ancestryId is required for Ancestry feats" };
  }
  if (featType === FeatType.Class && !characterClassId) {
    return { code: ErrorCode.BadRequest, message: "characterClassId is required for Class feats" };
  }
  if (featType === FeatType.Skill && !skillId) {
    return { code: ErrorCode.BadRequest, message: "skillId is required for Skill feats" };
  }

  if (ancestryId) {
    const ancestry = await prisma.ancestry.findUnique({
      select: { id: true },
      where: { id: ancestryId },
    });
    if (!ancestry) return { code: ErrorCode.NotFound, message: "Ancestry not found" };
  }
  if (characterClassId) {
    const characterClass = await prisma.characterClass.findUnique({
      select: { id: true },
      where: { id: characterClassId },
    });
    if (!characterClass) return { code: ErrorCode.NotFound, message: "Character class not found" };
  }
  if (skillId) {
    const skill = await prisma.skill.findUnique({
      select: { id: true },
      where: { id: skillId },
    });
    if (!skill) return { code: ErrorCode.NotFound, message: "Skill not found" };
  }

  const existing = await prisma.feat.findFirst({
    select: { id: true, deletedAt: true },
    where: { name: featToInsert.name },
  });
  if (existing && !existing.deletedAt) {
    return { code: ErrorCode.DataConflict, message: "A feat with that name already exists" };
  }

  const { traitIds, ...rest } = featToInsert;
  const data: Prisma.FeatUncheckedCreateInput = {
    ...rest,
    traits: { connect: traitIds.map((id) => ({ id })) },
  };
  return prisma.feat.create({ select: featSelect, data });
};

export const updateFeat = async (
  { id }: Prisma.FeatWhereUniqueInput,
  featToUpdate: Pick<
    Prisma.FeatUncheckedUpdateInput,
    | "name"
    | "description"
    | "featType"
    | "level"
    | "actionCost"
    | "rarity"
    | "prerequisites"
    | "frequency"
    | "trigger"
    | "requirements"
    | "ancestryId"
    | "characterClassId"
    | "skillId"
  > & { traitIds?: string[] }
): Promise<Feat | ErrorResult> => {
  const existing = await prisma.feat.findUnique({
    select: { id: true, deletedAt: true },
    where: { id },
  });
  if (!existing || existing.deletedAt) {
    return { code: ErrorCode.NotFound, message: "Feat Not Found" };
  }

  const { ancestryId, characterClassId, skillId } = featToUpdate;

  if (typeof ancestryId === "string") {
    const ancestry = await prisma.ancestry.findUnique({
      select: { id: true },
      where: { id: ancestryId },
    });
    if (!ancestry) return { code: ErrorCode.NotFound, message: "Ancestry not found" };
  }
  if (typeof characterClassId === "string") {
    const characterClass = await prisma.characterClass.findUnique({
      select: { id: true },
      where: { id: characterClassId },
    });
    if (!characterClass) return { code: ErrorCode.NotFound, message: "Character class not found" };
  }
  if (typeof skillId === "string") {
    const skill = await prisma.skill.findUnique({
      select: { id: true },
      where: { id: skillId },
    });
    if (!skill) return { code: ErrorCode.NotFound, message: "Skill not found" };
  }

  const { traitIds, ...rest } = featToUpdate;
  const data: Prisma.FeatUncheckedUpdateInput = {
    ...rest,
    ...(traitIds !== undefined && {
      traits: { set: traitIds.map((traitId) => ({ id: traitId })) },
    }),
  };
  return prisma.feat.update({ where: { id }, data });
};

export const deleteFeat = async ({
  id,
}: Prisma.FeatWhereUniqueInput): Promise<Feat | ErrorResult> => {
  const existing = await prisma.feat.findUnique({
    select: { deletedAt: true },
    where: { id },
  });
  if (!existing || existing.deletedAt) {
    return { code: ErrorCode.NotFound, message: "Feat Not Found" };
  }
  return prisma.feat.update({
    data: { deletedAt: new Date() },
    where: { id },
  });
};
