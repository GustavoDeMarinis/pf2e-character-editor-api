import {
  Prisma,
  Rarity,
  Spell,
  SpellSaveType,
  SpellTradition,
} from "@prisma/client";
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

const subService = "spell/service";

export const spellSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  name: true,
  description: true,
  rank: true,
  isFocus: true,
  traditions: true,
  rarity: true,
  components: true,
  actionCost: true,
  castTimeText: true,
  range: true,
  targets: true,
  targetType: true,
  areaType: true,
  areaSize: true,
  duration: true,
  savingThrow: true,
  basicSave: true,
  traits: {
    select: {
      id: true,
      name: true,
    },
  },
  heightenings: {
    select: {
      id: true,
      interval: true,
      fixedRank: true,
      effect: true,
    },
  },
};

export const spellArgs = Prisma.validator<Prisma.SpellDefaultArgs>()({
  select: spellSelect,
});

export type SpellResult = Prisma.SpellGetPayload<typeof spellArgs>;

type HeighteningInput = {
  interval: number | null;
  fixedRank: number | null;
  effect: string;
};

type SpellToInsert = Pick<
  Prisma.SpellUncheckedCreateInput,
  | "name"
  | "description"
  | "rank"
  | "isFocus"
  | "traditions"
  | "rarity"
  | "components"
  | "actionCost"
  | "castTimeText"
  | "range"
  | "targets"
  | "targetType"
  | "areaType"
  | "areaSize"
  | "duration"
  | "savingThrow"
  | "basicSave"
> & {
  traitIds: string[];
  heightenings: HeighteningInput[];
};

type SpellToUpdate = Pick<
  Prisma.SpellUncheckedUpdateInput,
  | "name"
  | "description"
  | "rank"
  | "isFocus"
  | "traditions"
  | "rarity"
  | "components"
  | "actionCost"
  | "castTimeText"
  | "range"
  | "targets"
  | "targetType"
  | "areaType"
  | "areaSize"
  | "duration"
  | "savingThrow"
  | "basicSave"
> & {
  traitIds?: string[];
  heightenings?: HeighteningInput[];
};

const validateHeighteningXor = (
  heightenings: HeighteningInput[]
): ErrorResult | null => {
  for (const h of heightenings) {
    const hasInterval = h.interval !== null && h.interval !== undefined;
    const hasFixed = h.fixedRank !== null && h.fixedRank !== undefined;
    if (hasInterval === hasFixed) {
      return {
        code: ErrorCode.BadRequest,
        message:
          "Each heightening must have exactly one of `interval` or `fixedRank` set",
      };
    }
  }
  return null;
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

export const searchSpells = async (
  search: {
    search?: string;
    tradition?: SpellTradition;
    rank?: number;
    minRank?: number;
    maxRank?: number;
    isCantrip?: boolean;
    isFocus?: boolean;
    savingThrow?: SpellSaveType;
    traitIds?: string[];
    rarity?: Rarity;
    isActive?: boolean;
  },
  { skip, take }: PaginationOptions,
  sort?: string
): Promise<SearchResult<SpellResult> | ErrorResult> => {
  const {
    isActive,
    search: searchText,
    tradition,
    rank,
    minRank,
    maxRank,
    isCantrip,
    traitIds,
    ...rest
  } = search;

  const where: Prisma.SpellWhereInput = { ...rest };

  if (searchText) {
    where.OR = [
      { name: { contains: searchText, mode: "insensitive" } },
      { description: { contains: searchText, mode: "insensitive" } },
    ];
  }

  if (tradition !== undefined) {
    where.traditions = { has: tradition };
  }

  const rankFilter: Prisma.IntFilter = {};
  if (rank !== undefined) rankFilter.equals = rank;
  if (minRank !== undefined) rankFilter.gte = minRank;
  if (maxRank !== undefined) rankFilter.lte = maxRank;
  if (isCantrip === true) rankFilter.equals = 0;
  if (isCantrip === false) rankFilter.gt = 0;
  if (Object.keys(rankFilter).length > 0) {
    where.rank = rankFilter;
  }

  if (traitIds !== undefined) {
    where.traits = { every: { id: { in: traitIds } } };
  }

  if (isActive !== undefined) {
    where.deletedAt = !isActive ? { not: null } : null;
  }

  const orderBy = handleSort(sort);
  const items = await prisma.spell.findMany({
    select: spellSelect,
    skip,
    take,
    orderBy,
    where,
  });
  const count = await getQueryCount(prisma.spell, where);

  logDebug({
    subService,
    message: `Spell Search found (${count}) results`,
    details: { count, filter: where },
  });
  return { items, count };
};

export const getSpell = async ({
  id,
}: Required<Pick<Prisma.SpellWhereUniqueInput, "id">>): Promise<
  SpellResult | ErrorResult
> => {
  const spell = await prisma.spell.findUniqueOrThrow({
    where: { id },
    select: spellSelect,
  });
  logDebug({
    subService,
    message: "Spell Retrieved by Id",
    details: { spell },
  });
  return spell;
};

export const insertSpell = async (
  spellToInsert: SpellToInsert
): Promise<SpellResult | ErrorResult> => {
  const xorError = validateHeighteningXor(spellToInsert.heightenings);
  if (xorError) return xorError;

  const traitError = await validateTraitIds(spellToInsert.traitIds);
  if (traitError) return traitError;

  const existing = await prisma.spell.findFirst({
    select: { id: true, deletedAt: true },
    where: { name: spellToInsert.name },
  });
  if (existing && !existing.deletedAt) {
    return {
      code: ErrorCode.DataConflict,
      message: "A spell with that name already exists",
    };
  }

  const { traitIds, heightenings, ...rest } = spellToInsert;
  const data: Prisma.SpellUncheckedCreateInput = {
    ...rest,
    traits: { connect: traitIds.map((id) => ({ id })) },
    heightenings: {
      create: heightenings.map((h) => ({
        interval: h.interval,
        fixedRank: h.fixedRank,
        effect: h.effect,
      })),
    },
  };
  return prisma.spell.create({ select: spellSelect, data });
};

export const updateSpell = async (
  { id }: Prisma.SpellWhereUniqueInput,
  spellToUpdate: SpellToUpdate
): Promise<Spell | ErrorResult> => {
  const existing = await prisma.spell.findUnique({
    select: { id: true, deletedAt: true },
    where: { id },
  });
  if (!existing || existing.deletedAt) {
    return { code: ErrorCode.NotFound, message: "Spell Not Found" };
  }

  if (spellToUpdate.heightenings !== undefined) {
    const xorError = validateHeighteningXor(spellToUpdate.heightenings);
    if (xorError) return xorError;
  }

  if (spellToUpdate.traitIds !== undefined) {
    const traitError = await validateTraitIds(spellToUpdate.traitIds);
    if (traitError) return traitError;
  }

  const { traitIds, heightenings, ...rest } = spellToUpdate;
  const data: Prisma.SpellUncheckedUpdateInput = {
    ...rest,
    ...(traitIds !== undefined && {
      traits: { set: traitIds.map((traitId) => ({ id: traitId })) },
    }),
  };

  if (heightenings !== undefined) {
    const [, , updated] = await prisma.$transaction([
      prisma.spellHeightening.deleteMany({ where: { spellId: id } }),
      prisma.spellHeightening.createMany({
        data: heightenings.map((h) => ({
          spellId: id as string,
          interval: h.interval,
          fixedRank: h.fixedRank,
          effect: h.effect,
        })),
      }),
      prisma.spell.update({ where: { id }, data }),
    ]);
    return updated;
  }

  return prisma.spell.update({ where: { id }, data });
};

export const deleteSpell = async ({
  id,
}: Prisma.SpellWhereUniqueInput): Promise<Spell | ErrorResult> => {
  const existing = await prisma.spell.findUnique({
    select: { deletedAt: true },
    where: { id },
  });
  if (!existing || existing.deletedAt) {
    return { code: ErrorCode.NotFound, message: "Spell Not Found" };
  }
  return prisma.spell.update({
    data: { deletedAt: new Date() },
    where: { id },
  });
};

export const withDerivedIsCantrip = <T extends { rank: number }>(
  spell: T
): T & { isCantrip: boolean } => ({
  ...spell,
  isCantrip: spell.rank === 0,
});
