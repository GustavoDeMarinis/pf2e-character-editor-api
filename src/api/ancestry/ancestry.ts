import { AncestrySize, Attribute, Prisma, Rarity } from "@prisma/client";
import prisma from "../../integrations/prisma/prisma-client";
import {
  ErrorResult,
  PaginationOptions,
  SearchResult,
} from "../../utils/shared-types";
import { handleSort } from "../../utils/sorting";
import { getQueryCount } from "../../utils/pagination";
import { logDebug } from "../../utils/logging";

const subService = "ancestry/service";

export const ancestrySelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  name: true,
  description: true,
  hitpoints: true,
  size: true,
  speed: true,
  attributeBoost: true,
  attributeFlaw: true,
  traits: {
    select: {
      name: true,
      description: true,
    },
  },
  languages: {
    select: {
      name: true,
    },
  },
};

export const ancestryArgs = Prisma.validator<Prisma.AncestryDefaultArgs>()({
  select: ancestrySelect,
});

export type AncestryResult = Prisma.AncestryGetPayload<typeof ancestryArgs>;

export const searchAncestries = async (
  search: {
    traits?: string[];
    hitpoints?: number;
    size?: AncestrySize;
    speed?: number;
    attributeBoost?: Attribute[];
    attributeFlaw?: Attribute[];
    rarity?: Rarity;
    isActive?: boolean;
  },
  { skip, take }: PaginationOptions,
  sort?: string
): Promise<SearchResult<AncestryResult> | ErrorResult> => {
  const { isActive, traits, attributeBoost, attributeFlaw, ...searchFilters } =
    search;
  const where: Prisma.AncestryWhereInput = {
    ...searchFilters,
    traits: {
      every: {
        id: {
          in: traits,
        },
      },
    },
    attributeBoost: {
      hasEvery: attributeBoost,
    },
    attributeFlaw: {
      hasEvery: attributeFlaw,
    },
  };
  if (isActive !== undefined) {
    where.deletedAt = !isActive ? { not: null } : null;
  }
  const orderBy = handleSort(sort);
  const items = await prisma.ancestry.findMany({
    select: ancestrySelect,
    skip,
    take,
    orderBy,
    where,
  });
  const count = await getQueryCount(prisma.character, where);

  logDebug({
    subService,
    message: `Character Search found (${count}) results`,
    details: {
      count: count,
      filter: where,
    },
  });
  return { items, count };
};

export const getAncestry = async ({
  id,
}: Required<Pick<Prisma.AncestryWhereUniqueInput, "id">>): Promise<
  AncestryResult | ErrorResult
> => {
  const where: Prisma.AncestryWhereUniqueInput = {
    id,
  };
  const ancestry = await prisma.ancestry.findUniqueOrThrow({
    where,
    select: ancestrySelect,
  });
  if (ancestry) {
    logDebug({
      subService,
      message: "Weapon Base Retrieved by Id",
      details: { ancestry },
    });
  }
  return ancestry;
};
