-- CreateEnum
CREATE TYPE "DeitySanctification" AS ENUM ('None', 'HolyOnly', 'UnholyOnly', 'HolyOrUnholy');

-- CreateEnum
CREATE TYPE "DivineFont" AS ENUM ('Harm', 'Heal', 'HarmOrHeal');

-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "deityId" TEXT;

-- CreateTable
CREATE TABLE "Domain" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deity" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "rarity" "Rarity" NOT NULL,
    "edicts" TEXT[],
    "anathema" TEXT[],
    "divineAttributes" "Attribute"[],
    "sanctification" "DeitySanctification" NOT NULL,
    "divineFont" "DivineFont" NOT NULL,
    "divineSkillId" TEXT,
    "favoredWeaponId" TEXT,

    CONSTRAINT "Deity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeityClericSpell" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deityId" TEXT NOT NULL,
    "spellId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,

    CONSTRAINT "DeityClericSpell_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Deity_domains" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_Deity_domains_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_Deity_alternate_domains" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_Deity_alternate_domains_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_DeityToTrait" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DeityToTrait_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "Deity_divineSkillId_idx" ON "Deity"("divineSkillId");

-- CreateIndex
CREATE INDEX "Deity_favoredWeaponId_idx" ON "Deity"("favoredWeaponId");

-- CreateIndex
CREATE INDEX "DeityClericSpell_deityId_idx" ON "DeityClericSpell"("deityId");

-- CreateIndex
CREATE UNIQUE INDEX "DeityClericSpell_deityId_rank_key" ON "DeityClericSpell"("deityId", "rank");

-- CreateIndex
CREATE INDEX "_Deity_domains_B_index" ON "_Deity_domains"("B");

-- CreateIndex
CREATE INDEX "_Deity_alternate_domains_B_index" ON "_Deity_alternate_domains"("B");

-- CreateIndex
CREATE INDEX "_DeityToTrait_B_index" ON "_DeityToTrait"("B");

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_deityId_fkey" FOREIGN KEY ("deityId") REFERENCES "Deity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deity" ADD CONSTRAINT "Deity_divineSkillId_fkey" FOREIGN KEY ("divineSkillId") REFERENCES "Skill"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deity" ADD CONSTRAINT "Deity_favoredWeaponId_fkey" FOREIGN KEY ("favoredWeaponId") REFERENCES "WeaponBase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeityClericSpell" ADD CONSTRAINT "DeityClericSpell_deityId_fkey" FOREIGN KEY ("deityId") REFERENCES "Deity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Deity_domains" ADD CONSTRAINT "_Deity_domains_A_fkey" FOREIGN KEY ("A") REFERENCES "Deity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Deity_domains" ADD CONSTRAINT "_Deity_domains_B_fkey" FOREIGN KEY ("B") REFERENCES "Domain"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Deity_alternate_domains" ADD CONSTRAINT "_Deity_alternate_domains_A_fkey" FOREIGN KEY ("A") REFERENCES "Deity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Deity_alternate_domains" ADD CONSTRAINT "_Deity_alternate_domains_B_fkey" FOREIGN KEY ("B") REFERENCES "Domain"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeityToTrait" ADD CONSTRAINT "_DeityToTrait_A_fkey" FOREIGN KEY ("A") REFERENCES "Deity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeityToTrait" ADD CONSTRAINT "_DeityToTrait_B_fkey" FOREIGN KEY ("B") REFERENCES "Trait"("id") ON DELETE CASCADE ON UPDATE CASCADE;
