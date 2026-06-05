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
    name?: string;
    rarity?: Rarity;
    isActive?: boolean;
  },
  { skip, take }: PaginationOptions,
  sort?: string
): Promise<SearchResult<LanguageResult> | ErrorResult> => {
  const { isActive, name, rarity } = search;
  const where: Prisma.LanguageWhereInput = {};
  if (name !== undefined) {
    where.name = { contains: name, mode: "insensitive" };
  }
  if (rarity !== undefined) {
    where.rarity = rarity;
  }
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
    message: `Language Search found (${count}) results`,
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
  logDebug({
    subService,
    message: "Language Retrieved by Id",
    details: { language },
  });
  return language;
};

export const insertLanguage = async (
  languageToInsert: LanguageToInsert
): Promise<LanguageResult | ErrorResult> => {
  const existingLanguage = await prisma.language.findFirst({
    select: { id: true, deletedAt: true },
    where: { name: languageToInsert.name },
  });

  if (existingLanguage && !existingLanguage.deletedAt) {
    return {
      code: ErrorCode.DataConflict,
      message: "A language with that name already exists",
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
  const existing = await prisma.language.findUnique({
    select: { id: true, deletedAt: true },
    where: { id },
  });
  if (!existing || existing.deletedAt) {
    return { code: ErrorCode.NotFound, message: "Language Not Found" };
  }

  if (typeof languageToUpdate.name === "string") {
    const nameConflict = await prisma.language.findFirst({
      select: { id: true, deletedAt: true },
      where: { name: languageToUpdate.name, id: { not: id } },
    });
    if (nameConflict && !nameConflict.deletedAt) {
      return {
        code: ErrorCode.DataConflict,
        message: "A language with that name already exists",
      };
    }
  }

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
      message: `Language Not Found`,
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
