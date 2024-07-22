import { Attributes, Prisma } from "@prisma/client";
import prisma from "../../../src/integrations/prisma/prisma-client";

export const ClassIds = {
  alchemist: "clyxiiakv000j9qzu3mpz3kxj",
  barbarian: "clyxiiakv000i9qzudcmb4c1z",
  bard: "clyxiiakv000h9qzu0f0jdm0k",
  champion: "clyxiiakv000g9qzu3rgi86to",
  cleric: "clyxiiakv000f9qzua3ds3n0d",
  druid: "clyxiiakv000e9qzufedn9xa7",
  fighter: "clyxiiakv000d9qzu9zp98sda",
  investigator: "clyxiiakv000c9qzub4e32dkm",
  kinetecist: "clyxiiakv000b9qzu7s1ufqbq",
  magus: "clyxiiakv000a9qzu3zfvdemp",
  monk: "clyxiiakv00099qzu578wd39n",
  oracle: "clyxiiakv00089qzueuw33syh",
  psychic: "clyxiiakv00079qzu374hhq9h",
  ranger: "clyxiiakv00069qzu2f6h54k8",
  rogue: "clyxiiaku00059qzu8cuwbmn6",
  sorcerer: "clyxiiaku00049qzuguoggdcz",
  summoner: "clyxiiaku00039qzucy85grzd",
  swashbuckler: "clyxiiaku00029qzu2634etzj",
  thaumaturge: "clyxiiaku00019qzu6v6l2qqo",
  witch: "clyxiiakt00009qzubtqc5ze4",
  wizard: "clyxjmw4m000215zubs4ud8rh",
  gunslinger: "clyxjmw4m000115zu2buv1etk",
  inventor: "clyxjmw4l000015zudy1n860s",
};
const buildLocalCharacterClass = async (): Promise<
  Prisma.CharacterClassUncheckedCreateInput[]
> => {
  const characterClasses: Prisma.CharacterClassUncheckedCreateInput[] = [
    {
      id: ClassIds.alchemist,
      className: "Alchemist",
      description: "",
      hitPoints: 8,
      keyAttributes: [Attributes.Intelligence],
    },
    {
      id: ClassIds.barbarian,
      className: "Barbarian",
      description: "",
      hitPoints: 12,
      keyAttributes: [Attributes.Strength],
    },
    {
      id: ClassIds.bard,
      className: "Bard",
      description: "",
      hitPoints: 8,
      keyAttributes: [Attributes.Charisma],
    },
    {
      id: ClassIds.champion,
      className: "Champion",
      description: "",
      hitPoints: 10,
      keyAttributes: [Attributes.Strength, Attributes.Dexterity],
    },
    {
      id: ClassIds.cleric,
      className: "Cleric",
      description: "",
      hitPoints: 8,
      keyAttributes: [Attributes.Wisdom],
    },
    {
      id: ClassIds.druid,
      className: "Druid",
      description: "",
      hitPoints: 8,
      keyAttributes: [Attributes.Wisdom],
    },
    {
      id: ClassIds.fighter,
      className: "Fighter",
      description: "",
      hitPoints: 10,
      keyAttributes: [Attributes.Strength, Attributes.Dexterity],
    },
    {
      id: ClassIds.gunslinger,
      className: "Gunslinger",
      description: "",
      hitPoints: 8,
      keyAttributes: [Attributes.Dexterity],
    },
    {
      id: ClassIds.inventor,
      className: "Inventor",
      description: "",
      hitPoints: 8,
      keyAttributes: [Attributes.Intelligence],
    },
    {
      id: ClassIds.investigator,
      className: "Investigator",
      description: "",
      hitPoints: 8,
      keyAttributes: [Attributes.Intelligence],
    },
    {
      id: ClassIds.kinetecist,
      className: "Kinetecist",
      description: "",
      hitPoints: 8,
      keyAttributes: [Attributes.Constitution],
    },
    {
      id: ClassIds.magus,
      className: "Magus",
      description: "",
      hitPoints: 8,
      keyAttributes: [Attributes.Strength, Attributes.Dexterity],
    },
    {
      id: ClassIds.monk,
      className: "Monk",
      description: "",
      hitPoints: 10,
      keyAttributes: [Attributes.Strength, Attributes.Dexterity],
    },
    {
      id: ClassIds.oracle,
      className: "Oracle",
      description: "",
      hitPoints: 8,
      keyAttributes: [Attributes.Charisma],
    },
    {
      id: ClassIds.psychic,
      className: "Psychic",
      description: "",
      hitPoints: 6,
      keyAttributes: [Attributes.Intelligence, Attributes.Charisma],
    },
    {
      id: ClassIds.ranger,
      className: "Ranger",
      description: "",
      hitPoints: 10,
      keyAttributes: [Attributes.Strength, Attributes.Dexterity],
    },
    {
      id: ClassIds.rogue,
      className: "Rogue",
      description: "",
      hitPoints: 8,
      keyAttributes: [Attributes.Dexterity, Attributes.Other],
    },
    {
      id: ClassIds.sorcerer,
      className: "Sorcerer",
      description: "",
      hitPoints: 6,
      keyAttributes: [Attributes.Charisma],
    },
    {
      id: ClassIds.summoner,
      className: "Summoner",
      description: "",
      hitPoints: 10,
      keyAttributes: [Attributes.Charisma],
    },
    {
      id: ClassIds.swashbuckler,
      className: "Swashbuckler",
      description: "",
      hitPoints: 10,
      keyAttributes: [Attributes.Dexterity],
    },
    {
      id: ClassIds.thaumaturge,
      className: "Thaumaturge",
      description: "",
      hitPoints: 8,
      keyAttributes: [Attributes.Charisma],
    },
    {
      id: ClassIds.witch,
      className: "Witch",
      description: "",
      hitPoints: 6,
      keyAttributes: [Attributes.Intelligence],
    },
    {
      id: ClassIds.wizard,
      className: "Wizard",
      description: "",
      hitPoints: 6,
      keyAttributes: [Attributes.Intelligence],
    },
  ];

  return characterClasses;
};

export const seedLocalCharacterClass = async (): Promise<{
  characterClasses: Prisma.CharacterClassCreateManyInput[];
}> => {
  const characterClasses: Prisma.CharacterClassCreateManyInput[] =
    await buildLocalCharacterClass();
  await prisma.characterClass.createMany({
    data: characterClasses,
  });

  return { characterClasses };
};
