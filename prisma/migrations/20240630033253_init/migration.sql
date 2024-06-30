-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "characterName" TEXT NOT NULL,
    "playerName" TEXT,
    "ancestry" TEXT,
    "characterClass" TEXT,
    "background" TEXT,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);
