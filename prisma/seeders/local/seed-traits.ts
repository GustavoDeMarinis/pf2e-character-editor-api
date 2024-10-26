import { Prisma } from "@prisma/client";
import prisma from "../../../src/integrations/prisma/prisma-client";
import { traitIds } from "../../../src/utils/global-const";

const buildLocalTraits = (): Prisma.TraitUncheckedCreateInput[] => {
  const traits: Prisma.TraitUncheckedCreateInput[] = [
    {
      id: traitIds.agile,
      name: "Agile",
      description:
        "The multiple attack penalty you take with this weapon on the second attack on your turn is –4 instead of –5, and –8 instead of –10 on the third and subsequent attacks in the turn.",
    },
    {
      id: traitIds.finesse,
      name: "Finesse",
      description:
        "You can use your Dexterity modifier instead of your Strength modifier on attack rolls using this melee weapon. You still calculate damage using Strength.",
    },
    {
      id: traitIds.versatileSlashing,
      name: "Versatile (Slashing)",
      description:
        "A versatile weapon can be used to deal a different type of damage than its listed type. This trait indicates the alternate damage type. For instance, a piercing weapon with versatile S can deal piercing or slashing damage. You choose the damage type each time you attack.",
    },
    {
      id: traitIds.reach,
      name: "Reach",
      description:
        "This weapon can be used to attack enemies up to 10 feet away instead of only adjacent enemies. For creatures with reach, the weapon increases their reach by 5 feet.",
    },
    {
      id: traitIds.sweep,
      name: "Sweep",
      description:
        "This weapon makes wide swinging attacks. When you attack with this weapon, you gain a +1 circumstance bonus to your attack roll if you already attempted to attack a different target this turn using this weapon.",
    },
    {
      id: traitIds.disarm,
      name: "Disarm",
      description:
        "You can use this weapon to Disarm with the Athletics skill even if you don’t have a free hand. This uses the weapon’s reach (if different from your own) and adds the weapon’s item bonus to attack rolls (if any) as an item bonus to the Athletics check. If you critically fail a check to Disarm using the weapon, you can drop the weapon to take the effects of a failure instead of a critical failure. On a critical success, you still need a free hand if you want to take the item.",
    },
    {
      id: traitIds.nonlethal,
      name: "Non Lethal",
      description:
        "Attacks with this weapon are nonlethal (page 407), and are used to knock creatures unconscious instead of kill them. You can use a nonlethal weapon to make a lethal attack with a –2 circumstance penalty.",
    },
    {
      id: traitIds.trip,
      name: "Trip",
      description:
        "You can use this weapon to Trip with the Athletics skill even if you don’t have a free hand. This uses the weapon’s reach (if different from your own) and adds the weapon’s item bonus to attack rolls as an item bonus to the Athletics check. If you critically fail a check to Trip using the weapon, you can drop the weapon to take the effects of a failure instead of a critical failure.",
    },
  ];

  return traits;
};

export const seedLocalTraits = async (): Promise<{
  traits: Prisma.TraitCreateManyInput[];
}> => {
  const traits: Prisma.TraitCreateManyInput[] = buildLocalTraits();
  await prisma.trait.createMany({
    data: traits,
  });

  return { traits };
};
