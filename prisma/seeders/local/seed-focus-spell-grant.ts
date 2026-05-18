import { Prisma } from "@prisma/client";
import prisma from "../../../src/integrations/prisma/prisma-client";
import { spellIds } from "./seed-spell";
import { ClassIds } from "./seed-character-class";
import { domainIds } from "./seed-domain";

export const focusSpellGrantIds = {
  championLayOnHands: "cmpbu1sgs0004gygy351b3ky5",
  monkKiStrike: "cmpbu1sgs0005gygyeydp12ch",
  healingHealersBlessing: "cmpbu1sgs0006gygyf0e54nqr",
  fireFireRay: "cmpbu1sgs0007gygy92k650q6",
  knowledgeScholarlyRecollection: "cmpbu1sgs0008gygyc493a26x",
};

const buildLocalFocusSpellGrants =
  (): Prisma.FocusSpellGrantUncheckedCreateInput[] => [
    {
      id: focusSpellGrantIds.championLayOnHands,
      spellId: spellIds.layOnHands,
      characterClassId: ClassIds.champion,
    },
    {
      id: focusSpellGrantIds.monkKiStrike,
      spellId: spellIds.kiStrike,
      characterClassId: ClassIds.monk,
    },
    {
      id: focusSpellGrantIds.healingHealersBlessing,
      spellId: spellIds.healersBlessing,
      domainId: domainIds.healing,
    },
    {
      id: focusSpellGrantIds.fireFireRay,
      spellId: spellIds.fireRay,
      domainId: domainIds.fire,
    },
    {
      id: focusSpellGrantIds.knowledgeScholarlyRecollection,
      spellId: spellIds.scholarlyRecollection,
      domainId: domainIds.knowledge,
    },
  ];

export const seedLocalFocusSpellGrants = async (): Promise<{
  focusSpellGrants: Prisma.FocusSpellGrantUncheckedCreateInput[];
}> => {
  const focusSpellGrants = buildLocalFocusSpellGrants();
  await prisma.$transaction(
    focusSpellGrants.map((grant) =>
      prisma.focusSpellGrant.create({ data: grant })
    )
  );
  return { focusSpellGrants };
};
