import { Heritage, Prisma, Rarity } from "@prisma/client";
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

const subService = "heritage/service";

export const heritageSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  name: true,
  description: true,
  ancestryId: true,
  rarity: true,
  traits: {
    select: {
      name: true,
      description: true,
    },
  },
};

export const heritageArgs = Prisma.validator<Prisma.HeritageDefaultArgs>()({
  select: heritageSelect,
});

export type HeritageResult = Prisma.HeritageGetPayload<typeof heritageArgs>;

type HeritageToInsert = Pick<
  Prisma.HeritageUncheckedCreateInput,
  "name" | "description" | "ancestryId" | "rarity"
> & { traitIds: string[] };

export const searchHeritages = async (
  search: {
    name?: string;
    ancestryId?: string;
    rarity?: Rarity;
    isActive?: boolean;
  },
  { skip, take }: PaginationOptions,
  sort?: string
): Promise<SearchResult<HeritageResult> | ErrorResult> => {
  const { isActive, ...searchFilters } = search;
  const where: Prisma.HeritageWhereInput = { ...searchFilters };
  
  if (isActive !== undefined) {
    where.deletedAt = !isActive ? { not: null } : null;
  }
  
  const orderBy = handleSort(sort);
  const items = await prisma.heritage.findMany({
    select: heritageSelect,
    skip,
    take,
    orderBy,
    where,
  });
  
  const count = await getQueryCount(prisma.heritage, where);

  logDebug({
    subService,
    message: `Heritage Search found (${count}) results`,
    details: { count, filter: where },
  });
  return { items, count };
};

export const getHeritage = async ({
  id,
}: Required<Pick<Prisma.HeritageWhereUniqueInput, "id">>): Promise<
  HeritageResult | ErrorResult
> => {
  const heritage = await prisma.heritage.findUniqueOrThrow({
    where: { id },
    select: heritageSelect,
  });
  logDebug({
    subService,
    message: "Heritage Retrieved by Id",
    details: { heritage },
  });
  return heritage;
};

export const insertHeritage = async (
  heritageToInsert: HeritageToInsert
): Promise<HeritageResult | ErrorResult> => {
  const ancestry = await prisma.ancestry.findUnique({
    select: { id: true },
    where: { id: heritageToInsert.ancestryId },
  });
  if (!ancestry) {
    return { code: ErrorCode.NotFound, message: "Ancestry not found" };
  }

  const existing = await prisma.heritage.findFirst({
    select: { id: true, deletedAt: true },
    where: {
      name: heritageToInsert.name,
      ancestryId: heritageToInsert.ancestryId,
    },
  });
  if (existing && !existing.deletedAt) {
    return {
      code: ErrorCode.DataConflict,
      message: "A heritage with that name already exists for this ancestry",
    };
  }

  const { traitIds, ...rest } = heritageToInsert;
  const data: Prisma.HeritageUncheckedCreateInput = {
    ...rest,
    traits: {
      connect: traitIds.map((id) => ({ id })),
    },
  };
  return prisma.heritage.create({ select: heritageSelect, data });
};

export const updateHeritage = async (
  { id }: Prisma.HeritageWhereUniqueInput,
  heritageToUpdate: Pick<
    Prisma.HeritageUncheckedUpdateInput,
    "name" | "description" | "rarity"
  > & { traitIds?: string[] },
  reactivate?: false
): Promise<Heritage | ErrorResult> => {
  const existing = await prisma.heritage.findUnique({
    select: { id: true, deletedAt: true },
    where: { id },
  });
  if (!existing || existing.deletedAt) {
    return { code: ErrorCode.NotFound, message: "Heritage Not Found" };
  }

  const { traitIds, ...rest } = heritageToUpdate;
  const data: Prisma.HeritageUncheckedUpdateInput = {
    ...rest,
    ...(traitIds !== undefined && {
      traits: { set: traitIds.map((traitId) => ({ id: traitId })) },
    }),
  };
  if (reactivate) {
    data.deletedAt = null;
  }
  return prisma.heritage.update({ where: { id }, data });
};

export const deleteHeritage = async ({
  id,
}: Prisma.HeritageWhereUniqueInput): Promise<Heritage | ErrorResult> => {
  const existing = await prisma.heritage.findUnique({
    select: { deletedAt: true },
    where: { id },
  });
  if (!existing || existing.deletedAt) {
    return { code: ErrorCode.NotFound, message: "Heritage Not Found" };
  }
  return prisma.heritage.update({
    data: { deletedAt: new Date() },
    where: { id },
  });
};
