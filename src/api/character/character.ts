import { Prisma } from "@prisma/client";
import prisma from "../../integrations/prisma/prisma-client";

export const searchCharacters = async () => {
  const where: Prisma.CharacterWhereInput = {};
  const items = await prisma.character.findMany({
    select: {
      characterName: true,
      characterClass: true,
    },
    where,
  });

  return { items };
};
