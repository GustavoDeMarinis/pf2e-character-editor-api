/*
  Warnings:

  - You are about to drop the column `ancestry` on the `Character` table. All the data in the column will be lost.
  - Added the required column `ancestryId` to the `Character` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classBoost` to the `Character` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Proficiency" AS ENUM ('Untrained', 'Trained', 'Expert', 'Master', 'Legendary');

-- CreateEnum
CREATE TYPE "AncestrySize" AS ENUM ('Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan');

-- AlterEnum
ALTER TYPE "Rarity" ADD VALUE 'Secret';

-- AlterTable
ALTER TABLE "Character" DROP COLUMN "ancestry",
ADD COLUMN     "ancestryBoost" "Attribute"[],
ADD COLUMN     "ancestryId" TEXT NOT NULL,
ADD COLUMN     "backgroundBoost" "Attribute"[],
ADD COLUMN     "classBoost" "Attribute" NOT NULL;

-- CreateTable
CREATE TABLE "ClassLevelingMap" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "characterClassId" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "abilitiesIncrease" BOOLEAN NOT NULL,
    "skillIncrease" BOOLEAN NOT NULL,
    "skillTraining" BOOLEAN NOT NULL,
    "ancestryFeat" BOOLEAN NOT NULL,
    "classFeat" BOOLEAN NOT NULL,
    "skillFeat" BOOLEAN NOT NULL,
    "unarmoredArmorProficiency" "Proficiency",
    "lightArmorProficiency" "Proficiency",
    "mediumArmorProficiency" "Proficiency",
    "heavyArmorProficiency" "Proficiency",
    "unarmedProficiency" "Proficiency",
    "simpleWeaponProficiency" "Proficiency",
    "martialWeaponProficiency" "Proficiency",
    "advancedWeaponProficiency" "Proficiency",
    "perceptionProficiency" "Proficiency",
    "fortitudeProficiency" "Proficiency",
    "reflexProficiency" "Proficiency",
    "willProficiency" "Proficiency",

    CONSTRAINT "ClassLevelingMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ancestry" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "hitPoints" INTEGER NOT NULL,
    "size" "AncestrySize" NOT NULL,
    "speed" INTEGER NOT NULL,
    "attributeBoost" "Attribute"[],
    "attributeFlaw" "Attribute"[],
    "rarity" "Rarity" NOT NULL,

    CONSTRAINT "Ancestry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "rarity" "Rarity" NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CharacterToLanguage" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_AncestryToTrait" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_AncestryToLanguage" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CharacterToLanguage_AB_unique" ON "_CharacterToLanguage"("A", "B");

-- CreateIndex
CREATE INDEX "_CharacterToLanguage_B_index" ON "_CharacterToLanguage"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AncestryToTrait_AB_unique" ON "_AncestryToTrait"("A", "B");

-- CreateIndex
CREATE INDEX "_AncestryToTrait_B_index" ON "_AncestryToTrait"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AncestryToLanguage_AB_unique" ON "_AncestryToLanguage"("A", "B");

-- CreateIndex
CREATE INDEX "_AncestryToLanguage_B_index" ON "_AncestryToLanguage"("B");

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_ancestryId_fkey" FOREIGN KEY ("ancestryId") REFERENCES "Ancestry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassLevelingMap" ADD CONSTRAINT "ClassLevelingMap_characterClassId_fkey" FOREIGN KEY ("characterClassId") REFERENCES "CharacterClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterToLanguage" ADD CONSTRAINT "_CharacterToLanguage_A_fkey" FOREIGN KEY ("A") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterToLanguage" ADD CONSTRAINT "_CharacterToLanguage_B_fkey" FOREIGN KEY ("B") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AncestryToTrait" ADD CONSTRAINT "_AncestryToTrait_A_fkey" FOREIGN KEY ("A") REFERENCES "Ancestry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AncestryToTrait" ADD CONSTRAINT "_AncestryToTrait_B_fkey" FOREIGN KEY ("B") REFERENCES "Trait"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AncestryToLanguage" ADD CONSTRAINT "_AncestryToLanguage_A_fkey" FOREIGN KEY ("A") REFERENCES "Ancestry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AncestryToLanguage" ADD CONSTRAINT "_AncestryToLanguage_B_fkey" FOREIGN KEY ("B") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;
