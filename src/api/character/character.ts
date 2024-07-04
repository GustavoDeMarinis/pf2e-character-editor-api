import { Prisma } from "@prisma/client";
import prisma from "../../integrations/prisma/prisma-client";
import { ErrorCode } from "../shared-types";

export const searchCharacters = async () => {
  const where: Prisma.CharacterWhereInput = {
    deletedAt: null,
  };
  const items = await prisma.character.findMany({
    select: {
      characterName: true,
      characterClass: true,
    },
    where,
  });

  return { items };
};

export const getCharacter = async ({
  id,
}: Required<Pick<Prisma.CharacterWhereUniqueInput, "id">>) => {
  const where: Prisma.CharacterWhereUniqueInput = {
    id,
  };
  const character = await prisma.character.findUnique({
    where,
    select: {
      characterClass: true,
      characterName: true,
    },
  });
  return character;
};

//TODO CharacterToInsert Types to secure consistency
export const insertCharacter = async (characterToInsert: any) => {
  const existingCharacters = await prisma.character.findMany({
    select: {
      id: true,
      deletedAt: true,
      characterName: true,
      playerName: true,
    },
    where: {
      AND: [
        {
          characterName: characterToInsert.characterName,
        },
        {
          playerName: characterToInsert.playerName,
        },
      ],
    },
  });
  let activeCharacters = existingCharacters.find(
    (character) => character.deletedAt !== null
  );

  if (activeCharacters) {
    return {
      code: ErrorCode.DataConflict,
      message: "User already has an active character with the same name",
    };
  }

  const createdCharacter = prisma.character.create({
    select: {
      characterName: true,
      characterClass: true,
    },
    data: {
      //TODO Types to secure consistency
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
    | "characterClass"
    | "playerName"
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

  return { updatedCharacter };
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
      message: `User Not Found`,
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

  return { deletedCharacter };
};
