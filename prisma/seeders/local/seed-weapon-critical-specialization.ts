import { Prisma } from "@prisma/client";
import prisma from "../../../src/integrations/prisma/prisma-client";

export const weaponCriticalSpecializationIds = {
  knife: "cm2ldg3il000ap6zuhz3ccus9",
  flail: "cm2ldg3il000bp6zuav9v53ql",
  bow: "cm2ldg3il000cp6zuhnqcbai3",
  spear: "cm2ldg3il000dp6zuhfy0gih8",
  axe: "cm2ldg3il000ep6zug2exhfn8",
};

const buildLocalWeaponCriticalSpecialization =
  (): Prisma.WeaponCriticalSpecializationCreateManyInput[] => {
    const weaponCriticalSpecializations: Prisma.WeaponCriticalSpecializationCreateManyInput[] =
      [
        {
          id: weaponCriticalSpecializationIds.axe,
          name: "Axe",
          description:
            "Choose one creature adjacent to the initial target and within reach. If its AC is lower than your attack roll result for the critical hit, you deal damage to that creature equal to the result of the weapon damage die you rolled (including extra dice for its striking rune, if any). This amount isn't doubled, and no bonuses or other additional dice apply to this damage.",
        },
        {
          id: weaponCriticalSpecializationIds.flail,
          name: "Flail",
          description:
            "The target is knocked prone unless they succeed at a Reflex save against your class DC.",
        },
        {
          id: weaponCriticalSpecializationIds.bow,
          name: "Bow",
          description:
            "If the target of the critical hit is adjacent to a surface, it gets stuck to that surface by the missile. The target is immobilized and must spend an Interact action to attempt a DC 10 Athletics check to pull the missile free; it can't move from its space until it succeeds. The creature doesn't become stuck if it is incorporeal, is liquid (like a water elemental or some oozes), or could otherwise escape without effort.",
        },
        {
          id: weaponCriticalSpecializationIds.spear,
          name: "Spear",
          description:
            "The weapon pierces the target, weakening its attacks. The target is clumsy 1 until the start of your next turn.",
        },
        {
          id: weaponCriticalSpecializationIds.knife,
          name: "Knife",
          description:
            "The target takes 1d6 persistent bleed damage. You gain an item bonus to this bleed damage equal to the weapon's item bonus to attack rolls.",
        },
      ];
    return weaponCriticalSpecializations;
  };

export const seedLocalWeaponCriticalSpecialization = async (): Promise<{
  weaponCriticalSpecializations: Prisma.WeaponCriticalSpecializationCreateManyInput[];
}> => {
  const weaponCriticalSpecializations: Prisma.WeaponCriticalSpecializationCreateManyInput[] =
    buildLocalWeaponCriticalSpecialization();
  await prisma.weaponCriticalSpecialization.createMany({
    data: weaponCriticalSpecializations,
  });

  return { weaponCriticalSpecializations };
};
