import { Prisma } from "@prisma/client";
import prisma from "../../../src/integrations/prisma/prisma-client";

export const conditionIds = {
  blinded:          "cm8cond000000000000000001",
  clumsy:           "cm8cond000000000000000002",
  concealed:        "cm8cond000000000000000003",
  confused:         "cm8cond000000000000000004",
  controlled:       "cm8cond000000000000000005",
  dazzled:          "cm8cond000000000000000006",
  deafened:         "cm8cond000000000000000007",
  doomed:           "cm8cond000000000000000008",
  drained:          "cm8cond000000000000000009",
  dying:            "cm8cond000000000000000010",
  encumbered:       "cm8cond000000000000000011",
  enfeebled:        "cm8cond000000000000000012",
  fascinated:       "cm8cond000000000000000013",
  fatigued:         "cm8cond000000000000000014",
  fleeing:          "cm8cond000000000000000015",
  frightened:       "cm8cond000000000000000016",
  grabbed:          "cm8cond000000000000000017",
  hidden:           "cm8cond000000000000000018",
  immobilized:      "cm8cond000000000000000019",
  invisible:        "cm8cond000000000000000020",
  observed:         "cm8cond000000000000000021",
  offGuard:         "cm8cond000000000000000022",
  paralyzed:        "cm8cond000000000000000023",
  persistentDamage: "cm8cond000000000000000024",
  petrified:        "cm8cond000000000000000025",
  prone:            "cm8cond000000000000000026",
  quickened:        "cm8cond000000000000000027",
  restrained:       "cm8cond000000000000000028",
  sickened:         "cm8cond000000000000000029",
  slowed:           "cm8cond000000000000000030",
  stunned:          "cm8cond000000000000000031",
  stupefied:        "cm8cond000000000000000032",
  unconscious:      "cm8cond000000000000000033",
  undetected:       "cm8cond000000000000000034",
  unnoticed:        "cm8cond000000000000000035",
  wounded:          "cm8cond000000000000000036",
};

const buildLocalConditions = (): Prisma.ConditionCreateManyInput[] => [
  { id: conditionIds.blinded,          name: "Blinded",           hasValue: false, description: "You can't see. You take a –4 status penalty to Perception and automatically fail visual checks. All terrain is difficult terrain." },
  { id: conditionIds.clumsy,           name: "Clumsy",            hasValue: true,  description: "Your movements become clumsy. Take a –X status penalty to Dexterity-based checks and DCs, where X is your clumsy value." },
  { id: conditionIds.concealed,        name: "Concealed",         hasValue: false, description: "You are hidden from others' precise senses. Creatures must succeed at a DC 5 flat check to target you with attacks." },
  { id: conditionIds.confused,         name: "Confused",          hasValue: false, description: "You are distracted and act randomly. You can't Delay or Ready. On your turn, you use all your actions to Strike at a random target or Stride in a random direction." },
  { id: conditionIds.controlled,       name: "Controlled",        hasValue: false, description: "Someone else is making your decisions for you, typically through a dominate effect." },
  { id: conditionIds.dazzled,          name: "Dazzled",           hasValue: false, description: "Your visual senses are compromised. All targets are concealed from you." },
  { id: conditionIds.deafened,         name: "Deafened",          hasValue: false, description: "You can't hear. You take a –2 status penalty to Perception and automatically fail auditory checks." },
  { id: conditionIds.doomed,           name: "Doomed",            hasValue: true,  description: "Your life is ebbing away. Each time you would gain the dying condition, increase the dying value by your doomed value." },
  { id: conditionIds.drained,          name: "Drained",           hasValue: true,  description: "Your body is depleted of vital essence. Take a –X status penalty to Constitution-based checks and DCs and reduce your max HP by X × your level." },
  { id: conditionIds.dying,            name: "Dying",             hasValue: true,  description: "You are bleeding out or at death's door. Each round you must attempt a recovery check. If your dying value reaches 4, you die." },
  { id: conditionIds.encumbered,       name: "Encumbered",        hasValue: false, description: "You are carrying more weight than you can manage. You become clumsy 1 and take a –10 penalty to all speeds." },
  { id: conditionIds.enfeebled,        name: "Enfeebled",         hasValue: true,  description: "Your physical strength is sapped. Take a –X status penalty to Strength-based checks and DCs." },
  { id: conditionIds.fascinated,       name: "Fascinated",        hasValue: false, description: "You are enraptured by a creature or effect. Take a –2 status penalty to Perception and skill checks." },
  { id: conditionIds.fatigued,         name: "Fatigued",          hasValue: false, description: "You are tired. Take a –1 status penalty to AC and saving throws. You cannot use exploration activities." },
  { id: conditionIds.fleeing,          name: "Fleeing",           hasValue: false, description: "You are compelled to run from a source of fear. You must Stride away from it on your turn." },
  { id: conditionIds.frightened,       name: "Frightened",        hasValue: true,  description: "You are gripped with fear. Take a –X status penalty to all checks and DCs. The value decreases by 1 at the end of each of your turns." },
  { id: conditionIds.grabbed,          name: "Grabbed",           hasValue: false, description: "A creature or effect is holding you in place. You are off-guard and immobilized." },
  { id: conditionIds.hidden,           name: "Hidden",            hasValue: false, description: "You are in a concealed location known only approximately. Creatures must succeed at a DC 11 flat check to target you." },
  { id: conditionIds.immobilized,      name: "Immobilized",       hasValue: false, description: "You cannot use any action with the move trait." },
  { id: conditionIds.invisible,        name: "Invisible",         hasValue: false, description: "Creatures cannot see you. You are undetected to all creatures using only precise visual sense." },
  { id: conditionIds.observed,         name: "Observed",          hasValue: false, description: "You are fully visible. This is the default state for most creatures in normal conditions." },
  { id: conditionIds.offGuard,         name: "Off-Guard",         hasValue: false, description: "You are distracted or unable to focus on defense. You take a –2 circumstance penalty to AC." },
  { id: conditionIds.paralyzed,        name: "Paralyzed",         hasValue: false, description: "Your body is frozen in place. You are off-guard and can't act except to Recall Knowledge or use purely mental actions." },
  { id: conditionIds.persistentDamage, name: "Persistent Damage", hasValue: true,  description: "You are taking ongoing damage. At the end of each of your turns, take the specified damage. At the end of each of your turns, attempt a DC 15 flat check to remove this condition." },
  { id: conditionIds.petrified,        name: "Petrified",         hasValue: false, description: "You have been turned to stone and are unconscious. Your AC is 9, you are immune to mental effects, and you don't age." },
  { id: conditionIds.prone,            name: "Prone",             hasValue: false, description: "You are lying on the ground. Take a –2 circumstance penalty to attack rolls and you are off-guard. Standing up costs an action." },
  { id: conditionIds.quickened,        name: "Quickened",         hasValue: false, description: "You can spend an extra action each turn, though only for specific actions granted by the quickened condition." },
  { id: conditionIds.restrained,       name: "Restrained",        hasValue: false, description: "You are held in place and unable to move freely. You are off-guard, grabbed, and immobilized." },
  { id: conditionIds.sickened,         name: "Sickened",          hasValue: true,  description: "You feel ill. Take a –X status penalty to all checks and DCs. You can't willingly ingest anything." },
  { id: conditionIds.slowed,           name: "Slowed",            hasValue: true,  description: "You have fewer actions per round. Reduce your actions by X each round." },
  { id: conditionIds.stunned,          name: "Stunned",           hasValue: true,  description: "You have lost the ability to act. Lose actions equal to your stunned value (minimum 1) at the start of your turn." },
  { id: conditionIds.stupefied,        name: "Stupefied",         hasValue: true,  description: "Your mental faculties are clouded. Take a –X status penalty to Intelligence-, Wisdom-, and Charisma-based checks and DCs." },
  { id: conditionIds.unconscious,      name: "Unconscious",       hasValue: false, description: "You are senseless. You take a –4 status penalty to AC and Reflex saves, and cannot act." },
  { id: conditionIds.undetected,       name: "Undetected",        hasValue: false, description: "Creatures don't know your location. They cannot target you directly, though they can use area effects." },
  { id: conditionIds.unnoticed,        name: "Unnoticed",         hasValue: false, description: "A creature is entirely unaware of your presence and has no idea you exist." },
  { id: conditionIds.wounded,          name: "Wounded",           hasValue: true,  description: "You have been badly hurt. Each time you gain the dying condition, increase its value by your wounded value." },
];

export const seedLocalConditions = async (): Promise<{
  conditions: Prisma.ConditionCreateManyInput[];
}> => {
  const conditions = buildLocalConditions();

  // Phase 1: scalar rows (no relational connect clauses)
  await prisma.condition.createMany({ data: conditions });

  // Phase 2: apply overrides edges via transaction
  await prisma.$transaction([
    prisma.condition.update({
      where: { id: conditionIds.unconscious },
      data: { overrides: { connect: [{ id: conditionIds.dying }] } },
    }),
    prisma.condition.update({
      where: { id: conditionIds.paralyzed },
      data: { overrides: { connect: [{ id: conditionIds.offGuard }, { id: conditionIds.immobilized }] } },
    }),
    prisma.condition.update({
      where: { id: conditionIds.petrified },
      data: { overrides: { connect: [{ id: conditionIds.unconscious }] } },
    }),
    prisma.condition.update({
      where: { id: conditionIds.restrained },
      data: { overrides: { connect: [{ id: conditionIds.grabbed }, { id: conditionIds.immobilized }] } },
    }),
    prisma.condition.update({
      where: { id: conditionIds.undetected },
      data: { overrides: { connect: [{ id: conditionIds.hidden }] } },
    }),
    prisma.condition.update({
      where: { id: conditionIds.unnoticed },
      data: { overrides: { connect: [{ id: conditionIds.undetected }] } },
    }),
  ]);

  return { conditions };
};
