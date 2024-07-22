import { Prisma } from "@prisma/client";
import prisma from "../../../src/integrations/prisma/prisma-client";
import { UserIds } from "./seed-users";
import { ClassIds } from "./seed-character-class";

const buildLocalCharacters = (): Prisma.CharacterUncheckedCreateInput[] => {
  const characters: Prisma.CharacterUncheckedCreateInput[] = [
    {
      characterName: "Saskia",
      characterClassId: ClassIds.barbarian,
      assignedUserId: UserIds.GustavoDm,
      createdByUserId: UserIds.GustavoDm,
      level: 14,
    },
    {
      characterName: "Boro",
      characterClassId: ClassIds.monk,
      assignedUserId: UserIds.GustavoDm,
      createdByUserId: UserIds.GustavoDm,
      level: 14,
    },
    {
      characterName: "Harumi",
      characterClassId: ClassIds.oracle,
      assignedUserId: UserIds.GustavoDm,
      createdByUserId: UserIds.GustavoDm,
      level: 14,
    },
    {
      characterName: "Dunah",
      characterClassId: ClassIds.druid,
      assignedUserId: UserIds.GustavoDm,
      createdByUserId: UserIds.GustavoDm,
      level: 14,
    },
    {
      characterName: "Ithrael",
      characterClassId: ClassIds.magus,
      assignedUserId: UserIds.GustavoDm,
      createdByUserId: UserIds.GustavoDm,
      level: 14,
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
