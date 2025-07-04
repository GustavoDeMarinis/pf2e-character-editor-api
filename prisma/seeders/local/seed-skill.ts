import { Prisma, Attribute } from "@prisma/client";
import prisma from "../../../src/integrations/prisma/prisma-client";

export const skillIds = {
  acrobatics: "cm8w1aghf000er0gy1ebj939f",
  arcana: "cm8w1aghf000dr0gy37a9fvfa",
  athletics: "cm8w1aghf000cr0gy6qf0bjmr",
  crafting: "cm8w1aghf000br0gycu7v2xt5",
  deception: "cm8w1aghf000ar0gyen6mgj6w",
  diplomacy: "cm8w1aghe0009r0gy82n481mk",
  intimidation: "cm8w1aghe0008r0gy8i27drw6",
  medicine: "cm8w1aghe0007r0gyfi32e22j",
  nature: "cm8w1aghe0006r0gyh9wfdc06",
  occultism: "cm8w1aghe0005r0gyhdvf481z",
  performance: "cm8w1aghe0004r0gyfmdr0cxf",
  religion: "cm8w1aghe0003r0gy31z5gmz0",
  society: "cm8w1aghe0002r0gyhnp5gwdg",
  stealth: "cm8w1aghe0001r0gy3l9adecc",
  survival: "cm8w1aghe0000r0gy31oxfdfu",
  thievery: "cm8w1czo50009bugyavtmcc2e",
  lore: "cm8w6lfg9000bbqgyf93zh5pa",
};

const buildLocalSkills = (): Prisma.SkillUncheckedCreateInput[] => {
  const skills: Prisma.SkillUncheckedCreateInput[] = [
    {
      id: skillIds.acrobatics,
      name: "Acrobatics",
      associatedAttribute: Attribute.Dexterity,
      description:
        "Athletics allows you to perform deeds of physical prowess. Most Athletics actions let you move about the environment (Climb, High Jump, Long Jump, Swim) or control your opponent's movement in combat (Grapple, Reposition, Shove, Trip, and Disarm). Escape: When you use the Escape basic action, you can use your Athletics modifier instead of your unarmed attack modifier.",
    },
    {
      id: skillIds.arcana,
      name: "Arcana",
      associatedAttribute: Attribute.Intelligence,
      description:
        "Arcana measures how much you know about arcane magic and creatures.",
    },
    {
      id: skillIds.athletics,
      name: "Athletics",
      associatedAttribute: Attribute.Strength,
      description:
        "Athletics allows you to perform deeds of physical prowess. Most Athletics actions let you move about the environment (Climb, High Jump, Long Jump, Swim) or control your opponent's movement in combat (Grapple, Reposition, Shove, Trip, and Disarm). Escape: When you use the Escape basic action, you can use your Athletics modifier instead of your unarmed attack modifier.",
    },
    {
      id: skillIds.crafting,
      name: "Crafting",
      associatedAttribute: Attribute.Intelligence,
      description:
        "Crafting measures how well you can create objects from raw materials.",
    },
    {
      id: skillIds.deception,
      name: "Deception",
      associatedAttribute: Attribute.Charisma,
      description:
        "Deception measures your ability to lie convincingly and otherwise mislead others.",
    },
    {
      id: skillIds.diplomacy,
      name: "Diplomacy",
      associatedAttribute: Attribute.Charisma,
      description:
        "Diplomacy measures your ability to persuade others and to elicit useful information from them.",
    },
    {
      id: skillIds.intimidation,
      name: "Intimidation",
      associatedAttribute: Attribute.Charisma,
      description:
        "Intimidation measures your ability to coerce others through hostile actions, overt threats, and deadly force.",
    },
    {
      id: skillIds.medicine,
      name: "Medicine",
      associatedAttribute: Attribute.Wisdom,
      description:
        "Medicine measures your ability to treat wounds and diseases, understand the body, and diagnose illnesses.",
    },
    {
      id: skillIds.nature,
      name: "Nature",
      associatedAttribute: Attribute.Wisdom,
      description:
        "Nature measures your knowledge of the natural world, including plants, animals, weather, and geography.",
    },
    {
      id: skillIds.occultism,
      name: "Occultism",
      associatedAttribute: Attribute.Intelligence,
      description:
        "Occultism measures your knowledge of eldritch and supernatural lore.",
    },
    {
      id: skillIds.performance,
      name: "Performance",
      associatedAttribute: Attribute.Charisma,
      description:
        "Performance measures your ability to entertain and inspire others through acting, music, dance, or storytelling.",
    },
    {
      id: skillIds.religion,
      name: "Religion",
      associatedAttribute: Attribute.Wisdom,
      description:
        "Religion measures your knowledge of deities, religious traditions, and the doctrines of the faith.",
    },
    {
      id: skillIds.society,
      name: "Society",
      associatedAttribute: Attribute.Intelligence,
      description:
        "Society measures your knowledge of the world's societies, cultures, and social mores.",
    },
    {
      id: skillIds.stealth,
      name: "Stealth",
      associatedAttribute: Attribute.Dexterity,
      description:
        "Stealth measures your ability to avoid detection, allowing you to slip past foes or strike from an unseen position.",
    },
    {
      id: skillIds.survival,
      name: "Survival",
      associatedAttribute: Attribute.Wisdom,
      description:
        "Survival measures your ability to endure in the wild, find sustenance, and track creatures.",
    },
    {
      id: skillIds.thievery,
      name: "Thievery",
      associatedAttribute: Attribute.Dexterity,
      description:
        "Thievery measures your ability to pick locks, disarm traps, and perform other acts of larceny.",
    },
    {
      id: skillIds.lore,
      name: "Lore",
      associatedAttribute: Attribute.Intelligence,
      description:
        "Lore measures your knowledge of a particular field, such as Arcana, Nature, Occultism, or Religion.",
    },
  ];
  return skills;
};

export const seedLocalSkills = async (): Promise<{
  skills: Prisma.SkillUncheckedCreateInput[];
}> => {
  const skills: Prisma.SkillUncheckedCreateInput[] = buildLocalSkills();
  await prisma.$transaction(
    skills.map((skill) => {
      return prisma.skill.create({
        data: skill,
      });
    })
  );

  return { skills };
};
