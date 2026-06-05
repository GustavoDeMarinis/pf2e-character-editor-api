import { Attribute, Prisma } from "@prisma/client";
import prisma from "../../../src/integrations/prisma/prisma-client";
import { UserIds } from "./seed-users";
import { ClassIds } from "./seed-character-class";
import { ancestryIds } from "./seed-ancestry";
import { languageIds } from "./seed-languages";

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
      languages: {
        connect: [{ id: languageIds.common }, { id: languageIds.orc }],
      },
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
      languages: {
        connect: [{ id: languageIds.common }],
      },
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
      languages: {
        connect: [{ id: languageIds.common }, { id: languageIds.kitsune }],
      },
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
      languages: {
        connect: [{ id: languageIds.common }, { id: languageIds.drow }],
      },
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
      languages: {
        connect: [{ id: languageIds.common }, { id: languageIds.aasimar }],
      },
    },
  ];

  return characters;
};

export const seedLocalCharacters = async (): Promise<{
  characters: Prisma.CharacterUncheckedCreateInput[];
}> => {
  const characters: Prisma.CharacterUncheckedCreateInput[] =
    buildLocalCharacters();
  await prisma.$transaction(
    characters.map((character) =>
      prisma.character.create({
        data: character,
      })
    )
  );

  return { characters };
};
