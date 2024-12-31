import { Prisma } from "@prisma/client";
import prisma from "../../../src/integrations/prisma/prisma-client";
import { weaponCriticalSpecializationIds } from "./seed-weapon-critical-specialization";
import { weaponGroupIds } from "../../../src/utils/global-const";

const buildLocalWeaponGroup = (): Prisma.WeaponGroupCreateManyInput[] => {
  const weaponGroup: Prisma.WeaponGroupCreateManyInput[] = [
    {
      id: weaponGroupIds.knife,
      name: "Knife",
      weaponCriticalSpecializationId: weaponCriticalSpecializationIds.knife,
    },
    {
      id: weaponGroupIds.flail,
      name: "Flail",
      weaponCriticalSpecializationId: weaponCriticalSpecializationIds.flail,
    },
    {
      id: weaponGroupIds.bow,
      name: "Bow",
      weaponCriticalSpecializationId: weaponCriticalSpecializationIds.bow,
    },
    {
      id: weaponGroupIds.spear,
      name: "Spear",

      weaponCriticalSpecializationId: weaponCriticalSpecializationIds.spear,
    },
    {
      id: weaponGroupIds.axe,
      name: "Axe",
      weaponCriticalSpecializationId: weaponCriticalSpecializationIds.axe,
    },
  ];

  return weaponGroup;
};

export const seedLocalWeaponGroup = async (): Promise<{
  weaponGroups: Prisma.WeaponGroupCreateManyInput[];
}> => {
  const weaponGroups: Prisma.WeaponGroupCreateManyInput[] =
    buildLocalWeaponGroup();
  await prisma.weaponGroup.createMany({
    data: weaponGroups,
  });

  return { weaponGroups };
};
