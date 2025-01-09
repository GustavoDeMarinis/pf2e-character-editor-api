import { Attribute, Prisma } from "@prisma/client";
import prisma from "../../../src/integrations/prisma/prisma-client";
import { UserIds } from "./seed-users";
import { ClassIds } from "./seed-character-class";
import { ancestryIds } from "./seed-ancestry";

const CHARACTERLEVEL = 14;

const buildLocalCharacters = (): Prisma.CharacterUncheckedCreateInput[] => {
  const characters: Prisma.CharacterUncheckedCreateInput[] = [
    {
      characterName: "Saskia",
      characterClassId: ClassIds.barbarian,
      assignedUserId: UserIds.GustavoDm,
      createdByUserId: UserIds.GustavoDm,
      level: CHARACTERLEVEL,
      ancestryId: ancestryIds.orc,
      classBoost: Attribute.Strength,
      ancestryBoost: [Attribute.Strength, Attribute.Constitution],
      backgroundBoost: [Attribute.Strength, Attribute.Constitution],
      classDc: CHARACTERLEVEL + 10 + 4 + 3,
    },
    {
      characterName: "Boro",
      characterClassId: ClassIds.monk,
      assignedUserId: UserIds.GustavoDm,
      createdByUserId: UserIds.GustavoDm,
      level: CHARACTERLEVEL,
      ancestryId: ancestryIds.human,
      classBoost: Attribute.Strength,
      ancestryBoost: [Attribute.Dexterity, Attribute.Constitution],
      backgroundBoost: [Attribute.Strength, Attribute.Constitution],
      classDc: CHARACTERLEVEL + 10 + 4 + 3,
    },
    {
      characterName: "Harumi",
      characterClassId: ClassIds.oracle,
      assignedUserId: UserIds.GustavoDm,
      createdByUserId: UserIds.GustavoDm,
      level: CHARACTERLEVEL,
      ancestryId: ancestryIds.kitsune,
      classBoost: Attribute.Wisdom,
      ancestryBoost: [Attribute.Wisdom, Attribute.Intelligence],
      backgroundBoost: [Attribute.Wisdom, Attribute.Dexterity],
      classDc: CHARACTERLEVEL + 10 + 4 + 3,
    },
    {
      characterName: "Dunah",
      characterClassId: ClassIds.druid,
      assignedUserId: UserIds.GustavoDm,
      createdByUserId: UserIds.GustavoDm,
      level: CHARACTERLEVEL,
      ancestryId: ancestryIds.drow,
      classBoost: Attribute.Wisdom,
      ancestryBoost: [Attribute.Wisdom, Attribute.Constitution],
      backgroundBoost: [Attribute.Wisdom, Attribute.Dexterity],
      classDc: CHARACTERLEVEL + 10 + 4 + 3,
    },
    {
      characterName: "Ithrael",
      characterClassId: ClassIds.magus,
      assignedUserId: UserIds.GustavoDm,
      createdByUserId: UserIds.GustavoDm,
      level: CHARACTERLEVEL,
      ancestryId: ancestryIds.aasimar,
      classBoost: Attribute.Strength,
      ancestryBoost: [Attribute.Strength, Attribute.Intelligence],
      backgroundBoost: [Attribute.Strength, Attribute.Dexterity],
      classDc: CHARACTERLEVEL + 10 + 4 + 3,
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
