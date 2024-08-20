-- CreateEnum
CREATE TYPE "WeaponCategory" AS ENUM ('Simple', 'Martial', 'Advanced', 'MataHombresDeArena');

-- CreateEnum
CREATE TYPE "WeaponDamageType" AS ENUM ('Bludgeoning', 'Slashing', 'Piercing');

-- CreateEnum
CREATE TYPE "WeaponType" AS ENUM ('Melee', 'Ranged');

-- CreateEnum
CREATE TYPE "WeaponHands" AS ENUM ('One', 'Two', 'Both');

-- CreateTable
CREATE TABLE "WeaponBase" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "category" "WeaponCategory" NOT NULL,
    "ancestry" TEXT,
    "damageType" "WeaponDamageType"[],
    "diceAmount" INTEGER NOT NULL,
    "diceSize" INTEGER NOT NULL,
    "criticalDiceAmount" INTEGER,
    "criticalDiceSize" INTEGER,
    "weaponGroupId" TEXT NOT NULL,
    "hands" "WeaponHands" NOT NULL,
    "range" INTEGER NOT NULL,

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
CREATE TABLE "WeaponTrait" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,

    CONSTRAINT "WeaponTrait_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeaponCriticalSpecialization" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,

    CONSTRAINT "WeaponCriticalSpecialization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_WeaponBaseToWeaponTrait" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_WeaponBaseToWeaponTrait_AB_unique" ON "_WeaponBaseToWeaponTrait"("A", "B");

-- CreateIndex
CREATE INDEX "_WeaponBaseToWeaponTrait_B_index" ON "_WeaponBaseToWeaponTrait"("B");

-- AddForeignKey
ALTER TABLE "WeaponBase" ADD CONSTRAINT "WeaponBase_weaponGroupId_fkey" FOREIGN KEY ("weaponGroupId") REFERENCES "WeaponGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeaponGroup" ADD CONSTRAINT "WeaponGroup_weaponCriticalSpecializationId_fkey" FOREIGN KEY ("weaponCriticalSpecializationId") REFERENCES "WeaponCriticalSpecialization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WeaponBaseToWeaponTrait" ADD CONSTRAINT "_WeaponBaseToWeaponTrait_A_fkey" FOREIGN KEY ("A") REFERENCES "WeaponBase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WeaponBaseToWeaponTrait" ADD CONSTRAINT "_WeaponBaseToWeaponTrait_B_fkey" FOREIGN KEY ("B") REFERENCES "WeaponTrait"("id") ON DELETE CASCADE ON UPDATE CASCADE;
