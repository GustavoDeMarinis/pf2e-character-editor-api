-- CreateEnum
CREATE TYPE "FeatType" AS ENUM ('Ancestry', 'Class', 'Skill', 'General', 'Archetype', 'Bonus');

-- CreateEnum
CREATE TYPE "ActionCost" AS ENUM ('Free', 'Reaction', 'One', 'Two', 'Three', 'TwoToThree', 'OneToThree', 'None');

-- CreateTable
CREATE TABLE "Feat" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "featType" "FeatType" NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "actionCost" "ActionCost",
    "rarity" "Rarity" NOT NULL,
    "prerequisites" TEXT,
    "frequency" TEXT,
    "trigger" TEXT,
    "requirements" TEXT,
    "ancestryId" TEXT,
    "characterClassId" TEXT,
    "skillId" TEXT,

    CONSTRAINT "Feat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterFeat" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "characterId" TEXT NOT NULL,
    "featId" TEXT NOT NULL,
    "levelItWasTaken" INTEGER NOT NULL,
    "slotType" "FeatType" NOT NULL,

    CONSTRAINT "CharacterFeat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FeatToTrait" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FeatToTrait_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "Feat_featType_level_idx" ON "Feat"("featType", "level");

-- CreateIndex
CREATE INDEX "CharacterFeat_characterId_idx" ON "CharacterFeat"("characterId");

-- CreateIndex
CREATE UNIQUE INDEX "CharacterFeat_characterId_featId_key" ON "CharacterFeat"("characterId", "featId");

-- CreateIndex
CREATE INDEX "_FeatToTrait_B_index" ON "_FeatToTrait"("B");

-- AddForeignKey
ALTER TABLE "Feat" ADD CONSTRAINT "Feat_ancestryId_fkey" FOREIGN KEY ("ancestryId") REFERENCES "Ancestry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feat" ADD CONSTRAINT "Feat_characterClassId_fkey" FOREIGN KEY ("characterClassId") REFERENCES "CharacterClass"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feat" ADD CONSTRAINT "Feat_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterFeat" ADD CONSTRAINT "CharacterFeat_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterFeat" ADD CONSTRAINT "CharacterFeat_featId_fkey" FOREIGN KEY ("featId") REFERENCES "Feat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FeatToTrait" ADD CONSTRAINT "_FeatToTrait_A_fkey" FOREIGN KEY ("A") REFERENCES "Feat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FeatToTrait" ADD CONSTRAINT "_FeatToTrait_B_fkey" FOREIGN KEY ("B") REFERENCES "Trait"("id") ON DELETE CASCADE ON UPDATE CASCADE;
