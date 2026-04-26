import { Attribute, Prisma, Rarity } from "@prisma/client";
import prisma from "../../../src/integrations/prisma/prisma-client";
import { skillIds } from "./seed-skill";

export const backgroundIds = {
  acolyte: "cmof95zor0000t6gyhds4ea9v",
  acrobat: "cmof95zot0001t6gygfi0c4yr",
  animalWhisperer: "cmof95zou0002t6gycxwvd7ws",
  artisan: "cmof95zou0003t6gy2v201uqq",
  criminal: "cmof95zou0004t6gy2cz43gxq",
  entertainer: "cmof95zou0005t6gybr298wzq",
  farmhand: "cmof95zou0006t6gyciz78gm7",
  fieldMedic: "cmof95zou0007t6gy0wfa7104",
  hunter: "cmof95zou0008t6gy36fueh43",
  merchant: "cmof95zou0009t6gy46lp9a6t",
  sailor: "cmof95zou000at6gyfzf21obo",
  scholar: "cmof95zov000bt6gy6kfuhzri",
  scout: "cmof95zov000ct6gycesb2vhx",
  warrior: "cmof95zov000dt6gyeesg6k1q",
};

const buildLocalBackgrounds = (): Prisma.BackgroundUncheckedCreateInput[] => [
  {
    id: backgroundIds.acolyte,
    name: "Acolyte",
    description:
      "You spent your early days in a religious community, studying scripture, maintaining holy sites, and performing the ceremonies of your faith.",
    rarity: Rarity.Common,
    attributeBoostOptions: [Attribute.Wisdom, Attribute.Intelligence],
    trainedSkillId: skillIds.religion,
    trainedLoreName: "Scribing Lore",
  },
  {
    id: backgroundIds.acrobat,
    name: "Acrobat",
    description:
      "Working with a traveling acrobatic troupe or as a street performer, you've honed your skills in tumbling, balancing, and feats of dexterity.",
    rarity: Rarity.Common,
    attributeBoostOptions: [Attribute.Strength, Attribute.Dexterity],
    trainedSkillId: skillIds.acrobatics,
    trainedLoreName: "Circus Lore",
  },
  {
    id: backgroundIds.animalWhisperer,
    name: "Animal Whisperer",
    description:
      "You have a connection with animals that goes beyond the ordinary, whether from living in the wild or working closely with them throughout your life.",
    rarity: Rarity.Common,
    attributeBoostOptions: [Attribute.Wisdom, Attribute.Charisma],
    trainedSkillId: skillIds.nature,
    trainedLoreName: "Animal Lore",
  },
  {
    id: backgroundIds.artisan,
    name: "Artisan",
    description:
      "You've spent years crafting goods and refining your skills with a particular craft, working for a guild or independently.",
    rarity: Rarity.Common,
    attributeBoostOptions: [Attribute.Strength, Attribute.Intelligence],
    trainedSkillId: skillIds.crafting,
    trainedLoreName: "Guild Lore",
  },
  {
    id: backgroundIds.criminal,
    name: "Criminal",
    description:
      "As an experienced criminal, you've earned a living through theft, subterfuge, and less savory activities on the wrong side of the law.",
    rarity: Rarity.Common,
    attributeBoostOptions: [Attribute.Dexterity, Attribute.Intelligence],
    trainedSkillId: skillIds.stealth,
    trainedLoreName: "Underworld Lore",
  },
  {
    id: backgroundIds.entertainer,
    name: "Entertainer",
    description:
      "You've worked as a performer — perhaps as a musician, dancer, or actor — giving shows to audiences of all kinds.",
    rarity: Rarity.Common,
    attributeBoostOptions: [Attribute.Dexterity, Attribute.Charisma],
    trainedSkillId: skillIds.performance,
    trainedLoreName: "Theater Lore",
  },
  {
    id: backgroundIds.farmhand,
    name: "Farmhand",
    description:
      "With a strong back and a mind for simple work, you've spent years doing agricultural labor on a farm.",
    rarity: Rarity.Common,
    attributeBoostOptions: [Attribute.Constitution, Attribute.Wisdom],
    trainedSkillId: skillIds.athletics,
    trainedLoreName: "Farming Lore",
  },
  {
    id: backgroundIds.fieldMedic,
    name: "Field Medic",
    description:
      "You patched up the wounded in battles or other dangerous situations, learning to work quickly under stress.",
    rarity: Rarity.Common,
    attributeBoostOptions: [Attribute.Constitution, Attribute.Wisdom],
    trainedSkillId: skillIds.medicine,
    trainedLoreName: "Battle Lore",
  },
  {
    id: backgroundIds.hunter,
    name: "Hunter",
    description:
      "You stalked and hunted game in the wilderness, living off the land and tracking quarry across great distances.",
    rarity: Rarity.Common,
    attributeBoostOptions: [Attribute.Strength, Attribute.Dexterity],
    trainedSkillId: skillIds.survival,
    trainedLoreName: "Terrain Lore",
  },
  {
    id: backgroundIds.merchant,
    name: "Merchant",
    description:
      "You've worked as a merchant, trading goods between cities or operating a shop, developing skills in negotiation and assessment.",
    rarity: Rarity.Common,
    attributeBoostOptions: [Attribute.Intelligence, Attribute.Charisma],
    trainedSkillId: skillIds.diplomacy,
    trainedLoreName: "Mercantile Lore",
  },
  {
    id: backgroundIds.sailor,
    name: "Sailor",
    description:
      "You spent time working on a ship, whether as a deckhand, boatswain, or captain, learning to navigate and handle rough conditions.",
    rarity: Rarity.Common,
    attributeBoostOptions: [Attribute.Strength, Attribute.Constitution],
    trainedSkillId: skillIds.athletics,
    trainedLoreName: "Sailing Lore",
  },
  {
    id: backgroundIds.scholar,
    name: "Scholar",
    description:
      "You've dedicated your life to scholarship, studying arcane or scholarly texts and learning all you can about the mysteries of the world.",
    rarity: Rarity.Common,
    attributeBoostOptions: [Attribute.Intelligence, Attribute.Wisdom],
    trainedSkillId: skillIds.arcana,
    trainedLoreName: "Academia Lore",
  },
  {
    id: backgroundIds.scout,
    name: "Scout",
    description:
      "You've worked as a scout, ranging ahead of groups to gather intelligence and report back on dangers and opportunities.",
    rarity: Rarity.Common,
    attributeBoostOptions: [Attribute.Dexterity, Attribute.Wisdom],
    trainedSkillId: skillIds.survival,
    trainedLoreName: "Scouting Lore",
  },
  {
    id: backgroundIds.warrior,
    name: "Warrior",
    description:
      "You've lived a life of combat, whether as a mercenary, soldier, or brawler, and you're always ready for a fight.",
    rarity: Rarity.Common,
    attributeBoostOptions: [Attribute.Strength, Attribute.Constitution],
    trainedSkillId: skillIds.intimidation,
    trainedLoreName: "Warfare Lore",
  },
];

export const seedLocalBackgrounds = async (): Promise<{
  backgrounds: Prisma.BackgroundUncheckedCreateInput[];
}> => {
  const backgrounds = buildLocalBackgrounds();
  await prisma.$transaction(
    backgrounds.map((background) =>
      prisma.background.create({ data: background })
    )
  );
  return { backgrounds };
};
