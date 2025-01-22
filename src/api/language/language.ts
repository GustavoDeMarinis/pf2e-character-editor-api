import { Language, Prisma, Rarity } from "@prisma/client";
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

const subService = "language/service";

export const languageSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  name: true,
  description: true,
  rarity: true,
};

export const languageArgs = Prisma.validator<Prisma.LanguageDefaultArgs>()({
  select: languageSelect,
});

export type LanguageResult = Prisma.LanguageGetPayload<typeof languageArgs>;

type LanguageToInsert = Pick<
  Prisma.LanguageUncheckedCreateInput,
  "name" | "description" | "rarity"
>;

export const searchLanguage = async (
  search: {
    rarity?: Rarity;
    isActive?: boolean;
  },
  { skip, take }: PaginationOptions,
  sort?: string
): Promise<SearchResult<LanguageResult> | ErrorResult> => {
  const { isActive, ...searchFilters } = search;
  const where: Prisma.LanguageWhereInput = {
    ...searchFilters,
  };
  if (isActive !== undefined) {
    where.deletedAt = !isActive ? { not: null } : null;
  }
  const orderBy = handleSort(sort);
  const items = await prisma.language.findMany({
    select: languageSelect,
    skip,
    take,
    orderBy,
    where,
  });
  const count = await getQueryCount(prisma.language, where);

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

export const getLanguage = async ({
  id,
}: Required<Pick<Prisma.LanguageWhereUniqueInput, "id">>): Promise<
  LanguageResult | ErrorResult
> => {
  const where: Prisma.LanguageWhereUniqueInput = {
    id,
  };
  const language = await prisma.language.findUniqueOrThrow({
    where,
    select: languageSelect,
  });
  if (language) {
    logDebug({
      subService,
      message: "Language Retrieved by Id",
      details: { language },
    });
  }
  return language;
};

export const insertLanguage = async (
  languageToInsert: LanguageToInsert
): Promise<LanguageResult | ErrorResult> => {
  const existingLanguage = await prisma.language.findMany({
    select: {
      id: true,
      deletedAt: true,
      name: true,
    },
    where: {
      name: languageToInsert.name,
    },
  });
  const activeLanguage = existingLanguage.find(
    (language) => language.deletedAt === null
  );

  if (activeLanguage) {
    return {
      code: ErrorCode.DataConflict,
      message: "There is already an Language record with that name",
    };
  }
  const data: Prisma.LanguageUncheckedCreateInput = {
    ...languageToInsert,
  };
  const createdLanguange = prisma.language.create({
    select: languageSelect,
    data,
  });

  return createdLanguange;
};

export const updateLanguage = async (
  { id }: Prisma.LanguageWhereUniqueInput,
  languageToUpdate: Pick<
    Prisma.LanguageUncheckedUpdateInput,
    "name" | "description" | "rarity"
  >,
  reactivate?: false
): Promise<Language | ErrorResult> => {
  const data: Prisma.LanguageUncheckedUpdateInput = {
    ...languageToUpdate,
  };

  if (reactivate) {
    data.deletedAt = null;
  }

  const updatedLanguage = await prisma.language.update({
    where: { id },
    data,
  });

  return updatedLanguage;
};

export const deleteLanguage = async ({
  id,
}: Prisma.LanguageWhereUniqueInput): Promise<Language | ErrorResult> => {
  const existingLanguage = await prisma.language.findUnique({
    select: {
      deletedAt: true,
    },
    where: {
      id,
    },
  });
  if (!existingLanguage || existingLanguage.deletedAt) {
    return {
      code: ErrorCode.NotFound,
      message: `Ancestry Not Found`,
    };
  }
  const data = {
    deletedAt: new Date(),
  };

  const deletedLanguage = await prisma.language.update({
    data,
    where: {
      id,
    },
  });

  return deletedLanguage;
};
