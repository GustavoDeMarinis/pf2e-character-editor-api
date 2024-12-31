import { Prisma, ArmorBase, ArmorCategory } from "@prisma/client";
import {
  ErrorCode,
  ErrorResult,
  PaginationOptions,
  SearchResult,
} from "../../utils/shared-types";
import prisma from "../../integrations/prisma/prisma-client";
import { handleSort } from "../../utils/sorting";
import { getQueryCount } from "../../utils/pagination";
import { logDebug } from "../../utils/logging";

const subService = "armorBase/service";

export const armorBaseSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  name: true,
  description: true,
  category: true,
  rarity: true,
  armorClass: true,
  dexCap: true,
  checkPenalty: true,
  speedPenalty: true,
  strengthReq: true,
  armorGroup: {
    select: {
      name: true,
      description: true,
    },
  },
  traits: {
    select: {
      name: true,
      description: true,
    },
  },
  price: true,
  bulk: true,
};

export const armorBaseArgs = Prisma.validator<Prisma.ArmorBaseDefaultArgs>()({
  select: armorBaseSelect,
});

export type ArmorBaseResult = Prisma.ArmorBaseGetPayload<typeof armorBaseArgs>;

type ArmorBaseToInsert = Pick<
  Prisma.ArmorBaseUncheckedCreateInput,
  | "name"
  | "description"
  | "category"
  | "rarity"
  | "armorClass"
  | "dexCap"
  | "checkPenalty"
  | "speedPenalty"
  | "strengthReq"
  | "price"
  | "bulk"
> & {
  armorGroupId: string;
  traitIds: string[];
};

export const searchArmorBase = async (
  search: {
    category?: ArmorCategory;
    isActive?: boolean;
  },
  { skip, take }: PaginationOptions,
  sort?: string
): Promise<SearchResult<ArmorBaseResult> | ErrorResult> => {
  const { category, isActive, ...searchFilters } = search;
  const where: Prisma.ArmorBaseWhereInput = {
    category,
  };

  if (search.isActive !== undefined) {
    where.deletedAt = !isActive ? { not: null } : null;
  }
  const orderBy = handleSort(sort);
  const items = await prisma.armorBase.findMany({
    select: armorBaseSelect,
    skip,
    take,
    orderBy,
    where,
  });
  const count = await getQueryCount(prisma.armorBase, where);

  logDebug({
    subService,
    message: `ArmorBase Search found (${count}) results`,
    details: {
      count: count,
      filter: where,
    },
  });
  return { items, count };
};

export const getArmorBase = async ({
  id,
}: Required<Pick<Prisma.ArmorBaseWhereUniqueInput, "id">>): Promise<
  ArmorBaseResult | ErrorResult
> => {
  const where: Prisma.ArmorBaseWhereUniqueInput = {
    id,
  };
  const armorBase = await prisma.armorBase.findUniqueOrThrow({
    where,
    select: armorBaseSelect,
  });
  if (armorBase) {
    logDebug({
      subService,
      message: "Armor Base Retrieved by Id",
      details: { armorBase },
    });
  }
  return armorBase;
};

export const insertArmorBase = async (
  armorBaseToInsert: ArmorBaseToInsert
): Promise<ArmorBaseResult | ErrorResult> => {
  const existingArmorBase = await prisma.armorBase.findMany({
    select: {
      id: true,
      deletedAt: true,
      name: true,
    },
    where: {
      name: armorBaseToInsert.name,
    },
  });
  const activeArmorBaseClass = existingArmorBase.find(
    (armorBase) => armorBase.deletedAt === null
  );

  if (activeArmorBaseClass) {
    return {
      code: ErrorCode.DataConflict,
      message: "There is already a Armor Base record with that name",
    };
  }

  const { traitIds, ...rest } = armorBaseToInsert;
  const data: Prisma.ArmorBaseUncheckedCreateInput = {
    ...rest,
    traits: {
      connect: traitIds.map((traitId) => ({ id: traitId })),
    },
  };
  const createdArmorBase = prisma.armorBase.create({
    select: armorBaseSelect,
    data,
  });

  return createdArmorBase;
};

export const updateArmorBase = async (
  { id }: Prisma.ArmorBaseWhereUniqueInput,
  armorBaseToUpdate: Pick<
    Prisma.ArmorBaseUncheckedUpdateInput,
    | "name"
    | "description"
    | "category"
    | "rarity"
    | "armorClass"
    | "dexCap"
    | "checkPenalty"
    | "speedPenalty"
    | "strengthReq"
    | "price"
    | "bulk"
    | "armorGroupId"
  > & { traitIds?: string[] | undefined },
  reactivate?: false
): Promise<ArmorBase | ErrorResult> => {
  const { traitIds, ...rest } = armorBaseToUpdate;
  const data: Prisma.ArmorBaseUncheckedUpdateInput = {
    ...rest,
    traits: {
      set: traitIds?.map((traitId) => ({ id: traitId })),
    },
  };
  if (reactivate) {
    data.deletedAt = null;
  }

  const updatedArmorBase = await prisma.armorBase.update({
    where: { id },
    data,
  });

  return updatedArmorBase;
};

export const deleteArmorBase = async ({
  id,
}: Prisma.ArmorBaseWhereUniqueInput): Promise<ArmorBase | ErrorResult> => {
  const existingArmorBase = await prisma.armorBase.findUnique({
    select: {
      deletedAt: true,
    },
    where: {
      id,
    },
  });
  if (!existingArmorBase || existingArmorBase.deletedAt) {
    return {
      code: ErrorCode.NotFound,
      message: `Armor Base Not Found`,
    };
  }
  const data = {
    deletedAt: new Date(),
  };

  const deletedArmorBase = await prisma.armorBase.update({
    data,
    where: {
      id,
    },
  });

  return deletedArmorBase;
};
