import { Prisma, Rarity } from "@prisma/client";
import prisma from "../../../src/integrations/prisma/prisma-client";

export const languageIds = {
  common: "cm5ggxlde000jyazu0cqb64gl",
  orc: "cm5ggxlde000iyazue9u2bb7j",
  kitsune: "cm5ggxlde000hyazuc03ucnh6",
  goblin: "cm5ggxlde000gyazueao25qqu",
  drow: "cm5ggxlde000fyazu101c1yvr",
  aasimar: "cm5ggxldd000eyazuckgfebcl",
};

const buildLocalLanguages = (): Prisma.LanguageUncheckedCreateInput[] => {
  const languages: Prisma.LanguageUncheckedCreateInput[] = [
    {
      id: languageIds.common,
      name: "Common",
      description: "Common Language",
      rarity: Rarity.Common,
    },
    {
      id: languageIds.orc,
      name: "Orc",
      description: "Orc Language",
      rarity: Rarity.Common,
    },
    {
      id: languageIds.kitsune,
      name: "Kitsune",
      description: "Kitsune Language",
      rarity: Rarity.Uncommon,
    },
    {
      id: languageIds.goblin,
      name: "Goblin",
      description: "Goblin Language",
      rarity: Rarity.Common,
    },
    {
      id: languageIds.drow,
      name: "Drow",
      description: "Drow Language",
      rarity: Rarity.Uncommon,
    },
    {
      id: languageIds.aasimar,
      name: "Aasimar",
      description: "Aasimar Language",
      rarity: Rarity.Uncommon,
    },
  ];
  return languages;
};

export const seedLocalLanguages = async (): Promise<{
  languages: Prisma.LanguageUncheckedCreateInput[];
}> => {
  const languages: Prisma.LanguageUncheckedCreateInput[] =
    buildLocalLanguages();
  await prisma.$transaction(
    languages.map((language) => {
      return prisma.language.create({
        data: language,
      });
    })
  );

  return { languages };
};
