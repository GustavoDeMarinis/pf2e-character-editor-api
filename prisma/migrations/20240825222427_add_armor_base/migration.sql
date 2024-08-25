/*
  Warnings:

  - Added the required column `bulk` to the `WeaponBase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `WeaponBase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `WeaponCriticalSpecialization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `WeaponGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `WeaponTrait` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ItemRarity" AS ENUM ('Common', 'Uncommon', 'Rare');

-- CreateEnum
CREATE TYPE "ArmorCategory" AS ENUM ('Unnarmored', 'Light', 'Medium', 'Heavy');

-- AlterTable
ALTER TABLE "WeaponBase" ADD COLUMN     "bulk" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "WeaponCriticalSpecialization" ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "WeaponGroup" ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "WeaponTrait" ADD COLUMN     "description" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ArmorBase" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "rarity" "ItemRarity" NOT NULL,
    "armorCategory" "ArmorCategory" NOT NULL,
    "AC" INTEGER NOT NULL,
    "dexCap" INTEGER NOT NULL,
    "checkPenalty" INTEGER NOT NULL,
    "speedPenalty" INTEGER NOT NULL,
    "strengthReq" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "bulk" TEXT NOT NULL,
    "armorGroupId" TEXT NOT NULL,

    CONSTRAINT "ArmorBase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArmorTrait" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "ArmorTrait_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArmorGroup" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "ArmorGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ArmorBaseToArmorTrait" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ArmorBaseToArmorTrait_AB_unique" ON "_ArmorBaseToArmorTrait"("A", "B");

-- CreateIndex
CREATE INDEX "_ArmorBaseToArmorTrait_B_index" ON "_ArmorBaseToArmorTrait"("B");

-- AddForeignKey
ALTER TABLE "ArmorBase" ADD CONSTRAINT "ArmorBase_armorGroupId_fkey" FOREIGN KEY ("armorGroupId") REFERENCES "ArmorGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArmorBaseToArmorTrait" ADD CONSTRAINT "_ArmorBaseToArmorTrait_A_fkey" FOREIGN KEY ("A") REFERENCES "ArmorBase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArmorBaseToArmorTrait" ADD CONSTRAINT "_ArmorBaseToArmorTrait_B_fkey" FOREIGN KEY ("B") REFERENCES "ArmorTrait"("id") ON DELETE CASCADE ON UPDATE CASCADE;
