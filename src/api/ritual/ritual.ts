import { Prisma, Rarity, Ritual } from "@prisma/client";
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

const subService = "ritual/service";

export const ritualSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  name: true,
  description: true,
  rank: true,
  rarity: true,
  castTime: true,
  cost: true,
  primaryCheck: true,
  secondaryCasters: true,
  range: true,
  targets: true,
  duration: true,
  criticalSuccess: true,
  success: true,
  failure: true,
  criticalFailure: true,
  traits: {
    select: {
      id: true,
      name: true,
    },
  },
  secondaryCheckSkills: {
    select: {
      id: true,
      name: true,
    },
  },
  heightenings: {
    select: {
      id: true,
      fixedRank: true,
      effect: true,
    },
  },
};

export const ritualArgs = Prisma.validator<Prisma.RitualDefaultArgs>()({
  select: ritualSelect,
});

export type RitualResult = Prisma.RitualGetPayload<typeof ritualArgs>;

type RitualHeighteningInput = {
  fixedRank: number;
  effect: string;
};

type RitualToInsert = Pick<
  Prisma.RitualUncheckedCreateInput,
  | "name"
  | "description"
  | "rank"
  | "rarity"
  | "castTime"
  | "cost"
  | "primaryCheck"
  | "secondaryCasters"
  | "range"
  | "targets"
  | "duration"
  | "criticalSuccess"
  | "success"
  | "failure"
  | "criticalFailure"
> & {
  traitIds: string[];
  secondaryCheckSkillIds: string[];
  heightenings: RitualHeighteningInput[];
};

type RitualToUpdate = Pick<
  Prisma.RitualUncheckedUpdateInput,
  | "name"
  | "description"
  | "rank"
  | "rarity"
  | "castTime"
  | "cost"
  | "primaryCheck"
  | "secondaryCasters"
  | "range"
  | "targets"
  | "duration"
  | "criticalSuccess"
  | "success"
  | "failure"
  | "criticalFailure"
> & {
  traitIds?: string[];
  secondaryCheckSkillIds?: string[];
  heightenings?: RitualHeighteningInput[];
};

const validateTraitIds = async (
  traitIds: string[]
): Promise<ErrorResult | null> => {
  if (traitIds.length === 0) return null;
  const found = await prisma.trait.findMany({
    select: { id: true },
    where: { id: { in: traitIds } },
  });
  if (found.length !== traitIds.length) {
    return { code: ErrorCode.NotFound, message: "Trait not found" };
  }
  return null;
};

const validateSkillIds = async (
  skillIds: string[]
): Promise<ErrorResult | null> => {
  if (skillIds.length === 0) return null;
  const found = await prisma.skill.findMany({
    select: { id: true },
    where: { id: { in: skillIds } },
  });
  if (found.length !== skillIds.length) {
    return { code: ErrorCode.NotFound, message: "Skill not found" };
  }
  return null;
};

export const searchRituals = async (
  search: {
    search?: string;
    rank?: number;
    minRank?: number;
    maxRank?: number;
    traitIds?: string[];
    secondaryCheckSkillIds?: string[];
    rarity?: Rarity;
    isActive?: boolean;
  },
  { skip, take }: PaginationOptions,
  sort?: string
): Promise<SearchResult<RitualResult> | ErrorResult> => {
  const {
    isActive,
    search: searchText,
    rank,
    minRank,
    maxRank,
    traitIds,
    secondaryCheckSkillIds,
    ...rest
  } = search;

  const where: Prisma.RitualWhereInput = { ...rest };

  if (searchText) {
    where.OR = [
      { name: { contains: searchText, mode: "insensitive" } },
      { description: { contains: searchText, mode: "insensitive" } },
    ];
  }

  const rankFilter: Prisma.IntFilter = {};
  if (rank !== undefined) rankFilter.equals = rank;
  if (minRank !== undefined) rankFilter.gte = minRank;
  if (maxRank !== undefined) rankFilter.lte = maxRank;
  if (Object.keys(rankFilter).length > 0) {
    where.rank = rankFilter;
  }

  if (traitIds !== undefined) {
    where.traits = { every: { id: { in: traitIds } } };
  }

  if (secondaryCheckSkillIds !== undefined) {
    where.secondaryCheckSkills = {
      every: { id: { in: secondaryCheckSkillIds } },
    };
  }

  if (isActive !== undefined) {
    where.deletedAt = !isActive ? { not: null } : null;
  }

  const orderBy = handleSort(sort);
  const items = await prisma.ritual.findMany({
    select: ritualSelect,
    skip,
    take,
    orderBy,
    where,
  });
  const count = await getQueryCount(prisma.ritual, where);

  logDebug({
    subService,
    message: `Ritual Search found (${count}) results`,
    details: { count, filter: where },
  });
  return { items, count };
};

export const getRitual = async ({
  id,
}: Required<Pick<Prisma.RitualWhereUniqueInput, "id">>): Promise<
  RitualResult | ErrorResult
> => {
  const ritual = await prisma.ritual.findUniqueOrThrow({
    where: { id },
    select: ritualSelect,
  });
  logDebug({
    subService,
    message: "Ritual Retrieved by Id",
    details: { ritual },
  });
  return ritual;
};

export const insertRitual = async (
  ritualToInsert: RitualToInsert
): Promise<RitualResult | ErrorResult> => {
  const traitError = await validateTraitIds(ritualToInsert.traitIds);
  if (traitError) return traitError;

  const skillError = await validateSkillIds(
    ritualToInsert.secondaryCheckSkillIds
  );
  if (skillError) return skillError;

  const existing = await prisma.ritual.findFirst({
    select: { id: true, deletedAt: true },
    where: { name: ritualToInsert.name },
  });
  if (existing && !existing.deletedAt) {
    return {
      code: ErrorCode.DataConflict,
      message: "A ritual with that name already exists",
    };
  }

  const { traitIds, secondaryCheckSkillIds, heightenings, ...rest } =
    ritualToInsert;
  const data: Prisma.RitualUncheckedCreateInput = {
    ...rest,
    traits: { connect: traitIds.map((id) => ({ id })) },
    secondaryCheckSkills: {
      connect: secondaryCheckSkillIds.map((id) => ({ id })),
    },
    heightenings: {
      create: heightenings.map((h) => ({
        fixedRank: h.fixedRank,
        effect: h.effect,
      })),
    },
  };
  return prisma.ritual.create({ select: ritualSelect, data });
};

export const updateRitual = async (
  { id }: Prisma.RitualWhereUniqueInput,
  ritualToUpdate: RitualToUpdate
): Promise<Ritual | ErrorResult> => {
  const existing = await prisma.ritual.findUnique({
    select: { id: true, deletedAt: true },
    where: { id },
  });
  if (!existing || existing.deletedAt) {
    return { code: ErrorCode.NotFound, message: "Ritual Not Found" };
  }

  if (ritualToUpdate.traitIds !== undefined) {
    const traitError = await validateTraitIds(ritualToUpdate.traitIds);
    if (traitError) return traitError;
  }

  if (ritualToUpdate.secondaryCheckSkillIds !== undefined) {
    const skillError = await validateSkillIds(
      ritualToUpdate.secondaryCheckSkillIds
    );
    if (skillError) return skillError;
  }

  const { traitIds, secondaryCheckSkillIds, heightenings, ...rest } =
    ritualToUpdate;
  const data: Prisma.RitualUncheckedUpdateInput = {
    ...rest,
    ...(traitIds !== undefined && {
      traits: { set: traitIds.map((traitId) => ({ id: traitId })) },
    }),
    ...(secondaryCheckSkillIds !== undefined && {
      secondaryCheckSkills: {
        set: secondaryCheckSkillIds.map((skillId) => ({ id: skillId })),
      },
    }),
  };

  if (heightenings !== undefined) {
    const [, , updated] = await prisma.$transaction([
      prisma.ritualHeightening.deleteMany({ where: { ritualId: id as string } }),
      prisma.ritualHeightening.createMany({
        data: heightenings.map((h) => ({
          ritualId: id as string,
          fixedRank: h.fixedRank,
          effect: h.effect,
        })),
      }),
      prisma.ritual.update({ where: { id }, data }),
    ]);
    return updated;
  }

  return prisma.ritual.update({ where: { id }, data });
};

export const deleteRitual = async ({
  id,
}: Prisma.RitualWhereUniqueInput): Promise<Ritual | ErrorResult> => {
  const existing = await prisma.ritual.findUnique({
    select: { deletedAt: true },
    where: { id },
  });
  if (!existing || existing.deletedAt) {
    return { code: ErrorCode.NotFound, message: "Ritual Not Found" };
  }
  return prisma.ritual.update({
    data: { deletedAt: new Date() },
    where: { id },
  });
};
