/*
  Warnings:

  - You are about to drop the column `damageType` on the `WeaponBase` table. All the data in the column will be lost.
  - You are about to drop the `ArmorTrait` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WeaponTrait` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ArmorBaseToArmorTrait` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_WeaponBaseToWeaponTrait` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RuneItemSubcategory" AS ENUM ('WeaponProperty', 'WeaponFundamental', 'ArmorProperty', 'ArmorFundamental', 'Shield', 'Accessory');

-- DropForeignKey
ALTER TABLE "_ArmorBaseToArmorTrait" DROP CONSTRAINT "_ArmorBaseToArmorTrait_A_fkey";

-- DropForeignKey
ALTER TABLE "_ArmorBaseToArmorTrait" DROP CONSTRAINT "_ArmorBaseToArmorTrait_B_fkey";

-- DropForeignKey
ALTER TABLE "_WeaponBaseToWeaponTrait" DROP CONSTRAINT "_WeaponBaseToWeaponTrait_A_fkey";

-- DropForeignKey
ALTER TABLE "_WeaponBaseToWeaponTrait" DROP CONSTRAINT "_WeaponBaseToWeaponTrait_B_fkey";

-- AlterTable
ALTER TABLE "WeaponBase" DROP COLUMN "damageType",
ADD COLUMN     "damageTypes" "WeaponDamageType"[];

-- DropTable
DROP TABLE "ArmorTrait";

-- DropTable
DROP TABLE "WeaponTrait";

-- DropTable
DROP TABLE "_ArmorBaseToArmorTrait";

-- DropTable
DROP TABLE "_WeaponBaseToWeaponTrait";

-- CreateTable
CREATE TABLE "Trait" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Trait_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rune" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rarity" "ItemRarity" NOT NULL,
    "runeItemSubcategory" "RuneItemSubcategory" NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "price" INTEGER NOT NULL,

    CONSTRAINT "Rune_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TraitToWeaponBase" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ArmorBaseToTrait" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_RuneToTrait" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TraitToWeaponBase_AB_unique" ON "_TraitToWeaponBase"("A", "B");

-- CreateIndex
CREATE INDEX "_TraitToWeaponBase_B_index" ON "_TraitToWeaponBase"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ArmorBaseToTrait_AB_unique" ON "_ArmorBaseToTrait"("A", "B");

-- CreateIndex
CREATE INDEX "_ArmorBaseToTrait_B_index" ON "_ArmorBaseToTrait"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RuneToTrait_AB_unique" ON "_RuneToTrait"("A", "B");

-- CreateIndex
CREATE INDEX "_RuneToTrait_B_index" ON "_RuneToTrait"("B");

-- AddForeignKey
ALTER TABLE "_TraitToWeaponBase" ADD CONSTRAINT "_TraitToWeaponBase_A_fkey" FOREIGN KEY ("A") REFERENCES "Trait"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TraitToWeaponBase" ADD CONSTRAINT "_TraitToWeaponBase_B_fkey" FOREIGN KEY ("B") REFERENCES "WeaponBase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArmorBaseToTrait" ADD CONSTRAINT "_ArmorBaseToTrait_A_fkey" FOREIGN KEY ("A") REFERENCES "ArmorBase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArmorBaseToTrait" ADD CONSTRAINT "_ArmorBaseToTrait_B_fkey" FOREIGN KEY ("B") REFERENCES "Trait"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RuneToTrait" ADD CONSTRAINT "_RuneToTrait_A_fkey" FOREIGN KEY ("A") REFERENCES "Rune"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RuneToTrait" ADD CONSTRAINT "_RuneToTrait_B_fkey" FOREIGN KEY ("B") REFERENCES "Trait"("id") ON DELETE CASCADE ON UPDATE CASCADE;
