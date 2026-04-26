import { Prisma, Rarity } from "@prisma/client";
import prisma from "../../../src/integrations/prisma/prisma-client";
import { ancestryIds } from "./seed-ancestry";

export const heritageIds = {
  // Human
  humanSkilled: "cm9h01aaa0000k7zu1a2b3c4d",
  humanVersatile: "cm9h01aaa0001k7zu1a2b3c4e",
  // Dwarf
  dwarfAncientBlooded: "cm9h01aaa0002k7zu1a2b3c4f",
  dwarfRock: "cm9h01aaa0003k7zu1a2b3c4g",
  dwarfStrongBlooded: "cm9h01aaa0004k7zu1a2b3c4h",
  // Goblin
  goblinCharhide: "cm9h01aaa0005k7zu1a2b3c4i",
  goblinIrongut: "cm9h01aaa0006k7zu1a2b3c4j",
  goblinUnbreakable: "cm9h01aaa0007k7zu1a2b3c4k",
};

const buildLocalHeritages = (): Prisma.HeritageUncheckedCreateInput[] => [
  // Human heritages
  {
    id: heritageIds.humanSkilled,
    name: "Skilled Heritage",
    description:
      "Your ingenuity allows you to train in a wide variety of skills. You become trained in one additional skill of your choice.",
    ancestryId: ancestryIds.human,
    rarity: Rarity.Common,
  },
  {
    id: heritageIds.humanVersatile,
    name: "Versatile Heritage",
    description:
      "Humanity's adaptability manifests in your ability to pursue multiple paths. You gain a general feat of your choice for which you meet the prerequisites.",
    ancestryId: ancestryIds.human,
    rarity: Rarity.Common,
  },
  // Goblin heritages
  {
    id: heritageIds.goblinCharhide,
    name: "Charhide Goblin",
    description:
      "Your ancestors have always had a connection to fire and a thicker skin, which allows you to resist burning. You gain fire resistance equal to half your level (minimum 1).",
    ancestryId: ancestryIds.goblin,
    rarity: Rarity.Common,
  },
  {
    id: heritageIds.goblinIrongut,
    name: "Irongut Goblin",
    description:
      "You can subsist on food that would turn the stomachs of others. You can eat and drink things when you are sickened.",
    ancestryId: ancestryIds.goblin,
    rarity: Rarity.Common,
  },
  {
    id: heritageIds.goblinUnbreakable,
    name: "Unbreakable Goblin",
    description:
      "You're able to bounce back from injuries that would be lethal to others. You have 10 Hit Points from your ancestry instead of 6.",
    ancestryId: ancestryIds.goblin,
    rarity: Rarity.Common,
  },
];

export const seedLocalHeritages = async (): Promise<{
  heritages: Prisma.HeritageUncheckedCreateInput[];
}> => {
  const heritages = buildLocalHeritages();
  await prisma.$transaction(
    heritages.map((heritage) =>
      prisma.heritage.create({ data: heritage })
    )
  );
  return { heritages };
};
