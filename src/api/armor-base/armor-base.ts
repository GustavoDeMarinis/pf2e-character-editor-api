import {
  Prisma,
  ArmorBase,
  ArmorCategory,
  ArmorDamageType,
} from "@prisma/client";
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
  damageTypes: true,
  diceAmount: true,
  diceSize: true,
  criticalDiceAmount: true,
  criticalDiceSize: true,
  armorGroup: {
    select: {
      name: true,
      criticalSpecialization: {
        select: {
          name: true,
          description: true,
        },
      },
    },
  },
  traits: {
    select: {
      name: true,
      description: true,
    },
  },
  hands: true,
  range: true,
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
  | "damageTypes"
  | "diceAmount"
  | "diceSize"
  | "criticalDiceAmount"
  | "criticalDiceSize"
  | "hands"
  | "range"
  | "bulk"
> & {
  armorGroupId: string;
  traitIds: string[];
};
export const searchArmorBase = async (
  search: {
    category?: ArmorCategory;
    damageTypes?: ArmorDamageType[];
    isActive?: boolean;
  },
  { skip, take }: PaginationOptions,
  sort?: string
): Promise<SearchResult<ArmorBaseResult> | ErrorResult> => {
  const { category, damageTypes, isActive, ...searchFilters } = search;
  const where: Prisma.ArmorBaseWhereInput = {
    category,
    damageTypes: {
      hasEvery: damageTypes,
    },
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

  const createdArmorBase = prisma.armorBase.create({
    select: armorBaseSelect,
    data: {
      ...armorBaseToInsert,
    },
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
    | "damageTypes"
    | "diceAmount"
    | "diceSize"
    | "criticalDiceAmount"
    | "criticalDiceSize"
    | "armorGroupId"
    | "hands"
    | "range"
    | "bulk"
  > & { traitIds?: string[] | undefined },
  reactivate?: false
): Promise<ArmorBase | ErrorResult> => {
  const data: Prisma.ArmorBaseUncheckedUpdateInput = {
    ...armorBaseToUpdate,
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
