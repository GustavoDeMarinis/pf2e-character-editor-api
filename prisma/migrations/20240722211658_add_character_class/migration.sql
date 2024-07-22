/*
  Warnings:

  - You are about to drop the column `characterClass` on the `Character` table. All the data in the column will be lost.
  - Added the required column `characterClassId` to the `Character` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Attributes" AS ENUM ('Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma', 'Other');

-- AlterTable
ALTER TABLE "Character" DROP COLUMN "characterClass",
ADD COLUMN     "characterClassId" TEXT NOT NULL,
ADD COLUMN     "level" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "CharacterClass" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "className" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "keyAttributes" "Attributes"[],
    "hitPoints" INTEGER NOT NULL,

    CONSTRAINT "CharacterClass_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_characterClassId_fkey" FOREIGN KEY ("characterClassId") REFERENCES "CharacterClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
