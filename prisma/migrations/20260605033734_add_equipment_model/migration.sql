-- CreateEnum
CREATE TYPE "ItemUsage" AS ENUM ('Held', 'Worn', 'Stowed', 'Affixed');

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "level" INTEGER NOT NULL DEFAULT 0,
    "price" INTEGER NOT NULL,
    "bulk" TEXT NOT NULL,
    "hands" INTEGER,
    "usage" "ItemUsage" NOT NULL,
    "rarity" "Rarity" NOT NULL,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EquipmentToTrait" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EquipmentToTrait_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "Equipment_level_idx" ON "Equipment"("level");

-- CreateIndex
CREATE INDEX "_EquipmentToTrait_B_index" ON "_EquipmentToTrait"("B");

-- AddForeignKey
ALTER TABLE "_EquipmentToTrait" ADD CONSTRAINT "_EquipmentToTrait_A_fkey" FOREIGN KEY ("A") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EquipmentToTrait" ADD CONSTRAINT "_EquipmentToTrait_B_fkey" FOREIGN KEY ("B") REFERENCES "Trait"("id") ON DELETE CASCADE ON UPDATE CASCADE;
