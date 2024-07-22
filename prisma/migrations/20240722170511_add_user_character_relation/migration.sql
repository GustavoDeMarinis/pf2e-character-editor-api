/*
  Warnings:

  - You are about to drop the column `playerName` on the `Character` table. All the data in the column will be lost.
  - Added the required column `assignedUserId` to the `Character` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdByUserId` to the `Character` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Character" DROP COLUMN "playerName",
ADD COLUMN     "assignedUserId" TEXT NOT NULL,
ADD COLUMN     "createdByUserId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
