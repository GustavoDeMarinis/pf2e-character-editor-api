import {
  Prisma,
  WeaponBase,
  WeaponCategory,
  WeaponDamageType,
} from "@prisma/client";
import {
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
      description: true,
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

export const searchWeaponBase = async (
  search: {
    category?: WeaponCategory;
    damageTypes?: WeaponDamageType[];
    isActive?: boolean;
  },
  { skip, take }: PaginationOptions,
  sort?: string
): Promise<SearchResult<WeaponBaseResult> | ErrorResult> => {
  const { category, damageTypes, isActive, ...searchFilters } = search;
  const where: Prisma.WeaponBaseWhereInput = {
    category,
    damageTypes: {
      hasEvery: damageTypes,
    },
  };

  if (search.isActive !== undefined) {
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
