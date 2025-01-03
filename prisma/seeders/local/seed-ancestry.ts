import { Prisma, AncestrySize, Attribute, Rarity } from "@prisma/client";
import prisma from "../../../src/integrations/prisma/prisma-client";
import { languageIds } from "./seed-languages";

export const ancestryIds = {
  human: "cm5g06qx50000k7zu71750cuj",
  orc: "cm5g06qx60001k7zu4pt0cfic",
  kitsune: "cm5g06qx60002k7zuc7fa7xc3",
  goblin: "cm5g06qx70004k7zubscv216e",
  drow: "cm5g06qx70005k7zuevsa6z2s",
  aasimar: "cm5g06qx70006k7zu2roe2p0d",
};

const buildLocalAncestry = (): Prisma.AncestryUncheckedCreateInput[] => {
  const ancestries: Prisma.AncestryUncheckedCreateInput[] = [
    {
      id: ancestryIds.human,
      name: "Human",
      hitPoints: 8,
      size: AncestrySize.Medium,
      speed: 25,
      attributeBoost: [Attribute.Dexterity, Attribute.Constitution],
      description: "Human Race",
      rarity: Rarity.Common,
      languages: {
        connect: [{ id: languageIds.common }],
      },
    },
    {
      id: ancestryIds.orc,
      name: "Orc",
      hitPoints: 10,
      size: AncestrySize.Medium,
      speed: 25,
      attributeBoost: [Attribute.Dexterity, Attribute.Constitution],
      description: "Orc Race",
      rarity: Rarity.Common,
      languages: {
        connect: [{ id: languageIds.common }, { id: languageIds.orc }],
      },
    },
    {
      id: ancestryIds.kitsune,
      name: "Kitsune",
      hitPoints: 8,
      size: AncestrySize.Medium,
      speed: 25,
      attributeBoost: [Attribute.Dexterity, Attribute.Constitution],
      description: "Kitsune Race",
      rarity: Rarity.Common,
      languages: {
        connect: [{ id: languageIds.common }, { id: languageIds.kitsune }],
      },
    },
    {
      id: ancestryIds.drow,
      name: "Drow",
      hitPoints: 10,
      size: AncestrySize.Medium,
      speed: 25,
      attributeBoost: [Attribute.Dexterity, Attribute.Constitution],
      description: "Drow Race",
      rarity: Rarity.Common,
      languages: {
        connect: [{ id: languageIds.common }, { id: languageIds.drow }],
      },
    },

    {
      id: ancestryIds.aasimar,
      name: "Aasimar",
      hitPoints: 10,
      size: AncestrySize.Medium,
      speed: 25,
      attributeBoost: [Attribute.Dexterity, Attribute.Constitution],
      description: "Aasimar Race",
      rarity: Rarity.Common,
      languages: {
        connect: [{ id: languageIds.common }, { id: languageIds.aasimar }],
      },
    },
  ];
  return ancestries;
};

export const seedLocalAncestries = async (): Promise<{
  ancestries: Prisma.AncestryUncheckedCreateInput[];
}> => {
  const ancestries: Prisma.AncestryUncheckedCreateInput[] =
    buildLocalAncestry();
  await prisma.$transaction(
    ancestries.map((ancestry) => {
      return prisma.ancestry.create({
        data: ancestry,
      });
    })
  );

  return { ancestries };
};
