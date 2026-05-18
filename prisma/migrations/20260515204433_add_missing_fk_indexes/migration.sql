-- Backfill missing @@index on FK columns across legacy models.
-- New modules already include their FK indexes inline in the originating migration.

-- CreateIndex
CREATE INDEX "Character_ancestryId_idx" ON "Character"("ancestryId");

-- CreateIndex
CREATE INDEX "Character_backgroundId_idx" ON "Character"("backgroundId");

-- CreateIndex
CREATE INDEX "Character_createdByUserId_idx" ON "Character"("createdByUserId");

-- CreateIndex
CREATE INDEX "Character_assignedUserId_idx" ON "Character"("assignedUserId");

-- CreateIndex
CREATE INDEX "Character_characterClassId_idx" ON "Character"("characterClassId");

-- CreateIndex
CREATE INDEX "Character_heritageId_idx" ON "Character"("heritageId");

-- CreateIndex
CREATE INDEX "Character_deityId_idx" ON "Character"("deityId");

-- CreateIndex
CREATE INDEX "ClassLevelingMap_characterClassId_idx" ON "ClassLevelingMap"("characterClassId");

-- CreateIndex
CREATE INDEX "SpecialAbility_characterClassId_idx" ON "SpecialAbility"("characterClassId");

-- CreateIndex
CREATE INDEX "SpecialAbility_classLevelingMapId_idx" ON "SpecialAbility"("classLevelingMapId");

-- CreateIndex
CREATE INDEX "Action_skillId_idx" ON "Action"("skillId");

-- CreateIndex
CREATE INDEX "CharacterSkillLevel_characterId_idx" ON "CharacterSkillLevel"("characterId");

-- CreateIndex
CREATE INDEX "CharacterSkillLevel_skillId_idx" ON "CharacterSkillLevel"("skillId");

-- CreateIndex
CREATE INDEX "WeaponBase_weaponGroupId_idx" ON "WeaponBase"("weaponGroupId");

-- CreateIndex
CREATE INDEX "WeaponGroup_weaponCriticalSpecializationId_idx" ON "WeaponGroup"("weaponCriticalSpecializationId");

-- CreateIndex
CREATE INDEX "ArmorBase_armorGroupId_idx" ON "ArmorBase"("armorGroupId");

-- CreateIndex
CREATE INDEX "Feat_ancestryId_idx" ON "Feat"("ancestryId");

-- CreateIndex
CREATE INDEX "Feat_characterClassId_idx" ON "Feat"("characterClassId");

-- CreateIndex
CREATE INDEX "Feat_skillId_idx" ON "Feat"("skillId");
