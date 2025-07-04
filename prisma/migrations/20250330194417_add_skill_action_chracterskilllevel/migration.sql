-- AlterTable
ALTER TABLE "_AncestryToLanguage" ADD CONSTRAINT "_AncestryToLanguage_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_AncestryToLanguage_AB_unique";

-- AlterTable
ALTER TABLE "_AncestryToTrait" ADD CONSTRAINT "_AncestryToTrait_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_AncestryToTrait_AB_unique";

-- AlterTable
ALTER TABLE "_ArmorBaseToTrait" ADD CONSTRAINT "_ArmorBaseToTrait_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ArmorBaseToTrait_AB_unique";

-- AlterTable
ALTER TABLE "_CharacterToLanguage" ADD CONSTRAINT "_CharacterToLanguage_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_CharacterToLanguage_AB_unique";

-- AlterTable
ALTER TABLE "_RuneToTrait" ADD CONSTRAINT "_RuneToTrait_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_RuneToTrait_AB_unique";

-- AlterTable
ALTER TABLE "_TraitToWeaponBase" ADD CONSTRAINT "_TraitToWeaponBase_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_TraitToWeaponBase_AB_unique";

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "associatedAttribute" "Attribute" NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Action" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "skillId" TEXT NOT NULL,
    "combatActions" INTEGER,
    "criticalSuccess" TEXT,
    "success" TEXT,
    "failure" TEXT,
    "criticalFailure" TEXT,
    "isUntrained" BOOLEAN NOT NULL,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterSkillLevel" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "characterId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "proficiency" "Proficiency" NOT NULL,
    "levelItWasTaken" INTEGER,

    CONSTRAINT "CharacterSkillLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ActionToTrait" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ActionToTrait_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ActionToTrait_B_index" ON "_ActionToTrait"("B");

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterSkillLevel" ADD CONSTRAINT "CharacterSkillLevel_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterSkillLevel" ADD CONSTRAINT "CharacterSkillLevel_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActionToTrait" ADD CONSTRAINT "_ActionToTrait_A_fkey" FOREIGN KEY ("A") REFERENCES "Action"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActionToTrait" ADD CONSTRAINT "_ActionToTrait_B_fkey" FOREIGN KEY ("B") REFERENCES "Trait"("id") ON DELETE CASCADE ON UPDATE CASCADE;
