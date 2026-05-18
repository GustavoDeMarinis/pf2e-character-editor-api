import { Prisma, Rarity } from "@prisma/client";
import prisma from "../../../src/integrations/prisma/prisma-client";
import { skillIds } from "./seed-skill";

export const ritualIds = {
  resurrect: "cmpafdhaw0000rugy0it83dxu",
  atone: "cmpafdhaw0001rugy3xzz07w6",
  commune: "cmpafdhaw0002rugyffua2kmb",
  plantGrowth: "cmpafdhaw0003rugyavq25cfq",
  awakenAnimal: "cmpafdhaw0004rugybughe97o",
  consecrate: "cmpafdhaw0005rugy7fqj2sqi",
  readOmens: "cmpafdhaw0006rugy97t610s7",
  createUndead: "cmpafdhaw0007rugy6z9cdh0a",
};

export const ritualHeighteningIds = {
  resurrectFixedRank10: "cmpafdhaw0008rugy3jqmhley",
};

const buildLocalRituals = (): Prisma.RitualUncheckedCreateInput[] => [
  {
    // rank 10, has cost, secondaryCasters > 0, has secondaryCheckSkills, has heightening
    id: ritualIds.resurrect,
    name: "Resurrect",
    description:
      "You attempt to call back a creature's soul and restore its body. The ritual requires a body; you can't use it on a creature that has been completely destroyed. The primary caster must know the target personally.",
    rank: 10,
    rarity: Rarity.Common,
    castTime: "1 day",
    cost: "Diamonds worth 75 gp × the target's level",
    primaryCheck: "Religion (legendary)",
    secondaryCasters: 2,
    secondaryCheckSkills: {
      connect: [{ id: skillIds.medicine }, { id: skillIds.society }],
    },
    range: "10 feet",
    targets: "1 dead creature",
    duration: null,
    criticalSuccess:
      "The target returns to life with full Hit Points and no ill effects from being dead.",
    success:
      "The target returns to life with 1 Hit Point and is drained 2 until it receives a full night's rest.",
    failure: "The ritual fails; the target remains dead.",
    criticalFailure:
      "The target's soul is destroyed; the target cannot be restored to life by any means short of a deity's direct intervention.",
    traits: { connect: [] },
    heightenings: {
      create: [
        {
          id: ritualHeighteningIds.resurrectFixedRank10,
          fixedRank: 10,
          effect:
            "You can resurrect a creature that has been dead for up to 1 century, regardless of how long ago the creature died.",
        },
      ],
    },
  },
  {
    // rank 5, has cost, has secondaryCheckSkills
    id: ritualIds.atone,
    name: "Atone",
    description:
      "You appeal to your deity to absolve a creature of a transgression. The ritual requires the target to be present and willing, and it must sincerely repent of the transgression.",
    rank: 5,
    rarity: Rarity.Common,
    castTime: "1 day",
    cost: "Incense and offerings worth 100 gp",
    primaryCheck: "Religion (master)",
    secondaryCasters: 0,
    secondaryCheckSkills: {
      connect: [{ id: skillIds.diplomacy }],
    },
    range: null,
    targets: "1 willing creature",
    duration: null,
    criticalSuccess:
      "The target is absolved of the transgression; all related penalties and restrictions end immediately.",
    success:
      "The target receives absolution and gains a +2 status bonus to checks related to the atonement for 1 week.",
    failure:
      "The ritual fails; the target's penalties and restrictions persist.",
    criticalFailure:
      "The ritual backlashes; the primary caster is sickened 2 for 1 week.",
    traits: { connect: [] },
    heightenings: { create: [] },
  },
  {
    // rank 6, mid-rank, no cost
    id: ritualIds.commune,
    name: "Commune",
    description:
      "You call upon your deity or a powerful entity to answer questions. You can ask up to three yes-or-no questions, or one open-ended question. The entity is not compelled to answer truthfully, but deities generally do so.",
    rank: 6,
    rarity: Rarity.Uncommon,
    castTime: "1 hour",
    cost: null,
    primaryCheck: "Religion (master)",
    secondaryCasters: 0,
    secondaryCheckSkills: { connect: [] },
    range: null,
    targets: null,
    duration: "up to 10 minutes",
    criticalSuccess:
      "You commune with the entity and receive answers to up to 6 questions.",
    success: "You receive truthful answers to up to 3 questions.",
    failure: "The entity does not respond; you receive no information.",
    criticalFailure:
      "The entity responds with deliberately misleading information.",
    traits: { connect: [] },
    heightenings: { create: [] },
  },
  {
    // rank 3, low-rank, no cost, no secondaryCasters
    id: ritualIds.plantGrowth,
    name: "Plant Growth",
    description:
      "You accelerate the growth of plants in a wide area, causing them to grow rapidly. This ritual is commonly used to improve farmland or create barriers of vegetation.",
    rank: 3,
    rarity: Rarity.Common,
    castTime: "1 hour",
    cost: null,
    primaryCheck: "Nature (expert)",
    secondaryCasters: 0,
    secondaryCheckSkills: { connect: [] },
    range: "1/4 mile",
    targets: null,
    duration: "unlimited",
    criticalSuccess:
      "All plants in the area undergo spectacular growth for one growing season, doubling yields for farmland.",
    success:
      "Plants in the area grow as if a full season has passed, increasing farmland yield by 50%.",
    failure: "The ritual fails; nothing happens.",
    criticalFailure:
      "The plants in the area wither and die, destroying crops for the season.",
    traits: { connect: [] },
    heightenings: { create: [] },
  },
  {
    // rank 6, Uncommon, has cost, has secondaryCasters
    id: ritualIds.awakenAnimal,
    name: "Awaken Animal",
    description:
      "You grant an animal sapience, transforming it into a creature with human-level intelligence. The animal retains its physical form but gains the ability to speak, reason, and learn. An awakened animal generally feels friendly toward the primary caster.",
    rank: 6,
    rarity: Rarity.Uncommon,
    castTime: "1 day",
    cost: "Offerings worth 2 gp × the animal's level",
    primaryCheck: "Nature (master)",
    secondaryCasters: 1,
    secondaryCheckSkills: {
      connect: [{ id: skillIds.society }],
    },
    range: null,
    targets: "1 animal",
    duration: null,
    criticalSuccess:
      "The animal awakens with full sapience and becomes permanently intelligent.",
    success:
      "The animal awakens but with reduced cognition; it is permanently intelligent but with a –2 penalty to Intelligence-based checks.",
    failure: "The ritual fails; the animal is unaffected.",
    criticalFailure:
      "The ritual misfires; the animal is permanently maddened and becomes hostile.",
    traits: { connect: [] },
    heightenings: { create: [] },
  },
  {
    // rank 1, low-rank, has cost, has secondaryCasters
    id: ritualIds.consecrate,
    name: "Consecrate",
    description:
      "You sanctify an area to your deity, driving out unholy influences and warding the ground against desecration. The ritual must be performed on ground that has not been desecrated within the past week.",
    rank: 1,
    rarity: Rarity.Common,
    castTime: "1 day",
    cost: "Offerings worth at least 20 gp",
    primaryCheck: "Religion (trained)",
    secondaryCasters: 1,
    secondaryCheckSkills: {
      connect: [{ id: skillIds.religion }],
    },
    range: null,
    targets: null,
    duration: "1 year",
    criticalSuccess:
      "The area becomes sanctified to your deity; undead and fiends are weakened within the zone.",
    success:
      "The area is consecrated for 1 year; servants of your deity feel at ease within.",
    failure:
      "The ritual fails; offerings are consumed but the area is not consecrated.",
    criticalFailure:
      "The ritual is rejected; the area is briefly desecrated and offerings are lost.",
    traits: { connect: [] },
    heightenings: { create: [] },
  },
  {
    // rank 4, Uncommon, no cost, no secondaryCasters
    id: ritualIds.readOmens,
    name: "Read Omens",
    description:
      "You peer into the future to gain guidance about a specific upcoming event or course of action. The omen is always cryptic and open to interpretation; it never reveals precise outcomes.",
    rank: 4,
    rarity: Rarity.Uncommon,
    castTime: "1 hour",
    cost: null,
    primaryCheck: "Occultism (expert)",
    secondaryCasters: 0,
    secondaryCheckSkills: { connect: [] },
    range: null,
    targets: null,
    duration: null,
    criticalSuccess:
      "You receive a detailed and accurate omen about the specific event, granting a +2 circumstance bonus to related checks for 1 day.",
    success: "You receive a vague but genuine omen about the future.",
    failure: "You receive no omen; the future is obscured.",
    criticalFailure:
      "You receive a misleading omen that points in the wrong direction.",
    traits: { connect: [] },
    heightenings: { create: [] },
  },
  {
    // rank 2, Uncommon, has cost, no secondaryCasters
    id: ritualIds.createUndead,
    name: "Create Undead",
    description:
      "You animate a corpse, binding its soul fragment to create an undead servant. The resulting undead obeys simple commands from the primary caster. The ritual requires a fresh corpse no older than 1 week.",
    rank: 2,
    rarity: Rarity.Uncommon,
    castTime: "1 day",
    cost: "Black onyx gems worth 75 gp × the undead's level",
    primaryCheck: "Arcana (expert) or Religion (expert)",
    secondaryCasters: 0,
    secondaryCheckSkills: { connect: [] },
    range: "10 feet",
    targets: "1 corpse",
    duration: null,
    criticalSuccess:
      "You animate a powerful undead servant that is bound to your will permanently.",
    success: "You animate an undead servant that obeys your commands.",
    failure:
      "The ritual fails; the corpse crumbles to dust and the gems are lost.",
    criticalFailure:
      "The ritual fails catastrophically; the corpse rises as an uncontrolled undead hostile to all living creatures.",
    traits: { connect: [] },
    heightenings: { create: [] },
  },
];

export const seedLocalRituals = async (): Promise<{
  rituals: Prisma.RitualUncheckedCreateInput[];
}> => {
  const rituals = buildLocalRituals();
  await prisma.$transaction(
    rituals.map((ritual) => prisma.ritual.create({ data: ritual }))
  );
  return { rituals };
};
