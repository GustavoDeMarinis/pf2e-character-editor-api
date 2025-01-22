import {
  Ancestry,
  AncestrySize,
  Attribute,
  Prisma,
  Rarity,
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

type AncestryToInsert = Pick<
  Prisma.AncestryUncheckedCreateInput,
  | "name"
  | "description"
  | "attributeBoost"
  | "attributeFlaw"
  | "hitPoints"
  | "rarity"
  | "size"
  | "speed"
> & {
  traitIds: string[];
  languageIds: string[];
};

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
  const count = await getQueryCount(prisma.ancestry, where);

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
      message: "Ancestry Retrieved by Id",
      details: { ancestry },
    });
  }
  return ancestry;
};

export const insertAncestry = async (
  ancestryToInsert: AncestryToInsert
): Promise<AncestryResult | ErrorResult> => {
  const existingAncestry = await prisma.ancestry.findMany({
    select: {
      id: true,
      deletedAt: true,
      name: true,
    },
    where: {
      name: ancestryToInsert.name,
    },
  });
  const activeAncestry = existingAncestry.find(
    (ancestry) => ancestry.deletedAt === null
  );

  if (activeAncestry) {
    return {
      code: ErrorCode.DataConflict,
      message: "There is already an Ancestry record with that name",
    };
  }
  const { traitIds, languageIds, ...rest } = ancestryToInsert;
  const data: Prisma.AncestryUncheckedCreateInput = {
    ...rest,
    traits: {
      connect: traitIds.map((traitId) => ({ id: traitId })),
    },
    languages: {
      connect: languageIds.map((languageId) => ({ id: languageId })),
    },
  };
  const createdAncestry = prisma.ancestry.create({
    select: ancestrySelect,
    data,
  });

  return createdAncestry;
};

export const updateAncestry = async (
  { id }: Prisma.AncestryWhereUniqueInput,
  ancestryToUpdate: Pick<
    Prisma.AncestryUncheckedUpdateInput,
    | "name"
    | "description"
    | "attributeBoost"
    | "attributeFlaw"
    | "hitPoints"
    | "rarity"
    | "size"
    | "speed"
  > & { traitIds?: string[]; languageIds?: string[] },
  reactivate?: false
): Promise<Ancestry | ErrorResult> => {
  const { traitIds, languageIds, ...rest } = ancestryToUpdate;
  const data: Prisma.AncestryUncheckedUpdateInput = {
    ...rest,
    traits: {
      set: traitIds?.map((traitId) => ({ id: traitId })),
    },
    languages: {
      set: languageIds?.map((languageId) => ({ id: languageId })),
    },
  };

  if (reactivate) {
    data.deletedAt = null;
  }

  const updatedAncestry = await prisma.ancestry.update({
    where: { id },
    data,
  });

  return updatedAncestry;
};

export const deleteAncestry = async ({
  id,
}: Prisma.AncestryWhereUniqueInput): Promise<Ancestry | ErrorResult> => {
  const existingAncestry = await prisma.ancestry.findUnique({
    select: {
      deletedAt: true,
    },
    where: {
      id,
    },
  });
  if (!existingAncestry || existingAncestry.deletedAt) {
    return {
      code: ErrorCode.NotFound,
      message: `Ancestry Not Found`,
    };
  }
  const data = {
    deletedAt: new Date(),
  };

  const deletedAncestry = await prisma.ancestry.update({
    data,
    where: {
      id,
    },
  });

  return deletedAncestry;
};
