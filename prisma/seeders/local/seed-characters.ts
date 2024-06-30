import { Prisma } from "@prisma/client";
import prisma from "../../../src/integrations/prisma/prisma-client";

const buildLocalCharacters = (): Prisma.CharacterUncheckedCreateInput[] => {
  const characters: Prisma.CharacterUncheckedCreateInput[] = [
    {
      characterName: "Saskia",
      characterClass: "Barbarian",
    },
    {
      characterName: "Boro",
      characterClass: "Monk",
    },
    {
      characterName: "Harumi",
      characterClass: "Oracle",
    },
    {
      characterName: "Dunah",
      characterClass: "Druid",
    },
    {
      characterName: "Ithrael",
      characterClass: "Magus",
    },
  ];

  return characters;
};

export const seedLocalCharacters = async (): Promise<{
  characters: Prisma.CharacterCreateManyInput[];
}> => {
  const characters: Prisma.CharacterCreateManyInput[] = buildLocalCharacters();
  await prisma.character.createMany({
    data: characters,
  });

  return { characters };
};
