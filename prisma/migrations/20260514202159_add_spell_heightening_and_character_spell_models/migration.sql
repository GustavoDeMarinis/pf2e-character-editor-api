-- CreateEnum
CREATE TYPE "SpellTradition" AS ENUM ('Arcane', 'Divine', 'Occult', 'Primal');

-- CreateEnum
CREATE TYPE "SpellComponent" AS ENUM ('Verbal', 'Somatic', 'Material', 'Focus');

-- CreateEnum
CREATE TYPE "SpellTargetType" AS ENUM ('None', 'Creature', 'Object', 'Area', 'Self');

-- CreateEnum
CREATE TYPE "SpellSaveType" AS ENUM ('Fortitude', 'Reflex', 'Will', 'None');

-- CreateEnum
CREATE TYPE "SpellArea" AS ENUM ('Burst', 'Cone', 'Line', 'Emanation', 'Cylinder', 'None');

-- CreateEnum
CREATE TYPE "HeighteningKind" AS ENUM ('Interval', 'FixedRank');

-- CreateTable
CREATE TABLE "Spell" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "isFocus" BOOLEAN NOT NULL DEFAULT false,
    "traditions" "SpellTradition"[],
    "rarity" "Rarity" NOT NULL,
    "components" "SpellComponent"[],
    "actionCost" "ActionCost" NOT NULL,
    "castTimeText" TEXT,
    "range" TEXT,
    "targets" TEXT,
    "targetType" "SpellTargetType" NOT NULL,
    "areaType" "SpellArea" NOT NULL,
    "areaSize" INTEGER,
    "duration" TEXT,
    "savingThrow" "SpellSaveType" NOT NULL,
    "basicSave" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Spell_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpellHeightening" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "spellId" TEXT NOT NULL,
    "kind" "HeighteningKind" NOT NULL,
    "bump" INTEGER NOT NULL,
    "effect" TEXT NOT NULL,

    CONSTRAINT "SpellHeightening_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterSpell" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "characterId" TEXT NOT NULL,
    "spellId" TEXT NOT NULL,
    "isPrepared" BOOLEAN NOT NULL DEFAULT false,
    "preparedAtRank" INTEGER,

    CONSTRAINT "CharacterSpell_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SpellToTrait" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SpellToTrait_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "Spell_rank_idx" ON "Spell"("rank");

-- CreateIndex
CREATE INDEX "Spell_isFocus_idx" ON "Spell"("isFocus");

-- CreateIndex
CREATE INDEX "SpellHeightening_spellId_idx" ON "SpellHeightening"("spellId");

-- CreateIndex
CREATE INDEX "CharacterSpell_characterId_idx" ON "CharacterSpell"("characterId");

-- CreateIndex
CREATE UNIQUE INDEX "CharacterSpell_characterId_spellId_preparedAtRank_key" ON "CharacterSpell"("characterId", "spellId", "preparedAtRank");

-- CreateIndex
-- Partial unique index: prevents duplicate "known" spells (preparedAtRank IS NULL),
-- which the composite unique above cannot enforce because Postgres treats NULLs as distinct.
CREATE UNIQUE INDEX "CharacterSpell_known_unique" ON "CharacterSpell"("characterId", "spellId") WHERE "preparedAtRank" IS NULL;

-- CreateIndex
CREATE INDEX "_SpellToTrait_B_index" ON "_SpellToTrait"("B");

-- AddForeignKey
ALTER TABLE "SpellHeightening" ADD CONSTRAINT "SpellHeightening_spellId_fkey" FOREIGN KEY ("spellId") REFERENCES "Spell"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterSpell" ADD CONSTRAINT "CharacterSpell_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterSpell" ADD CONSTRAINT "CharacterSpell_spellId_fkey" FOREIGN KEY ("spellId") REFERENCES "Spell"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpellToTrait" ADD CONSTRAINT "_SpellToTrait_A_fkey" FOREIGN KEY ("A") REFERENCES "Spell"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpellToTrait" ADD CONSTRAINT "_SpellToTrait_B_fkey" FOREIGN KEY ("B") REFERENCES "Trait"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill: DeityClericSpell.spellId FK + index. The column was created in 20260427223536
-- but the Spell table didn't exist yet, so the constraint is added here.
-- CreateIndex
CREATE INDEX "DeityClericSpell_spellId_idx" ON "DeityClericSpell"("spellId");

-- AddForeignKey
ALTER TABLE "DeityClericSpell" ADD CONSTRAINT "DeityClericSpell_spellId_fkey" FOREIGN KEY ("spellId") REFERENCES "Spell"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
