import { Character, Prisma } from "@prisma/client";
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

const subService = "characterClass/service";

export const characterClassSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  className: true,
  description: true,
  keyAttributes: true,
  hitPoints: true,
};

export const characterClassArgs =
  Prisma.validator<Prisma.CharacterClassDefaultArgs>()({
    select: characterClassSelect,
  });

export type CharacterClassResult = Prisma.CharacterClassGetPayload<
  typeof characterClassArgs
>;

type CharacterClassForInsert = Pick<
  Prisma.CharacterClassUncheckedCreateInput,
  "className" | "description" | "keyAttributes" | "hitPoints"
>;

export const searchCharactersClass = async (
  search: Pick<Prisma.CharacterClassWhereInput, "className"> & {
    isActive?: boolean;
  },
  { skip, take }: PaginationOptions,
  sort?: string
): Promise<SearchResult<CharacterClassResult> | ErrorResult> => {
  const { isActive, ...searchFilters } = search;
  const where: Prisma.CharacterClassWhereInput = {
    ...searchFilters,
  };

  if (search.isActive !== undefined) {
    where.deletedAt = !isActive ? { not: null } : null;
  }
  const orderBy = handleSort(sort);
  const items = await prisma.characterClass.findMany({
    select: characterClassSelect,
    skip,
    take,
    orderBy,
    where,
  });
  const count = await getQueryCount(prisma.characterClass, where);

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

export const getCharacterClass = async ({
  id,
}: Required<Pick<Prisma.CharacterClassWhereUniqueInput, "id">>): Promise<
  CharacterClassResult | ErrorResult
> => {
  const where: Prisma.CharacterClassWhereUniqueInput = {
    id,
  };
  const characterClass = await prisma.characterClass.findUniqueOrThrow({
    where,
    select: characterClassSelect,
  });
  if (characterClass) {
    logDebug({
      subService,
      message: "Character Retrieved by Id",
      details: { characterClass },
    });
  }
  return characterClass;
};

export const insertCharacterClass = async (
  characterClassForInsert: CharacterClassForInsert
): Promise<CharacterClassResult | ErrorResult> => {
  const existingCharactersClass = await prisma.characterClass.findMany({
    select: {
      id: true,
      deletedAt: true,
      className: true,
    },
    where: {
      className: characterClassForInsert.className,
    },
  });
  const activeCharactersClass = existingCharactersClass.find(
    (characterClass) => characterClass.deletedAt === null
  );

  if (activeCharactersClass) {
    return {
      code: ErrorCode.DataConflict,
      message: "There is already a characterClass record with that className",
    };
  }

  const createdCharacter = prisma.characterClass.create({
    select: characterClassSelect,
    data: {
      ...characterClassForInsert,
    },
  });

  return createdCharacter;
};

export const updateCharacterClass = async (
  { id }: Prisma.CharacterClassWhereUniqueInput,
  characterClassToUpdate: Pick<
    Prisma.CharacterClassUncheckedUpdateInput,
    "className" | "description" | "keyAttributes" | "hitPoints"
  >,
  reactivate?: false
) => {
  const data: Prisma.CharacterClassUncheckedUpdateInput = {
    ...characterClassToUpdate,
  };
  if (reactivate) {
    data.deletedAt = null;
  }

  const updatedCharacterClass = await prisma.characterClass.update({
    where: { id },
    data,
  });

  return updatedCharacterClass;
};

export const deleteCharacterClass = async ({
  id,
}: Required<Pick<Prisma.CharacterClassWhereUniqueInput, "id">>) => {
  const existingCharacterClass = await prisma.characterClass.findUnique({
    select: {
      deletedAt: true,
    },
    where: {
      id,
    },
  });
  if (!existingCharacterClass || existingCharacterClass.deletedAt) {
    return {
      code: ErrorCode.NotFound,
      message: `Character Not Found`,
    };
  }
  const data = {
    deletedAt: new Date(),
  };

  const deletedCharacterClass = await prisma.characterClass.update({
    data,
    where: {
      id,
    },
  });

  return deletedCharacterClass;
};
