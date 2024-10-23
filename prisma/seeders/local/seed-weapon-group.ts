import { Prisma } from "@prisma/client";
import prisma from "../../../src/integrations/prisma/prisma-client";
import { weaponCriticalSpecializationIds } from "./seed-weapon-critical-specialization";

export const weaponGroupIds = {
  knife: "cm2ldg3im000jp6zu3lxuc2yb",
  flail: "cm2ldg3im000ip6zu440c6omu",
  bow: "cm2ldg3im000hp6zuhppi46cs",
  spear: "cm2ldg3im000gp6zuas0xcxwp",
  axe: "cm2ldg3im000fp6zu0pcb84k8",
};

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
  weaponGroup: Prisma.WeaponGroupCreateManyInput[];
}> => {
  const weaponGroup: Prisma.WeaponGroupCreateManyInput[] =
    buildLocalWeaponGroup();
  await prisma.weaponGroup.createMany({
    data: weaponGroup,
  });

  return { weaponGroup };
};
