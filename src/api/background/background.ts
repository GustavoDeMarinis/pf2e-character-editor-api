import { Attribute, Background, Prisma, Rarity } from "@prisma/client";
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

const subService = "background/service";

export const backgroundSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  name: true,
  description: true,
  rarity: true,
  attributeBoostOptions: true,
  trainedSkillId: true,
  trainedLoreName: true,
  traits: {
    select: {
      name: true,
      description: true,
    },
  },
  trainedSkill: {
    select: {
      id: true,
      name: true,
    },
  },
};

export const backgroundArgs = Prisma.validator<Prisma.BackgroundDefaultArgs>()({
  select: backgroundSelect,
});

export type BackgroundResult = Prisma.BackgroundGetPayload<typeof backgroundArgs>;

type BackgroundToInsert = Pick<
  Prisma.BackgroundUncheckedCreateInput,
  | "name"
  | "description"
  | "rarity"
  | "attributeBoostOptions"
  | "trainedSkillId"
  | "trainedLoreName"
> & { traitIds: string[] };

type BackgroundToUpdate = {
  name?: string;
  description?: string;
  rarity?: Rarity;
  attributeBoostOptions?: Attribute[];
  trainedSkillId?: string | null;
  trainedLoreName?: string | null;
  traitIds?: string[];
};

export const searchBackgrounds = async (
  search: {
    name?: string;
    rarity?: Rarity;
    trainedSkillId?: string;
    isActive?: boolean;
  },
  { skip, take }: PaginationOptions,
  sort?: string
): Promise<SearchResult<BackgroundResult> | ErrorResult> => {
  const { isActive, ...searchFilters } = search;
  const where: Prisma.BackgroundWhereInput = { ...searchFilters };

  if (isActive !== undefined) {
    where.deletedAt = !isActive ? { not: null } : null;
  }

  const orderBy = handleSort(sort);
  const items = await prisma.background.findMany({
    select: backgroundSelect,
    skip,
    take,
    orderBy,
    where,
  });

  const count = await getQueryCount(prisma.background, where);

  logDebug({
    subService,
    message: `Background Search found (${count}) results`,
    details: { count, filter: where },
  });
  return { items, count };
};

export const getBackground = async ({
  id,
}: Required<Pick<Prisma.BackgroundWhereUniqueInput, "id">>): Promise<
  BackgroundResult | ErrorResult
> => {
  const background = await prisma.background.findUniqueOrThrow({
    where: { id },
    select: backgroundSelect,
  });
  logDebug({
    subService,
    message: "Background Retrieved by Id",
    details: { background },
  });
  return background;
};

export const insertBackground = async (
  backgroundToInsert: BackgroundToInsert
): Promise<BackgroundResult | ErrorResult> => {
  if (backgroundToInsert.trainedSkillId) {
    const skill = await prisma.skill.findUnique({
      select: { id: true },
      where: { id: backgroundToInsert.trainedSkillId },
    });
    if (!skill) {
      return { code: ErrorCode.NotFound, message: "Skill not found" };
    }
  }

  const existing = await prisma.background.findFirst({
    select: { id: true, deletedAt: true },
    where: { name: backgroundToInsert.name },
  });
  if (existing && !existing.deletedAt) {
    return {
      code: ErrorCode.DataConflict,
      message: "A background with that name already exists",
    };
  }

  const { traitIds, ...rest } = backgroundToInsert;
  const data: Prisma.BackgroundUncheckedCreateInput = {
    ...rest,
    traits: {
      connect: traitIds.map((id) => ({ id })),
    },
  };
  return prisma.background.create({ select: backgroundSelect, data });
};

export const updateBackground = async (
  { id }: Prisma.BackgroundWhereUniqueInput,
  backgroundToUpdate: BackgroundToUpdate,
  reactivate?: false
): Promise<Background | ErrorResult> => {
  const existing = await prisma.background.findUnique({
    select: { id: true, deletedAt: true },
    where: { id },
  });
  if (!existing || existing.deletedAt) {
    return { code: ErrorCode.NotFound, message: "Background Not Found" };
  }

  if (backgroundToUpdate.trainedSkillId) {
    const skill = await prisma.skill.findUnique({
      select: { id: true },
      where: { id: backgroundToUpdate.trainedSkillId },
    });
    if (!skill) {
      return { code: ErrorCode.NotFound, message: "Skill not found" };
    }
  }

  const { traitIds, ...rest } = backgroundToUpdate;
  const data: Prisma.BackgroundUncheckedUpdateInput = {
    ...rest,
    ...(traitIds !== undefined && {
      traits: { set: traitIds.map((traitId) => ({ id: traitId })) },
    }),
  };
  if (reactivate) {
    data.deletedAt = null;
  }
  return prisma.background.update({ where: { id }, data });
};

export const deleteBackground = async ({
  id,
}: Prisma.BackgroundWhereUniqueInput): Promise<Background | ErrorResult> => {
  const existing = await prisma.background.findUnique({
    select: { deletedAt: true },
    where: { id },
  });
  if (!existing || existing.deletedAt) {
    return { code: ErrorCode.NotFound, message: "Background Not Found" };
  }
  return prisma.background.update({
    data: { deletedAt: new Date() },
    where: { id },
  });
};
