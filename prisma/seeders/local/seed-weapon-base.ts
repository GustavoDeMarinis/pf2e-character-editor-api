import {
  Prisma,
  WeaponCategory,
  WeaponDamageType,
  WeaponHands,
} from "@prisma/client";
import prisma from "../../../src/integrations/prisma/prisma-client";
import { traitIds, weaponGroupIds } from "../../../src/utils/global-const";

export const weaponBaseIds = {
  dagger: "cm2igysu200009fzuciaaa2fj",
  longspear: "cm2igysu200019fzufncd0b0n",
  battleAxe: "cm2igysu200029fzu80kz6v8z",
  longbow: "cm2igysu200039fzu3uen27y0",
  whip: "cm2igysu200049fzubes71oov",
};

const buildLocalWeaponBases = (): Prisma.WeaponBaseUncheckedCreateInput[] => {
  const weaponBases: Prisma.WeaponBaseUncheckedCreateInput[] = [
    {
      id: weaponBaseIds.dagger,
      name: "Dagger",
      description:
        "This small, bladed weapon is held in one hand and used to stab a creature in close combat. It can also be thrown.",
      category: WeaponCategory.Simple,
      damageTypes: [WeaponDamageType.Piercing],
      diceAmount: 1,
      diceSize: 4,
      criticalDiceAmount: null,
      criticalDiceSize: null,
      weaponGroupId: weaponGroupIds.knife,
      traits: {
        connect: [
          { id: traitIds.agile },
          { id: traitIds.finesse },
          { id: traitIds.versatileSlashing },
        ],
      },
      hands: [WeaponHands.One],
      range: null,
      bulk: "L",
    },
    {
      id: weaponBaseIds.longspear,
      name: "Longspear",
      description:
        "This very long spear, sometimes called a pike, is purely for thrusting rather than throwing. Used by many soldiers and city watch for crowd control and defense against charging enemies, it must be wielded with two hands.",
      category: WeaponCategory.Simple,
      damageTypes: [WeaponDamageType.Piercing],
      diceAmount: 1,
      diceSize: 8,
      criticalDiceAmount: null,
      criticalDiceSize: null,
      weaponGroupId: weaponGroupIds.spear,
      traits: {
        connect: [{ id: traitIds.reach }],
      },
      hands: [WeaponHands.Two],
      range: null,
      bulk: "2",
    },
    {
      id: weaponBaseIds.battleAxe,
      name: "Battle Axe",
      description:
        "This very long spear, sometimes called a pike, is purely for thrusting rather than throwing. Used by many soldiers and city watch for crowd control and defense against charging enemies, it must be wielded with two hands.",
      category: WeaponCategory.Simple,
      damageTypes: [WeaponDamageType.Slashing],
      diceAmount: 1,
      diceSize: 8,
      criticalDiceAmount: null,
      criticalDiceSize: null,
      weaponGroupId: weaponGroupIds.axe,
      traits: {
        connect: [{ id: traitIds.sweep }],
      },
      hands: [WeaponHands.One],
      range: null,
      bulk: "2",
    },
    {
      id: weaponBaseIds.longbow,
      name: "Longbow",
      description:
        "This 5-foot-tall bow, usually made of a single piece of elm, hickory, or yew, has a powerful draw and is excellent at propelling arrows with great force and at an extreme distance. You must use two hands to fire a longbow, and it can't be used while mounted.",
      category: WeaponCategory.Simple,
      damageTypes: [WeaponDamageType.Piercing],
      diceAmount: 1,
      diceSize: 8,
      criticalDiceAmount: null,
      criticalDiceSize: null,
      weaponGroupId: weaponGroupIds.bow,
      traits: {
        connect: [],
      },
      hands: [WeaponHands.One],
      range: null,
      bulk: "2",
    },
    {
      id: weaponBaseIds.whip,
      name: "Whip",
      description:
        "This long strand of thick leather, often braided, delivers a painful but nonlethal slash at a distance, usually accompanied by a distinctive cracking sound.",
      category: WeaponCategory.Martial,
      diceAmount: 1,
      diceSize: 4,
      criticalDiceAmount: null,
      criticalDiceSize: null,
      weaponGroupId: weaponGroupIds.flail,
      traits: {
        connect: [
          { id: traitIds.disarm },
          { id: traitIds.finesse },
          { id: traitIds.nonlethal },
          { id: traitIds.reach },
          { id: traitIds.trip },
        ],
      },
      hands: [WeaponHands.One],
      range: null,
      bulk: "1",
    },
  ];

  return weaponBases;
};

export const seedLocalWeaponBase = async (): Promise<{
  weaponBases: Prisma.WeaponBaseUncheckedCreateInput[];
}> => {
  const weaponBases: Prisma.WeaponBaseUncheckedCreateInput[] =
    buildLocalWeaponBases();
  await prisma.$transaction(
    weaponBases.map((weaponBase) => {
      return prisma.weaponBase.create({
        data: weaponBase,
      });
    })
  );

  return { weaponBases };
};
