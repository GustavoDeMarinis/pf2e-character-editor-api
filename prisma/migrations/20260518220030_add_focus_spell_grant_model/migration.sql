-- CreateTable
CREATE TABLE "FocusSpellGrant" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "spellId" TEXT NOT NULL,
    "characterClassId" TEXT,
    "domainId" TEXT,

    CONSTRAINT "FocusSpellGrant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FocusSpellGrant_spellId_idx" ON "FocusSpellGrant"("spellId");

-- CreateIndex
CREATE INDEX "FocusSpellGrant_characterClassId_idx" ON "FocusSpellGrant"("characterClassId");

-- CreateIndex
CREATE INDEX "FocusSpellGrant_domainId_idx" ON "FocusSpellGrant"("domainId");

-- AddForeignKey
ALTER TABLE "FocusSpellGrant" ADD CONSTRAINT "FocusSpellGrant_spellId_fkey" FOREIGN KEY ("spellId") REFERENCES "Spell"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FocusSpellGrant" ADD CONSTRAINT "FocusSpellGrant_characterClassId_fkey" FOREIGN KEY ("characterClassId") REFERENCES "CharacterClass"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FocusSpellGrant" ADD CONSTRAINT "FocusSpellGrant_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE SET NULL ON UPDATE CASCADE;
