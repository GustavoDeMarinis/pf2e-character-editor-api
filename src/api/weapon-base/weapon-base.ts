import {
  Prisma,
  WeaponBase,
  WeaponCategory,
  WeaponDamageType,
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

const subService = "weaponBase/service";

export const weaponBaseSelect = {
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
  weaponGroup: {
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

export const weaponBaseArgs = Prisma.validator<Prisma.WeaponBaseDefaultArgs>()({
  select: weaponBaseSelect,
});

export type WeaponBaseResult = Prisma.WeaponBaseGetPayload<
  typeof weaponBaseArgs
>;

type WeaponBaseToInsert = Pick<
  Prisma.WeaponBaseUncheckedCreateInput,
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
  weaponGroupId: string;
  traitIds: string[];
};

export const searchWeaponBase = async (
  search: {
    category?: WeaponCategory;
    damageTypes?: WeaponDamageType[];
    isActive?: boolean;
  },
  { skip, take }: PaginationOptions,
  sort?: string
): Promise<SearchResult<WeaponBaseResult> | ErrorResult> => {
  const { category, damageTypes, isActive } = search;
  const where: Prisma.WeaponBaseWhereInput = {
    category,
  };
  if (damageTypes) {
    where.damageTypes = {
      hasEvery: damageTypes,
    };
  }
  if (isActive !== undefined) {
    where.deletedAt = !isActive ? { not: null } : null;
  }
  const orderBy = handleSort(sort);
  const items = await prisma.weaponBase.findMany({
    select: weaponBaseSelect,
    skip,
    take,
    orderBy,
    where,
  });
  const count = await getQueryCount(prisma.weaponBase, where);

  logDebug({
    subService,
    message: `WeaponBase Search found (${count}) results`,
    details: {
      count: count,
      filter: where,
    },
  });
  return { items, count };
};

export const getWeaponBase = async ({
  id,
}: Required<Pick<Prisma.WeaponBaseWhereUniqueInput, "id">>): Promise<
  WeaponBaseResult | ErrorResult
> => {
  const where: Prisma.WeaponBaseWhereUniqueInput = {
    id,
  };
  const weaponBase = await prisma.weaponBase.findUniqueOrThrow({
    where,
    select: weaponBaseSelect,
  });
  if (weaponBase) {
    logDebug({
      subService,
      message: "Weapon Base Retrieved by Id",
      details: { weaponBase },
    });
  }
  return weaponBase;
};

export const insertWeaponBase = async (
  weaponBaseToInsert: WeaponBaseToInsert
): Promise<WeaponBaseResult | ErrorResult> => {
  const existingWeaponBase = await prisma.weaponBase.findMany({
    select: {
      id: true,
      deletedAt: true,
      name: true,
    },
    where: {
      name: weaponBaseToInsert.name,
    },
  });
  const activeWeaponBaseClass = existingWeaponBase.find(
    (weaponBase) => weaponBase.deletedAt === null
  );

  if (activeWeaponBaseClass) {
    return {
      code: ErrorCode.DataConflict,
      message: "There is already a Weapon Base record with that name",
    };
  }
  const { traitIds, ...rest } = weaponBaseToInsert;
  const data: Prisma.WeaponBaseUncheckedCreateInput = {
    ...rest,
    traits: {
      connect: traitIds.map((traitId) => ({ id: traitId })),
    },
  };
  const createdWeaponBase = prisma.weaponBase.create({
    select: weaponBaseSelect,
    data,
  });

  return createdWeaponBase;
};

export const updateWeaponBase = async (
  { id }: Prisma.WeaponBaseWhereUniqueInput,
  weaponBaseToUpdate: Pick<
    Prisma.WeaponBaseUncheckedUpdateInput,
    | "name"
    | "description"
    | "category"
    | "damageTypes"
    | "diceAmount"
    | "diceSize"
    | "criticalDiceAmount"
    | "criticalDiceSize"
    | "weaponGroupId"
    | "hands"
    | "range"
    | "bulk"
  > & { traitIds?: string[] | undefined },
  reactivate?: false
): Promise<WeaponBase | ErrorResult> => {
  const { traitIds, ...rest } = weaponBaseToUpdate;
  const data: Prisma.WeaponBaseUncheckedUpdateInput = {
    ...rest,
    traits: {
      set: traitIds?.map((traitId) => ({ id: traitId })),
    },
  };

  if (reactivate) {
    data.deletedAt = null;
  }

  const updatedWeaponBase = await prisma.weaponBase.update({
    where: { id },
    data,
  });

  return updatedWeaponBase;
};

export const deleteWeaponBase = async ({
  id,
}: Prisma.WeaponBaseWhereUniqueInput): Promise<WeaponBase | ErrorResult> => {
  const existingWeaponBase = await prisma.weaponBase.findUnique({
    select: {
      deletedAt: true,
    },
    where: {
      id,
    },
  });
  if (!existingWeaponBase || existingWeaponBase.deletedAt) {
    return {
      code: ErrorCode.NotFound,
      message: `Weapon Base Not Found`,
    };
  }
  const data = {
    deletedAt: new Date(),
  };

  const deletedWeaponBase = await prisma.weaponBase.update({
    data,
    where: {
      id,
    },
  });

  return deletedWeaponBase;
};
