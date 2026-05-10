import { Prisma } from "@prisma/client";
import prisma from "../../../src/integrations/prisma/prisma-client";

export const domainIds = {
  air:        "cmoj8boix0000kwgyfj970y92",
  cities:     "cmoj8boiy0001kwgy7ys67bj1",
  confidence: "cmoj8boiz0002kwgy5j9u40oj",
  creation:   "cmoj8boiz0003kwgyaokybw03",
  darkness:   "cmoj8boiz0004kwgy998n5b4k",
  death:      "cmoj8boiz0005kwgyachj4ubl",
  destruction:"cmoj8boiz0006kwgy9bgf1uja",
  dreams:     "cmoj8boiz0007kwgy008nco64",
  earth:      "cmoj8boiz0008kwgyar6jft5x",
  family:     "cmoj8boiz0009kwgyb7sh0w8j",
  fate:       "cmoj8boiz000akwgydyrm9mxw",
  fire:       "cmoj8boiz000bkwgy233l53zy",
  freedom:    "cmoj8boiz000ckwgy621ghrb7",
  healing:    "cmoj8boiz000dkwgy2hl59ikx",
  indulgence: "cmoj8boiz000ekwgycclce0qg",
  knowledge:  "cmoj8boiz000fkwgyekgrcy51",
  luck:       "cmoj8boiz000gkwgycptf2imn",
  magic:      "cmoj8boj0000hkwgy2yigapo8",
  might:      "cmoj8boj0000ikwgy0t0n1g68",
  moon:       "cmoj8boj0000jkwgy9n4t60zo",
  nature:     "cmoj8boj0000kkwgy7n7telbl",
  nightmares: "cmoj8boj0000lkwgybawubmi8",
  pain:       "cmoj8boj0000mkwgy0w1mbx91",
  passion:    "cmoj8boj0000nkwgy0f0n0cyn",
  perfection: "cmoj8boj0000okwgygwixdiej",
  plague:     "cmoj8boj0000pkwgy5pvd37eu",
  protection: "cmoj8boj0000qkwgy3ekahq08",
  secrecy:    "cmoj8boj0000rkwgy9sm311ur",
  sorrow:     "cmoj8boj0000skwgydilc5ejj",
  sun:        "cmoj8boj0000tkwgybkdt1rap",
  travel:     "cmoj8boj0000ukwgy70gj733z",
  trickery:   "cmoj8boj0000vkwgy609997ho",
  truth:      "cmoj8boj0000wkwgyfqwx7c6t",
  tyranny:    "cmoj8boj0000xkwgy6txv8cg5",
  undeath:    "cmoj8boj0000ykwgy4y0x7dia",
  water:      "cmoj8boj0000zkwgy8ufbbg9l",
  wealth:     "cmoj8boj00010kwgyewryf2az",
  zeal:       "cmoj8boj00011kwgyg4ba9mwa",
};

const buildLocalDomains = (): Prisma.DomainUncheckedCreateInput[] => [
  { id: domainIds.air,         name: "Air",         description: "The domain of air, wind, and weather." },
  { id: domainIds.cities,      name: "Cities",      description: "The domain of civilization, law, and urban life." },
  { id: domainIds.confidence,  name: "Confidence",  description: "The domain of self-assurance, bravery, and resolve." },
  { id: domainIds.creation,    name: "Creation",    description: "The domain of crafting, artistry, and making." },
  { id: domainIds.darkness,    name: "Darkness",    description: "The domain of shadows, night, and the unseen." },
  { id: domainIds.death,       name: "Death",       description: "The domain of endings, the dead, and passage to the afterlife." },
  { id: domainIds.destruction, name: "Destruction", description: "The domain of ruin, entropy, and devastation." },
  { id: domainIds.dreams,      name: "Dreams",      description: "The domain of sleep, visions, and the subconscious." },
  { id: domainIds.earth,       name: "Earth",       description: "The domain of stone, soil, and the enduring land." },
  { id: domainIds.family,      name: "Family",      description: "The domain of kinship, community, and bonds of love." },
  { id: domainIds.fate,        name: "Fate",        description: "The domain of destiny, prophecy, and the thread of life." },
  { id: domainIds.fire,        name: "Fire",        description: "The domain of flame, heat, and burning passion." },
  { id: domainIds.freedom,     name: "Freedom",     description: "The domain of liberty, independence, and free will." },
  { id: domainIds.healing,     name: "Healing",     description: "The domain of restoration, medicine, and the mending of wounds." },
  { id: domainIds.indulgence,  name: "Indulgence",  description: "The domain of pleasure, excess, and earthly delights." },
  { id: domainIds.knowledge,   name: "Knowledge",   description: "The domain of learning, lore, and the pursuit of truth." },
  { id: domainIds.luck,        name: "Luck",        description: "The domain of fortune, chance, and happy accidents." },
  { id: domainIds.magic,       name: "Magic",       description: "The domain of arcane and divine power." },
  { id: domainIds.might,       name: "Might",       description: "The domain of strength, valor, and physical prowess." },
  { id: domainIds.moon,        name: "Moon",        description: "The domain of the moon, tides, and cycles of change." },
  { id: domainIds.nature,      name: "Nature",      description: "The domain of the natural world, plants, and animals." },
  { id: domainIds.nightmares,  name: "Nightmares",  description: "The domain of fear, terror, and dark visions." },
  { id: domainIds.pain,        name: "Pain",        description: "The domain of suffering, anguish, and torment." },
  { id: domainIds.passion,     name: "Passion",     description: "The domain of desire, emotion, and intensity of feeling." },
  { id: domainIds.perfection,  name: "Perfection",  description: "The domain of discipline, refinement, and the ideal form." },
  { id: domainIds.plague,      name: "Plague",      description: "The domain of disease, pestilence, and contagion." },
  { id: domainIds.protection,  name: "Protection",  description: "The domain of guardianship, defense, and warding." },
  { id: domainIds.secrecy,     name: "Secrecy",     description: "The domain of hidden lore, silence, and concealment." },
  { id: domainIds.sorrow,      name: "Sorrow",      description: "The domain of grief, mourning, and despair." },
  { id: domainIds.sun,         name: "Sun",         description: "The domain of sunlight, warmth, and revelation." },
  { id: domainIds.travel,      name: "Travel",      description: "The domain of journeys, roads, and exploration." },
  { id: domainIds.trickery,    name: "Trickery",    description: "The domain of deception, cunning, and illusion." },
  { id: domainIds.truth,       name: "Truth",       description: "The domain of honesty, revelation, and uncovering lies." },
  { id: domainIds.tyranny,     name: "Tyranny",     description: "The domain of control, subjugation, and absolute rule." },
  { id: domainIds.undeath,     name: "Undeath",     description: "The domain of the undead, necromancy, and unnatural life." },
  { id: domainIds.water,       name: "Water",       description: "The domain of oceans, rivers, and the flow of life." },
  { id: domainIds.wealth,      name: "Wealth",      description: "The domain of coin, trade, and prosperity." },
  { id: domainIds.zeal,        name: "Zeal",        description: "The domain of fervor, devotion, and righteous conviction." },
];

export const seedLocalDomains = async (): Promise<{
  domains: Prisma.DomainUncheckedCreateInput[];
}> => {
  const domains = buildLocalDomains();
  await prisma.$transaction(
    domains.map((domain) => prisma.domain.create({ data: domain }))
  );
  return { domains };
};
