-- CreateTable
CREATE TABLE "Ritual" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "rarity" "Rarity" NOT NULL,
    "castTime" TEXT NOT NULL,
    "cost" TEXT,
    "primaryCheck" TEXT NOT NULL,
    "secondaryCasters" INTEGER NOT NULL DEFAULT 0,
    "range" TEXT,
    "targets" TEXT,
    "duration" TEXT,
    "criticalSuccess" TEXT,
    "success" TEXT,
    "failure" TEXT,
    "criticalFailure" TEXT,

    CONSTRAINT "Ritual_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RitualHeightening" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "ritualId" TEXT NOT NULL,
    "fixedRank" INTEGER NOT NULL,
    "effect" TEXT NOT NULL,

    CONSTRAINT "RitualHeightening_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RitualToTrait" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RitualToTrait_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_RitualToSkill" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RitualToSkill_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "Ritual_rank_idx" ON "Ritual"("rank");

-- CreateIndex
CREATE INDEX "RitualHeightening_ritualId_idx" ON "RitualHeightening"("ritualId");

-- CreateIndex
CREATE INDEX "_RitualToTrait_B_index" ON "_RitualToTrait"("B");

-- CreateIndex
CREATE INDEX "_RitualToSkill_B_index" ON "_RitualToSkill"("B");

-- AddForeignKey
ALTER TABLE "RitualHeightening" ADD CONSTRAINT "RitualHeightening_ritualId_fkey" FOREIGN KEY ("ritualId") REFERENCES "Ritual"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RitualToTrait" ADD CONSTRAINT "_RitualToTrait_A_fkey" FOREIGN KEY ("A") REFERENCES "Ritual"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RitualToTrait" ADD CONSTRAINT "_RitualToTrait_B_fkey" FOREIGN KEY ("B") REFERENCES "Trait"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RitualToSkill" ADD CONSTRAINT "_RitualToSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "Ritual"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RitualToSkill" ADD CONSTRAINT "_RitualToSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
