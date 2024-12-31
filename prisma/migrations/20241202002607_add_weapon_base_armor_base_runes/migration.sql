-- CreateEnum
CREATE TYPE "WeaponCategory" AS ENUM ('Simple', 'Martial', 'Advanced');

-- CreateEnum
CREATE TYPE "WeaponDamageType" AS ENUM ('Bludgeoning', 'Slashing', 'Piercing');

-- CreateEnum
CREATE TYPE "WeaponType" AS ENUM ('Melee', 'Ranged');

-- CreateEnum
CREATE TYPE "WeaponHands" AS ENUM ('One', 'Two');

-- CreateEnum
CREATE TYPE "Rarity" AS ENUM ('Common', 'Uncommon', 'Rare');

-- CreateEnum
CREATE TYPE "ArmorCategory" AS ENUM ('Unarmored', 'Light', 'Medium', 'Heavy');

-- CreateEnum
CREATE TYPE "RuneItemSubcategory" AS ENUM ('WeaponProperty', 'WeaponFundamental', 'ArmorProperty', 'ArmorFundamental', 'Shield', 'Accessory');

-- AlterTable
ALTER TABLE "CharacterClass" ALTER COLUMN "description" DROP NOT NULL;

-- CreateTable
CREATE TABLE "WeaponBase" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "WeaponCategory" NOT NULL,
    "damageTypes" "WeaponDamageType"[],
    "diceAmount" INTEGER NOT NULL,
    "diceSize" INTEGER NOT NULL,
    "criticalDiceAmount" INTEGER,
    "criticalDiceSize" INTEGER,
    "weaponGroupId" TEXT NOT NULL,
    "hands" "WeaponHands"[],
    "range" INTEGER,
    "bulk" TEXT,

    CONSTRAINT "WeaponBase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeaponGroup" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "weaponCriticalSpecializationId" TEXT NOT NULL,

    CONSTRAINT "WeaponGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trait" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Trait_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeaponCriticalSpecialization" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "WeaponCriticalSpecialization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArmorBase" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "rarity" "Rarity" NOT NULL,
    "category" "ArmorCategory" NOT NULL,
    "armorClass" INTEGER NOT NULL,
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
CREATE TABLE "ArmorGroup" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "ArmorGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rune" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "rarity" "Rarity" NOT NULL,
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
ALTER TABLE "WeaponBase" ADD CONSTRAINT "WeaponBase_weaponGroupId_fkey" FOREIGN KEY ("weaponGroupId") REFERENCES "WeaponGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeaponGroup" ADD CONSTRAINT "WeaponGroup_weaponCriticalSpecializationId_fkey" FOREIGN KEY ("weaponCriticalSpecializationId") REFERENCES "WeaponCriticalSpecialization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArmorBase" ADD CONSTRAINT "ArmorBase_armorGroupId_fkey" FOREIGN KEY ("armorGroupId") REFERENCES "ArmorGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
