import { Prisma } from "@prisma/client";
import prisma from "../../../src/integrations/prisma/prisma-client";
import { weaponCriticalSpecializationIds } from "./seed-weapon-critical-specialization";
import { armorGroupIds, weaponGroupIds } from "../../../src/utils/global-const";

const buildLocalWeaponGroup = (): Prisma.ArmorGroupCreateManyInput[] => {
  const armorGroup: Prisma.ArmorGroupCreateManyInput[] = [
    {
      id: armorGroupIds.cloth,
      name: "Cloth",
      description:
        "Clothing isn't armor, but if it has a Dex cap it can accept fundamental and property runes.",
    },
    {
      id: armorGroupIds.leather,
      name: "Leather",
      description:
        "The thick second skin of the armor disperses blunt force to reduce bludgeoning damage. You gain resistance to bludgeoning damage equal to 1 + the value of the armor’s potency rune for medium armor, or 2 + the value of the armor’s potency rune for heavy armor.",
    },
    {
      id: armorGroupIds.plate,
      name: "Plate",
      description:
        "The sturdy plate provides no purchase for a cutting edge. You gain resistance to slashing damage equal to 1 + the value of the armor’s potency rune for medium armor, or 2 + the value of the armor’s potency rune for heavy armor.",
    },
  ];

  return armorGroup;
};

export const seedLocalArmorGroup = async (): Promise<{
  armorGroups: Prisma.ArmorGroupCreateManyInput[];
}> => {
  const armorGroups: Prisma.ArmorGroupCreateManyInput[] =
    buildLocalWeaponGroup();
  await prisma.armorGroup.createMany({
    data: armorGroups,
  });

  return { armorGroups };
};
