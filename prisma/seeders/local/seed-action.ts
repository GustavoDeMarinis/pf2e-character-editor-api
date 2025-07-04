import { Prisma, Attribute } from "@prisma/client";
import prisma from "../../../src/integrations/prisma/prisma-client";
import { skillIds } from "./seed-skill";

export const actionIds = {
  balance: "cm8w2ughl0014m5gycmo22v4x",
  tumbleThrough: "cm8w2ughl0015m5gycvcaftlb",
  maneuverInFlight: "cm8w2ughl0016m5gy0ggecq4m",
  squeeze: "cm8w2ughl0017m5gy008n1ize",
  recallKnowledgeArcana: "cm8w2ughl0018m5gyhwvl2ml9",
  decipherWritings: "cm8w2ughl0019m5gy5fcca7kt",
  identifyMagicArcana: "cm8w2ughl001am5gyad9j5d70",
  learnSpellArcana: "cm8w2ughl001bm5gydaieaijy",
  borrowAnArcaneSpell: "cm8w2ughl001cm5gyg9bw1qwt",
  climb: "cm8w2ughl001dm5gy4t20ccdn",
  forceOpen: "cm8w2mtb800000mgybthh90hl",
  grapple: "cm8w2mtb800010mgy8t0o0zg5",
  highJump: "cm8w2mtb800020mgy3ohb0nbp",
  longJump: "cm8w2mtb800030mgy3dwyesa6",
  reposition: "cm8w2mtb900040mgygo743mn6",
  shove: "cm8w2mtb900050mgy93m2508g",
  swim: "cm8w2mtb900060mgy7pwe9e8i",
  trip: "cm8w2mtb900070mgyarcmcma8",
  disarm: "cm8w2mtb900080mgyhftzf452",
  recallKnowledgeCraft: "cm8w2mtb900090mgy9z7e8yem",
  earnIncomeCraft: "cm8w2mtb9000a0mgydmkabdkf",
  repair: "cm8w2mtb9000b0mgy8unm0dzs",
  craft: "cm8w2mtb9000c0mgy6r03ajsu",
  identifyAlchemy: "cm8w2mtb9000d0mgycc1sb3ug",
  createADiversion: "cm8w2mtb9000e0mgyfn0hayoy",
  impersonate: "cm8w2mtb9000f0mgya8hr0c1k",
  lie: "cm8w2mtb9000g0mgy9aiwaf3w",
  feint: "cm8w2mtb9000h0mgy1rvb0i2q",
  gatherInformation: "cm8w2mtb9000i0mgyf4487nmp",
  makeAnImpression: "cm8w2mtb9000j0mgy7gax6zv8",
  request: "cm8w2mtb9000k0mgy4pl38386",
  coerce: "cm8w2mtb9000l0mgyhugi7ucw",
  demoralize: "cm8w2mtb9000m0mgyfcdlar7i",
  recallKnowledgeMedicine: "cm8w2mtb9000n0mgy84isd1wa",
  administerFirstAid: "cm8w2mtb9000o0mgyfscl3n8d",
  treatDisease: "cm8w2mtb9000p0mgyhsn8c1f5",
  treatPoison: "cm8w2mtb9000q0mgy2lx03w86",
  treatWounds: "cm8w2mtb9000r0mgya3uz4a4z",
  recallKnowledgeNature: "cm8w2mtb9000s0mgy75krg45u",
  identifyMagicNature: "cm8w2mtb9000t0mgy7he3gqc8",
  learnASpellNature: "cm8w2mtb9000u0mgy3un10a7i",
  commandAnAnimal: "cm8w2mtb9000v0mgydfoxgcq2",
  recallKnowledgeOccultism: "cm8w2mtb9000w0mgyac673p2a",
  decipherWritingOccultism: "cm8w2mtb9000x0mgydd3c04j9",
  identifyMagicOccultism: "cm8w2mtb9000y0mgya2ho8zan",
  learnASpellOccultism: "cm8w2mtb9000z0mgy58ni87fu",
  earnIncomePerformance: "cm8w2mtb900100mgych22e7kr",
  perform: "cm8w2mtb900110mgyazqcgbjx",
  recallKnowledgeReligion: "cm8w2mtb900120mgy0fnp4u3d",
  decipherWritingReligion: "cm8w2mtb900130mgyfwbk30zr",
  identifyMagicReligion: "cm8w2mtb900140mgyce7ce191",
  learnASpellReligion: "cm8w2mtb900150mgy6uaf3l6u",
  recallKnowledgeSociety: "cm8w2mtb900160mgy02lsc9qj",
  subsist: "cm8w2mtb900170mgyd9yb6hzm",
  concealAnObject: "cm8w2mtb900180mgydjc180ev",
  hide: "cm8w2mtb900190mgyhd226jdg",
  sneak: "cm8w2mtb9001a0mgycm4e5r1z",
  senseDirection: "cm8w2mtb9001b0mgy9p9r1q0i",
  coverTracks: "cm8w2mtb9001c0mgychogcube",
  track: "cm8w2mtb9001d0mgy9pbv2y00",
  palmAnObject: "cm8w7ajra00009igy0rad2tvn",
  steal: "cm8w7ajrb00029igyd9prhma6",
  disableDevice: "cm8w7ajrb00039igybl7537zy",
  pickAlock: "cm8w7ajrb00049igy5qbiawrb",
};

const buildLocalAncestry = (): Prisma.ActionUncheckedCreateInput[] => {
  const actions: Prisma.ActionUncheckedCreateInput[] = [
    {
      id: actionIds.balance,
      name: "Balance",
      description:
        "You move across a narrow surface or uneven ground. You must attempt an Acrobatics check to Balance if you move more than half your Speed on uneven ground or narrow surfaces, or if you’re using the Balance action while you’re on difficult terrain.",
      skillId: skillIds.acrobatics,
      isUntrained: true,
    },
    {
      id: actionIds.tumbleThrough,
      name: "Tumble Through",
      description:
        "You Stride up to your Speed. During this movement, you can try to move through the space of one enemy. Attempt an Acrobatics check against the enemy's Reflex DC as soon as you try to enter its space. You can Tumble Through using Climb, Fly, Swim, or another movement type in place of Stride in the appropriate circumstances.",
      skillId: skillIds.acrobatics,
      isUntrained: true,
    },
    {
      id: actionIds.maneuverInFlight,
      name: "Maneuver in Flight",
      description:
        "You can use the Acrobatics skill to Maneuver in Flight, allowing you to perform aerial maneuvers. You can use this action only if you are flying.",
      skillId: skillIds.acrobatics,
      isUntrained: false,
    },
    {
      id: actionIds.squeeze,
      name: "Squeeze",
      description:
        "You can use the Acrobatics skill to Squeeze through a tight space, such as a narrow corridor or a small window. You can Squeeze only if you are Tiny or smaller.",
      skillId: skillIds.acrobatics,
      isUntrained: false,
    },
    {
      id: actionIds.recallKnowledgeArcana,
      name: "Recall Knowledge (Arcana)",
      description:
        "You attempt a skill check to see what you know about arcane magic, magical traditions, creatures of magical significance, and other magical phenomena.",
      skillId: skillIds.arcana,
      isUntrained: true,
    },
    {
      id: actionIds.decipherWritings,
      name: "Decipher Writings",
      description:
        "You attempt to interpret and understand a piece of writing in an unfamiliar language or a message written in code. The GM sets the DC for the skill check based on the complexity of the writing.",
      skillId: skillIds.arcana,
      isUntrained: true,
    },
    {
      id: actionIds.identifyMagicArcana,
      name: "Identify Magic (Arcana)",
      description:
        "You attempt to identify the properties of a magic item using the Arcana skill. The DC is usually 20 but might be higher for rare items.",
      skillId: skillIds.arcana,
      isUntrained: false,
    },
    {
      id: actionIds.learnSpellArcana,
      name: "Learn a Spell (Arcana)",
      description:
        "You can learn a new spell from a spellbook or another written source. You must first decipher the writing using the Decipher Writing action.",
      skillId: skillIds.arcana,
      isUntrained: false,
    },
    {
      id: actionIds.borrowAnArcaneSpell,
      name: "Borrow an Arcane Spell",
      description:
        "You can attempt to Borrow an Arcane Spell from a willing arcane spellcaster. The spellcaster must be able to cast the spell you want to borrow.",
      skillId: skillIds.arcana,
      isUntrained: false,
    },
    {
      id: actionIds.climb,
      name: "Climb",
      description:
        "You move up, down, or across an incline or vertical surface, such as a wall or a tree. You must attempt an Athletics check to Climb if you move more than half your Speed up a surface with a slope of 45 degrees or steeper, or if you’re climbing a surface that’s particularly difficult to scale.",
      skillId: skillIds.athletics,
      isUntrained: true,
    },
    {
      id: actionIds.forceOpen,
      name: "Force Open",
      description:
        "You attempt to open a door, window, container, or heavy gate. The GM sets the DC based on the level of the obstacle and the method you’re using to force it open.",
      skillId: skillIds.athletics,
      isUntrained: true,
    },
    {
      id: actionIds.grapple,
      name: "Grapple",
      description:
        "You attempt to grab an opponent and hold them in place. You can Grapple a creature that is up to two sizes larger than you or up to two sizes smaller than you. If you have a free hand, you can Grapple a creature of your size. You can Grapple only a creature that is within your reach and that you are aware of. You can’t use this action while you’re encumbered unless you have a hand free.",
      skillId: skillIds.athletics,
      isUntrained: true,
    },
    {
      id: actionIds.highJump,
      name: "High Jump",
      description:
        "You Stride, then make a vertical Leap and attempt an Athletics check to increase the maximum height of your jump. The DC of the check is equal to the number of feet you are attempting to clear (so a DC 20 check is needed to high jump 20 feet).",
      skillId: skillIds.athletics,
      isUntrained: true,
    },
    {
      id: actionIds.longJump,
      name: "Long Jump",
      description:
        "You Stride, then make a horizontal Leap and attempt an Athletics check to increase the maximum distance of your jump. The DC of the check is equal to the number of feet you are attempting to clear (so a DC 20 check is needed to long jump 20 feet).",
      skillId: skillIds.athletics,
      isUntrained: true,
    },
    {
      id: actionIds.reposition,
      name: "Reposition",
      description:
        "You attempt to move a creature to a different location. You can move the target 5 feet, possibly damaging it in the process. You can’t move a creature into a space that is intrinsically dangerous, such as a pit or wall of fire.",
      skillId: skillIds.athletics,
      isUntrained: true,
    },
    {
      id: actionIds.shove,
      name: "Shove",
      description:
        "You push a creature away from you. You can Shove a creature that is up to two sizes larger than you or up to two sizes smaller than you. If you have a free hand, you can Shove a creature of your size. You can Shove only a creature that is within your reach and that you are aware of. You can’t use this action while you’re encumbered unless you have a hand free.",
      skillId: skillIds.athletics,
      isUntrained: true,
    },
    {
      id: actionIds.swim,
      name: "Swim",
      description:
        "You move through water. You must attempt an Athletics check to Swim if you move more than half your Speed through water.",
      skillId: skillIds.athletics,
      isUntrained: true,
    },
    {
      id: actionIds.trip,
      name: "Trip",
      description:
        "You attempt to knock a creature to the ground. You can Trip a creature that is up to two sizes larger than you or up to two sizes smaller than you. If you have a free hand, you can Trip a creature of your size. You can Trip only a creature that is within your reach and that you are aware of. You can’t use this action while you’re encumbered unless you have a hand free.",
      skillId: skillIds.athletics,
      isUntrained: true,
    },
    {
      id: actionIds.disarm,
      name: "Disarm",
      description:
        "You try to knock an item or weapon out of a creature’s grasp. You can Disarm a creature that is within your reach and that you are aware of. You can’t use this action while you’re encumbered unless you have a hand free.",
      skillId: skillIds.athletics,
      isUntrained: true,
    },
    {
      id: actionIds.recallKnowledgeCraft,
      name: "Recall Knowledge (Craft)",
      description:
        "You attempt a skill check to see what you know about crafting, engineering, and other technical fields.",
      skillId: skillIds.crafting,
      isUntrained: true,
    },
    {
      id: actionIds.earnIncomeCraft,
      name: "Earn Income (Craft)",
      description:
        "You can use your crafting skills to earn money. The amount of money you earn, the time required, and the DC of the check depend on the task you choose.",
      skillId: skillIds.crafting,
      isUntrained: true,
    },
    {
      id: actionIds.repair,
      name: "Repair",
      description:
        "You can repair a damaged item. The DC of the check is determined by the GM based on the complexity of the item and the damage it has taken.",
      skillId: skillIds.crafting,
      isUntrained: true,
    },
    {
      id: actionIds.craft,
      name: "Craft",
      description: "You can use the Craft activity to create an item.",
      skillId: skillIds.crafting,
      isUntrained: true,
    },
    {
      id: actionIds.identifyAlchemy,
      name: "Identify Alchemy",
      description:
        "You attempt to identify the properties of an alchemical item using the Crafting skill. The DC is usually 20 but might be higher for rare items.",
      skillId: skillIds.crafting,
      isUntrained: false,
    },
    {
      id: actionIds.createADiversion,
      name: "Create a Diversion",
      description:
        "You can use Deception to create a diversion to hide or conceal your actions. The GM sets the DC based on the complexity of the diversion.",
      skillId: skillIds.deception,
      isUntrained: true,
    },
    {
      id: actionIds.impersonate,
      name: "Impersonate",
      description:
        "You can use Deception to pretend to be someone you’re not. The GM sets the DC based on the complexity of the impersonation.",
      skillId: skillIds.deception,
      isUntrained: true,
    },
    {
      id: actionIds.lie,
      name: "Lie",
      description:
        "You can use Deception to tell a lie. The GM sets the DC based on the complexity of the lie.",
      skillId: skillIds.deception,
      isUntrained: true,
    },
    {
      id: actionIds.feint,
      name: "Feint",
      description:
        "You can use Deception to Feint in combat. The GM sets the DC based on the complexity of the Feint.",
      skillId: skillIds.deception,
      isUntrained: true,
    },
    {
      id: actionIds.gatherInformation,
      name: "Gather Information",
      description:
        "You can use Diplomacy to gather information from people in a settlement. The GM sets the DC based on the complexity of the information.",
      skillId: skillIds.diplomacy,
      isUntrained: true,
    },
    {
      id: actionIds.makeAnImpression,
      name: "Make an Impression",
      description:
        "You can use Diplomacy to make a good impression on someone. The GM sets the DC based on the complexity of the impression.",
      skillId: skillIds.diplomacy,
      isUntrained: true,
    },
    {
      id: actionIds.request,
      name: "Request",
      description:
        "You can use Diplomacy to make a request of someone. The GM sets the DC based on the complexity of the request.",
      skillId: skillIds.diplomacy,
      isUntrained: true,
    },
    {
      id: actionIds.coerce,
      name: "Coerce",
      description:
        "You can use Intimidation to coerce someone into doing something. The GM sets the DC based on the complexity of the coercion.",
      skillId: skillIds.intimidation,
      isUntrained: true,
    },
    {
      id: actionIds.demoralize,
      name: "Demoralize",
      description:
        "You can use Intimidation to demoralize an opponent in combat. The GM sets the DC based on the complexity of the demoralization.",
      skillId: skillIds.intimidation,
      isUntrained: true,
    },
    {
      id: actionIds.recallKnowledgeMedicine,
      name: "Recall Knowledge (Medicine)",
      description:
        "You attempt a skill check to see what you know about medicine, anatomy, injuries, and diseases.",
      skillId: skillIds.medicine,
      isUntrained: true,
    },
    {
      id: actionIds.administerFirstAid,
      name: "Administer First Aid",
      description:
        "You can use the Medicine skill to Administer First Aid to a creature. The DC is usually 15 but might be higher for particularly difficult injuries.",
      skillId: skillIds.medicine,
      isUntrained: true,
    },
    {
      id: actionIds.treatDisease,
      name: "Treat Disease",
      description:
        "You can use the Medicine skill to Treat Disease in a creature. The DC is usually 15 but might be higher for particularly virulent diseases.",
      skillId: skillIds.medicine,
      isUntrained: false,
    },
    {
      id: actionIds.treatPoison,
      name: "Treat Poison",
      description:
        "You can use the Medicine skill to Treat Poison in a creature. The DC is usually 15 but might be higher for particularly virulent poisons.",
      skillId: skillIds.medicine,
      isUntrained: false,
    },
    {
      id: actionIds.treatWounds,
      name: "Treat Wounds",
      description:
        "You can use the Medicine skill to Treat Wounds in a creature. The DC is usually 15 but might be higher for particularly difficult injuries.",
      skillId: skillIds.medicine,
      isUntrained: true,
    },
    {
      id: actionIds.recallKnowledgeNature,
      name: "Recall Knowledge (Nature)",
      description:
        "You attempt a skill check to see what you know about the natural world, including plants, animals, the weather, and natural cycles.",
      skillId: skillIds.nature,
      isUntrained: true,
    },
    {
      id: actionIds.identifyMagicNature,
      name: "Identify Magic (Nature)",
      description:
        "You attempt to identify the properties of a magic item using the Nature skill. The DC is usually 20 but might be higher for rare items.",
      skillId: skillIds.nature,
      isUntrained: false,
    },
    {
      id: actionIds.learnASpellNature,
      name: "Learn a Spell (Nature)",
      description:
        "You can learn a new spell from a spellbook or another written source. You must first decipher the writing using the Decipher Writing action.",
      skillId: skillIds.nature,
      isUntrained: false,
    },
    {
      id: actionIds.commandAnAnimal,
      name: "Command an Animal",
      description:
        "You can use the Nature skill to Command an Animal to perform a task or trick. The DC is usually 15 but might be higher for particularly difficult tasks.",
      skillId: skillIds.nature,
      isUntrained: false,
    },
    {
      id: actionIds.recallKnowledgeOccultism,
      name: "Recall Knowledge (Occultism)",
      description:
        "You attempt a skill check to see what you know about occultism, the supernatural, magical traditions, creatures of magical significance, and other magical phenomena.",
      skillId: skillIds.occultism,
      isUntrained: true,
    },
    {
      id: actionIds.decipherWritingOccultism,
      name: "Decipher Writing (Occultism)",
      description:
        "You attempt to interpret and understand a piece of writing in an unfamiliar language or a message written in code. The GM sets the DC for the skill check based on the complexity of the writing.",
      skillId: skillIds.occultism,
      isUntrained: true,
    },
    {
      id: actionIds.identifyMagicOccultism,
      name: "Identify Magic (Occultism)",
      description:
        "You attempt to identify the properties of a magic item using the Occultism skill. The DC is usually 20 but might be higher for rare items.",
      skillId: skillIds.occultism,
      isUntrained: false,
    },
    {
      id: actionIds.learnASpellOccultism,
      name: "Learn a Spell (Occultism)",
      description:
        "You can learn a new spell from a spellbook or another written source. You must first decipher the writing using the Decipher Writing action.",
      skillId: skillIds.occultism,
      isUntrained: false,
    },
    {
      id: actionIds.earnIncomePerformance,
      name: "Earn Income (Performance)",
      description:
        "You can use your performance skills to earn money. The amount of money you earn, the time required, and the DC of the check depend on the task you choose.",
      skillId: skillIds.performance,
      isUntrained: true,
    },
    {
      id: actionIds.perform,
      name: "Perform",
      description: "You can use the Perform activity to entertain an audience.",
      skillId: skillIds.performance,
      isUntrained: true,
    },
    {
      id: actionIds.recallKnowledgeReligion,
      name: "Recall Knowledge (Religion)",
      description:
        "You attempt a skill check to see what you know about religion, deities, religious traditions, and the supernatural.",
      skillId: skillIds.religion,
      isUntrained: true,
    },
    {
      id: actionIds.decipherWritingReligion,
      name: "Decipher Writing (Religion)",
      description:
        "You attempt to interpret and understand a piece of writing in an unfamiliar language or a message written in code. The GM sets the DC for the skill check based on the complexity of the writing.",
      skillId: skillIds.religion,
      isUntrained: true,
    },
    {
      id: actionIds.identifyMagicReligion,
      name: "Identify Magic (Religion)",
      description:
        "You attempt to identify the properties of a magic item using the Religion skill. The DC is usually 20 but might be higher for rare items.",
      skillId: skillIds.religion,
      isUntrained: false,
    },
    {
      id: actionIds.learnASpellReligion,
      name: "Learn a Spell (Religion)",
      description:
        "You can learn a new spell from a spellbook or another written source. You must first decipher the writing using the Decipher Writing action.",
      skillId: skillIds.religion,
      isUntrained: false,
    },
    {
      id: actionIds.recallKnowledgeSociety,
      name: "Recall Knowledge (Society)",
      description:
        "You attempt a skill check to see what you know about society, including laws, customs, traditions, and social norms.",
      skillId: skillIds.society,
      isUntrained: true,
    },
    {
      id: actionIds.subsist,
      name: "Subsist",
      description:
        "You can use the Subsist activity to provide yourself with food and water.",
      skillId: skillIds.society,
      isUntrained: true,
    },
    {
      id: actionIds.concealAnObject,
      name: "Conceal an Object",
      description:
        "You can use Stealth to hide an object on your person or in your belongings. The GM sets the DC based on the size of the object and the method you’re using to conceal it.",
      skillId: skillIds.stealth,
      isUntrained: true,
    },
    {
      id: actionIds.hide,
      name: "Hide",
      description:
        "You can use Stealth to hide yourself from view. The GM sets the DC based on the circumstances of the hiding attempt.",
      skillId: skillIds.stealth,
      isUntrained: true,
    },
    {
      id: actionIds.sneak,
      name: "Sneak",
      description:
        "You can use Stealth to move quietly and avoid being noticed. The GM sets the DC based on the circumstances of the sneaking attempt.",
      skillId: skillIds.stealth,
      isUntrained: true,
    },
    {
      id: actionIds.senseDirection,
      name: "Sense Direction",
      description:
        "You can use Survival to sense the direction of north. The DC is usually 10 but might be higher in unusual circumstances.",
      skillId: skillIds.survival,
      isUntrained: true,
    },
    {
      id: actionIds.coverTracks,
      name: "Cover Tracks",
      description:
        "You can use Survival to cover your tracks and avoid being followed. The GM sets the DC based on the circumstances of the tracking attempt.",
      skillId: skillIds.survival,
      isUntrained: true,
    },
    {
      id: actionIds.track,
      name: "Track",
      description:
        "You can use Survival to follow tracks left by creatures. The GM sets the DC based on the circumstances of the tracking attempt.",
      skillId: skillIds.survival,
      isUntrained: true,
    },
    {
      id: actionIds.palmAnObject,
      name: "Palm an Object",
      description:
        "You can use Thievery to hide an object on your person or in your belongings. The GM sets the DC based on the size of the object and the method you’re using to conceal it.",
      skillId: skillIds.thievery,
      isUntrained: true,
    },
    {
      id: actionIds.steal,
      name: "Steal",
      description:
        "You can use Thievery to take an object from a creature without being noticed. The GM sets the DC based on the size of the object and the method you’re using to steal it.",
      skillId: skillIds.thievery,
      isUntrained: true,
    },
    {
      id: actionIds.disableDevice,
      name: "Disable Device",
      description:
        "You can use Thievery to disable a device, such as a trap or a lock. The GM sets the DC based on the complexity of the device and the method you’re using to disable it.",
      skillId: skillIds.thievery,
      isUntrained: true,
    },
    {
      id: actionIds.pickAlock,
      name: "Pick a Lock",
      description:
        "You can use Thievery to pick a lock. The GM sets the DC based on the complexity of the lock and the method you’re using to pick it.",
      skillId: skillIds.thievery,
      isUntrained: true,
    },
  ];
  return actions;
};

export const seedLocalActions = async (): Promise<{
  actions: Prisma.ActionUncheckedCreateInput[];
}> => {
  const actions: Prisma.ActionUncheckedCreateInput[] = buildLocalAncestry();
  await prisma.$transaction(
    actions.map((action) => {
      return prisma.action.create({
        data: action,
      });
    })
  );
  return { actions };
};
