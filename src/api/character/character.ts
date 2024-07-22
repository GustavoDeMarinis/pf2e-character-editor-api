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

const subService = "character/service";

export const characterSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  characterName: true,
  assignedUserId: true,
  createdByUserId: true,
  ancestry: true,
  characterClass: true,
  background: true,
};

export const characterSearchArgs =
  Prisma.validator<Prisma.CharacterDefaultArgs>()({
    select: characterSelect,
  });

export type CharacterSearchResult = Prisma.CharacterGetPayload<
  typeof characterSearchArgs
>;

type CharacterForInsert = Pick<
  Prisma.CharacterUncheckedCreateInput,
  | "characterName"
  | "characterClassId"
  | "ancestry"
  | "background"
  | "createdByUserId"
  | "assignedUserId"
>;

export const searchCharacters = async (
  search: Pick<
    Prisma.CharacterWhereInput,
    "createdByUserId" | "assignedUserId"
  > & {
    isActive?: boolean;
  },
  { skip, take }: PaginationOptions,
  sort?: string
): Promise<SearchResult<CharacterSearchResult> | ErrorResult> => {
  const { isActive, ...searchFilters } = search;
  const where: Prisma.CharacterWhereInput = {
    ...searchFilters,
  };

  if (search.isActive !== undefined) {
    where.deletedAt = !isActive ? { not: null } : null;
  }
  const orderBy = handleSort(sort);
  const items = await prisma.character.findMany({
    select: characterSelect,
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

export const getCharacter = async ({
  id,
}: Required<Pick<Prisma.CharacterWhereUniqueInput, "id">>): Promise<
  Character | ErrorResult
> => {
  const where: Prisma.CharacterWhereUniqueInput = {
    id,
  };
  const character = await prisma.character.findUniqueOrThrow({
    where,
    select: characterSelect,
  });
  if (character) {
    logDebug({
      subService,
      message: "Character Retrieved by Id",
      details: { character },
    });
  }
  return character;
};

export const insertCharacter = async (
  characterForInsert: CharacterForInsert
): Promise<Character | ErrorResult> => {
  const existingCharacters = await prisma.character.findMany({
    select: {
      id: true,
      deletedAt: true,
      characterName: true,
      createdByUserId: true,
    },
    where: {
      AND: [
        {
          characterName: characterForInsert.characterName,
        },
        {
          createdByUserId: characterForInsert.createdByUserId,
        },
      ],
    },
  });
  const activeCharacters = existingCharacters.find(
    (character) => character.deletedAt !== null
  );

  if (activeCharacters) {
    return {
      code: ErrorCode.DataConflict,
      message: "User already has an active character with the same name",
    };
  }

  const createdCharacter = prisma.character.create({
    select: characterSelect,
    data: {
      ...characterForInsert,
    },
  });

  return createdCharacter;
};

export const updateCharacter = async (
  { id }: Prisma.CharacterWhereUniqueInput,
  characterToUpdate: Pick<
    Prisma.CharacterUncheckedUpdateInput,
    | "characterName"
    | "characterClassId"
    | "assignedUserId"
    | "ancestry"
    | "background"
  >,
  reactivate?: false
) => {
  const data: Prisma.CharacterUncheckedUpdateInput = {
    ...characterToUpdate,
  };
  if (reactivate) {
    data.deletedAt = null;
  }

  const updatedCharacter = await prisma.character.update({
    where: { id },
    data,
  });

  return updatedCharacter;
};

export const deleteCharacter = async ({
  id,
}: Required<Pick<Prisma.CharacterWhereUniqueInput, "id">>) => {
  const existingCharacter = await prisma.character.findUnique({
    select: {
      deletedAt: true,
    },
    where: {
      id,
    },
  });
  if (!existingCharacter || existingCharacter.deletedAt) {
    return {
      code: ErrorCode.NotFound,
      message: `Character Not Found`,
    };
  }
  const data = {
    deletedAt: new Date(),
  };

  const deletedCharacter = await prisma.character.update({
    data,
    where: {
      id,
    },
  });

  return deletedCharacter;
};
