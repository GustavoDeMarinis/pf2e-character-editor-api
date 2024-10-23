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
  assignedUser: {
    select: {
      id: true,
      userName: true,
    },
  },
  createdByUser: {
    select: {
      id: true,
      userName: true,
    },
  },
  ancestry: true,
  characterClass: true,
  background: true,
};

export const characterArgs = Prisma.validator<Prisma.CharacterDefaultArgs>()({
  select: characterSelect,
});

export type CharacterResult = Prisma.CharacterGetPayload<typeof characterArgs>;

type CharacterToInsert = Pick<
  Prisma.CharacterUncheckedCreateInput,
  | "characterName"
  | "characterClassId"
  | "ancestry"
  | "background"
  | "createdByUserId"
  | "assignedUserId"
>;

export const searchCharacters = async (
  search: {
    userCreatorName?: string;
    userAssignedName?: string;
    characterClassName?: string;
    isActive?: boolean;
  },
  { skip, take }: PaginationOptions,
  sort?: string
): Promise<SearchResult<CharacterResult> | ErrorResult> => {
  const {
    isActive,
    userAssignedName,
    userCreatorName,
    characterClassName,
    ...searchFilters
  } = search;
  const where: Prisma.CharacterWhereInput = {
    assignedUser: {
      userName: userAssignedName,
    },
    createdByUser: {
      userName: userCreatorName,
    },
    characterClass: {
      className: characterClassName,
    },
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
  CharacterResult | ErrorResult
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
  characterToInsert: CharacterToInsert
): Promise<CharacterResult | ErrorResult> => {
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
          characterName: characterToInsert.characterName,
        },
        {
          createdByUserId: characterToInsert.createdByUserId,
        },
      ],
    },
  });
  const activeCharacters = existingCharacters.find(
    (character) => character.deletedAt === null
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
      ...characterToInsert,
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
