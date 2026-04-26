/*
  Warnings:

  - Added the required column `heritageId` to the `Character` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "heritageId" TEXT;

-- CreateTable
CREATE TABLE "Heritage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ancestryId" TEXT NOT NULL,
    "rarity" "Rarity" NOT NULL,

    CONSTRAINT "Heritage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_HeritageToTrait" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_HeritageToTrait_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "Heritage_ancestryId_idx" ON "Heritage"("ancestryId");

-- CreateIndex
CREATE INDEX "_HeritageToTrait_B_index" ON "_HeritageToTrait"("B");

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_heritageId_fkey" FOREIGN KEY ("heritageId") REFERENCES "Heritage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Heritage" ADD CONSTRAINT "Heritage_ancestryId_fkey" FOREIGN KEY ("ancestryId") REFERENCES "Ancestry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HeritageToTrait" ADD CONSTRAINT "_HeritageToTrait_A_fkey" FOREIGN KEY ("A") REFERENCES "Heritage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HeritageToTrait" ADD CONSTRAINT "_HeritageToTrait_B_fkey" FOREIGN KEY ("B") REFERENCES "Trait"("id") ON DELETE CASCADE ON UPDATE CASCADE;
