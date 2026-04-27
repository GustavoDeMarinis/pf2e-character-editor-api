/*
  Warnings:

  - You are about to drop the column `background` on the `Character` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Character" DROP CONSTRAINT "Character_heritageId_fkey";

-- AlterTable
ALTER TABLE "Character" DROP COLUMN "background",
ADD COLUMN     "backgroundId" TEXT;

-- CreateTable
CREATE TABLE "Background" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "rarity" "Rarity" NOT NULL,
    "attributeBoostOptions" "Attribute"[],
    "trainedSkillId" TEXT,
    "trainedLoreName" TEXT,

    CONSTRAINT "Background_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BackgroundToTrait" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BackgroundToTrait_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "Background_trainedSkillId_idx" ON "Background"("trainedSkillId");

-- CreateIndex
CREATE INDEX "_BackgroundToTrait_B_index" ON "_BackgroundToTrait"("B");

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_backgroundId_fkey" FOREIGN KEY ("backgroundId") REFERENCES "Background"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_heritageId_fkey" FOREIGN KEY ("heritageId") REFERENCES "Heritage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Background" ADD CONSTRAINT "Background_trainedSkillId_fkey" FOREIGN KEY ("trainedSkillId") REFERENCES "Skill"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BackgroundToTrait" ADD CONSTRAINT "_BackgroundToTrait_A_fkey" FOREIGN KEY ("A") REFERENCES "Background"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BackgroundToTrait" ADD CONSTRAINT "_BackgroundToTrait_B_fkey" FOREIGN KEY ("B") REFERENCES "Trait"("id") ON DELETE CASCADE ON UPDATE CASCADE;
