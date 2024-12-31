import { ArmorCategory, Rarity, Prisma } from "@prisma/client";
import { armorGroupIds } from "../../../src/utils/global-const";
import prisma from "../../../src/integrations/prisma/prisma-client";

export const armorBaseIds = {
  explorerCloth: "cm5acmo8b00008ezug2yx9o9u",
  leatherArmor: "cm5acsike000f0fzu3yf5egh2",
  hideArmor: "cm5acsikf000i0fzu42ogf3kj",
  fullPlate: "cm5acsike000e0fzu5mmg7je9",
};

const buildLocalArmorBases = (): Prisma.ArmorBaseUncheckedCreateInput[] => {
  const armorBase: Prisma.ArmorBaseUncheckedCreateInput[] = [
    {
      id: armorBaseIds.explorerCloth,
      name: "Explorer's Clothing",
      armorClass: 0,
      dexCap: 5,
      checkPenalty: 0,
      speedPenalty: 0,
      strengthReq: 0,
      price: 0.1,
      category: ArmorCategory.Unarmored,
      rarity: Rarity.Common,
      armorGroupId: armorGroupIds.cloth,
      bulk: "L",
    },
    {
      id: armorBaseIds.hideArmor,
      name: "Hide Armor",
      armorClass: 3,
      dexCap: 2,
      checkPenalty: -2,
      speedPenalty: -5,
      strengthReq: 2,
      price: 2,
      category: ArmorCategory.Medium,
      rarity: Rarity.Common,
      armorGroupId: armorGroupIds.leather,
      bulk: "2",
    },
    {
      id: armorBaseIds.leatherArmor,
      name: "Leather Armor",
      armorClass: 1,
      dexCap: 4,
      checkPenalty: -1,
      speedPenalty: 0,
      strengthReq: 0,
      price: 2,
      category: ArmorCategory.Light,
      rarity: Rarity.Common,
      armorGroupId: armorGroupIds.leather,
      bulk: "1",
    },
    {
      id: armorBaseIds.fullPlate,
      name: "Full Plate",
      armorClass: 6,
      dexCap: 0,
      checkPenalty: -3,
      speedPenalty: -10,
      strengthReq: 4,
      price: 30,
      category: ArmorCategory.Medium,
      rarity: Rarity.Common,
      armorGroupId: armorGroupIds.leather,
      bulk: "4",
    },
  ];
  return armorBase;
};

export const seedLocalArmorBase = async (): Promise<{
  armorBases: Prisma.ArmorBaseUncheckedCreateInput[];
}> => {
  const armorBases: Prisma.ArmorBaseUncheckedCreateInput[] =
    buildLocalArmorBases();
  await prisma.$transaction(
    armorBases.map((armorBases) => {
      return prisma.armorBase.create({
        data: armorBases,
      });
    })
  );

  return { armorBases };
};
