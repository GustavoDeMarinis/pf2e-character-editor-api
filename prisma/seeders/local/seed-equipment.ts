import { ItemUsage, Prisma, Rarity } from "@prisma/client";
import prisma from "../../../src/integrations/prisma/prisma-client";

export const equipmentIds = {
  rope:          "cmq0fj2b90000l5gyetajbz09",
  bandolier:     "cmq0fj2ba0001l5gy44ta0vv6",
  backpack:      "cmq0fj2bb0002l5gyciy88hy2",
  climbingKit:   "cmq0fj2bb0003l5gygi1p81jt",
  thievesTools:  "cmq0fj2bb0004l5gy3rdw642r",
  torch:         "cmq0fj2bb0005l5gyfvpqf3wf",
  tent:          "cmq0fj2bb0006l5gy0q0xbx08",
  bedroll:       "cmq0fj2bb0007l5gy0lty0566",
  flintAndSteel: "cmq0fj2bb0008l5gy82sb4ffq",
  grapplingHook: "cmq0fj2bb0009l5gydu44f588",
  lantern:       "cmq0fj2bc000al5gy3nj41im7",
  rations:       "cmq0fj2bc000bl5gyeawxhel4",
  waterskin:     "cmq0fj2bc000cl5gy9505cigk",
  healersTools:  "cmq0fj2bc000dl5gy3jti9mq4",
};

// Prices are in copper pieces (cp): 1 gp = 10 sp = 100 cp.
const buildLocalEquipment = (): Prisma.EquipmentCreateManyInput[] => [
  { id: equipmentIds.rope,          name: "Rope (50 feet)",     level: 0, price: 50,  bulk: "L", hands: null, usage: ItemUsage.Stowed, rarity: Rarity.Common, description: "A coil of sturdy rope, 50 feet long." },
  { id: equipmentIds.bandolier,     name: "Bandolier",          level: 0, price: 10,  bulk: "L", hands: null, usage: ItemUsage.Worn,   rarity: Rarity.Common, description: "Holds up to eight items of light Bulk within easy reach." },
  { id: equipmentIds.backpack,      name: "Backpack",           level: 0, price: 10,  bulk: "L", hands: null, usage: ItemUsage.Worn,   rarity: Rarity.Common, description: "Holds roughly four Bulk of items; the first two Bulk don't count against your limits while worn." },
  { id: equipmentIds.climbingKit,   name: "Climbing Kit",       level: 0, price: 50,  bulk: "1", hands: null, usage: ItemUsage.Stowed, rarity: Rarity.Common, description: "Pitons, a hammer, and other tools to aid in climbing." },
  { id: equipmentIds.thievesTools,  name: "Thieves' Tools",     level: 0, price: 300, bulk: "L", hands: 2,    usage: ItemUsage.Held,   rarity: Rarity.Common, description: "Required to Pick a Lock or Disable a Device on most traps and locks." },
  { id: equipmentIds.torch,         name: "Torch",              level: 0, price: 1,   bulk: "L", hands: 1,    usage: ItemUsage.Held,   rarity: Rarity.Common, description: "Sheds bright light in a 20-foot radius (and dim light to 40 feet) for 1 hour." },
  { id: equipmentIds.tent,          name: "Tent (Pup)",         level: 0, price: 80,  bulk: "1", hands: null, usage: ItemUsage.Stowed, rarity: Rarity.Common, description: "A small two-person tent." },
  { id: equipmentIds.bedroll,       name: "Bedroll",            level: 0, price: 1,   bulk: "L", hands: null, usage: ItemUsage.Stowed, rarity: Rarity.Common, description: "A simple bedroll for sleeping outdoors." },
  { id: equipmentIds.flintAndSteel, name: "Flint and Steel",    level: 0, price: 5,   bulk: "—", hands: null, usage: ItemUsage.Stowed, rarity: Rarity.Common, description: "Used to light fires." },
  { id: equipmentIds.grapplingHook, name: "Grappling Hook",     level: 0, price: 10,  bulk: "L", hands: null, usage: ItemUsage.Stowed, rarity: Rarity.Common, description: "A hook for catching on ledges; often tied to a rope." },
  { id: equipmentIds.lantern,       name: "Lantern (Hooded)",   level: 0, price: 70,  bulk: "L", hands: 1,    usage: ItemUsage.Held,   rarity: Rarity.Common, description: "Sheds bright light in a 30-foot radius (and dim light to 60 feet); the hood can be closed to block the light." },
  { id: equipmentIds.rations,       name: "Rations (1 week)",   level: 0, price: 40,  bulk: "L", hands: null, usage: ItemUsage.Stowed, rarity: Rarity.Common, description: "A week's worth of dry, preserved travel food." },
  { id: equipmentIds.waterskin,     name: "Waterskin",          level: 0, price: 5,   bulk: "L", hands: null, usage: ItemUsage.Stowed, rarity: Rarity.Common, description: "Holds roughly half a gallon of liquid." },
  { id: equipmentIds.healersTools,  name: "Healer's Tools",     level: 0, price: 500, bulk: "1", hands: 2,    usage: ItemUsage.Held,   rarity: Rarity.Common, description: "Required to Treat Wounds, Treat Poison, and perform other medical tasks." },
];

export const seedLocalEquipment = async (): Promise<{
  equipment: Prisma.EquipmentCreateManyInput[];
}> => {
  const equipment = buildLocalEquipment();
  await prisma.equipment.createMany({ data: equipment });

  return { equipment };
};
