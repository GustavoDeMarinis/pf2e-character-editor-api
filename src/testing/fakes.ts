import { faker } from "@faker-js/faker";
import {
  ActionCost,
  Ancestry,
  AncestrySize,
  ArmorBase,
  ArmorCategory,
  Attribute,
  Background,
  Character,
  CharacterClass,
  CharacterFeat,
  CharacterSpell,
  Deity,
  DeitySanctification,
  DivineFont,
  Domain,
  Feat,
  FeatType,
  FocusSpellGrant,
  HeighteningKind,
  Heritage,
  Language,
  Rarity,
  Ritual,
  RitualHeightening,
  Spell,
  SpellArea,
  SpellComponent,
  SpellHeightening,
  SpellSaveType,
  SpellTargetType,
  SpellTradition,
  Trait,
  User,
  UserRole,
  WeaponBase,
  WeaponCategory,
  WeaponDamageType,
  WeaponHands,
} from "@prisma/client";

import cuid from "cuid";
import { AuthPayload } from "../middleware/security/authorization";
import { config } from "../config";
import { armorGroupIds, weaponGroupIds } from "../utils/global-const";

export function getFakeCurrentUserAuthorization(
  partialCurrentUserAuthorization?: Partial<AuthPayload>
): AuthPayload {
  const currentUserAuthorization: AuthPayload = {
    userId: partialCurrentUserAuthorization?.userId ?? cuid(),
    role: partialCurrentUserAuthorization?.role ?? UserRole.Admin,
    sessionId: partialCurrentUserAuthorization?.sessionId ?? cuid(),
  };
  return currentUserAuthorization;
}

export const getFakeCharacter = (
  partialCharacter?: Partial<Character>
): Character => {
  const LEVEL = Math.floor(Math.random() * 20);
  const character: Character = {
    id: partialCharacter?.id ?? cuid(),
    createdAt: partialCharacter?.createdAt ?? new Date(),
    updatedAt: partialCharacter?.updatedAt ?? new Date(),
    deletedAt: partialCharacter?.createdAt ?? null,
    characterName: partialCharacter?.characterName ?? faker.internet.userName(),
    characterClassId: partialCharacter?.characterClassId ?? cuid(),
    ancestryId: partialCharacter?.ancestryId ?? cuid(),
    backgroundId: partialCharacter?.backgroundId ?? null,
    createdByUserId: partialCharacter?.createdByUserId ?? cuid(),
    assignedUserId: partialCharacter?.assignedUserId ?? cuid(),
    level: partialCharacter?.level ?? LEVEL,
    ancestryBoost: partialCharacter?.ancestryBoost ?? [Attribute.Strength],
    ancestryFlaw: partialCharacter?.ancestryFlaw ?? [Attribute.Strength],
    backgroundBoost: partialCharacter?.backgroundBoost ?? [Attribute.Strength],
    classBoost: partialCharacter?.classBoost ?? Attribute.Strength,
    heritageId: partialCharacter?.heritageId ?? null,
    deityId: partialCharacter?.deityId ?? null,
  };
  return character;
};

export const getFakeHeritage = (
  partialHeritage?: Partial<Heritage>
): Heritage => {
  const heritage: Heritage = {
    id: partialHeritage?.id ?? cuid(),
    createdAt: partialHeritage?.createdAt ?? new Date(),
    updatedAt: partialHeritage?.updatedAt ?? new Date(),
    deletedAt: partialHeritage?.deletedAt ?? null,
    name: partialHeritage?.name ?? faker.word.noun(),
    description: partialHeritage?.description ?? "",
    ancestryId: partialHeritage?.ancestryId ?? cuid(),
    rarity: partialHeritage?.rarity ?? Rarity.Common,
  };
  return heritage;
};

export const getFakeUser = (partialUser?: Partial<User>): User => {
  const user: User = {
    id: partialUser?.id ?? cuid(),
    createdAt: partialUser?.createdAt ?? new Date(),
    updatedAt: partialUser?.updatedAt ?? new Date(),
    deletedAt: partialUser?.createdAt ?? null,
    userEmail: partialUser?.userEmail ?? faker.internet.email(),
    userName: partialUser?.userName ?? faker.internet.userName(),
    password: partialUser?.password ?? config.USER_DEFAULT_PASSWORD,
    role: partialUser?.role ?? UserRole.Player,
    failedLoginAttempts: partialUser?.failedLoginAttempts ?? 0,
    lockedUntil: partialUser?.lockedUntil ?? null,
  };
  return user;
};

export const getFakeCharacterClass = (
  partialCharacterClass?: Partial<CharacterClass>
): CharacterClass => {
  const characterClass: CharacterClass = {
    id: partialCharacterClass?.id ?? cuid(),
    createdAt: partialCharacterClass?.createdAt ?? new Date(),
    updatedAt: partialCharacterClass?.updatedAt ?? new Date(),
    deletedAt: partialCharacterClass?.createdAt ?? null,
    className: partialCharacterClass?.className ?? faker.internet.userName(),
    description: partialCharacterClass?.description ?? "",
    hitPoints: partialCharacterClass?.hitPoints ?? 8,
    keyAttributes: partialCharacterClass?.keyAttributes ?? [Attribute.Strength],
  };
  return characterClass;
};

export const getFakeWeaponBase = (
  partialWeaponBase?: Partial<WeaponBase>
): WeaponBase => {
  const weaponBase: WeaponBase = {
    id: partialWeaponBase?.id ?? cuid(),
    createdAt: partialWeaponBase?.createdAt ?? new Date(),
    updatedAt: partialWeaponBase?.updatedAt ?? new Date(),
    deletedAt: partialWeaponBase?.deletedAt ?? null,
    name: partialWeaponBase?.name ?? faker.word.noun(),
    description: partialWeaponBase?.description ?? "",
    category: partialWeaponBase?.category ?? WeaponCategory.Simple,
    damageTypes: partialWeaponBase?.damageTypes ?? [
      WeaponDamageType.Bludgeoning,
    ],
    diceAmount: partialWeaponBase?.diceAmount ?? 1,
    diceSize: partialWeaponBase?.diceSize ?? 8,
    criticalDiceAmount: partialWeaponBase?.criticalDiceAmount ?? null,
    criticalDiceSize: partialWeaponBase?.criticalDiceSize ?? null,
    hands: partialWeaponBase?.hands ?? [WeaponHands.One],
    range: partialWeaponBase?.range ?? null,
    weaponGroupId: partialWeaponBase?.weaponGroupId ?? weaponGroupIds.flail,
    bulk: partialWeaponBase?.bulk ?? "L",
  };

  return weaponBase;
};

export const getFakeArmorBase = (
  partialArmorBase?: Partial<ArmorBase>
): ArmorBase => {
  const armorBase: ArmorBase = {
    id: partialArmorBase?.id ?? cuid(),
    createdAt: partialArmorBase?.createdAt ?? new Date(),
    updatedAt: partialArmorBase?.updatedAt ?? new Date(),
    deletedAt: partialArmorBase?.deletedAt ?? null,
    name: partialArmorBase?.name ?? faker.word.noun(),
    description: partialArmorBase?.description ?? "",
    armorClass: partialArmorBase?.armorClass ?? 0,
    dexCap: partialArmorBase?.dexCap ?? 0,
    checkPenalty: partialArmorBase?.checkPenalty ?? 0,
    speedPenalty: partialArmorBase?.speedPenalty ?? 0,
    strengthReq: partialArmorBase?.strengthReq ?? 0,
    armorGroupId: partialArmorBase?.armorGroupId ?? armorGroupIds.cloth,
    category: partialArmorBase?.category ?? ArmorCategory.Light,
    price: 0,
    bulk: "1",
    rarity: Rarity.Common,
  };
  return armorBase;
};

export const getFakeAncestry = (
  partialAncestry?: Partial<Ancestry>
): Ancestry => {
  const ancestry: Ancestry = {
    id: partialAncestry?.id ?? cuid(),
    createdAt: partialAncestry?.createdAt ?? new Date(),
    updatedAt: partialAncestry?.updatedAt ?? new Date(),
    deletedAt: partialAncestry?.deletedAt ?? null,
    name: partialAncestry?.name ?? faker.word.noun(),
    attributeBoost: partialAncestry?.attributeBoost ?? [Attribute.Charisma],
    attributeFlaw: partialAncestry?.attributeFlaw ?? [Attribute.Strength],
    description: partialAncestry?.description ?? "",
    hitPoints:
      partialAncestry?.hitPoints ?? faker.number.int({ min: 6, max: 12 }),
    rarity: partialAncestry?.rarity ?? Rarity.Common,
    size: partialAncestry?.size ?? AncestrySize.Medium,
    speed: partialAncestry?.speed ?? 25,
  };

  return ancestry;
};

export const getFakeTrait = (partialTrait?: Partial<Trait>): Trait => {
  const trait: Trait = {
    id: partialTrait?.id ?? cuid(),
    createdAt: partialTrait?.createdAt ?? new Date(),
    updatedAt: partialTrait?.updatedAt ?? new Date(),
    deletedAt: partialTrait?.deletedAt ?? null,
    name: partialTrait?.name ?? faker.word.noun(),
    description: partialTrait?.description ?? "",
  };
  return trait;
};

export const getFakeBackground = (
  partialBackground?: Partial<Background>
): Background => {
  const background: Background = {
    id: partialBackground?.id ?? cuid(),
    createdAt: partialBackground?.createdAt ?? new Date(),
    updatedAt: partialBackground?.updatedAt ?? new Date(),
    deletedAt: partialBackground?.deletedAt ?? null,
    name: partialBackground?.name ?? faker.word.noun(),
    description: partialBackground?.description ?? null,
    rarity: partialBackground?.rarity ?? Rarity.Common,
    attributeBoostOptions: partialBackground?.attributeBoostOptions ?? [Attribute.Wisdom],
    trainedSkillId: partialBackground?.trainedSkillId ?? null,
    trainedLoreName: partialBackground?.trainedLoreName ?? null,
  };
  return background;
};

export const getFakeDomain = (
  partialDomain?: Partial<Domain>
): Domain => {
  const domain: Domain = {
    id: partialDomain?.id ?? cuid(),
    createdAt: partialDomain?.createdAt ?? new Date(),
    updatedAt: partialDomain?.updatedAt ?? new Date(),
    deletedAt: partialDomain?.deletedAt ?? null,
    name: partialDomain?.name ?? faker.word.noun(),
    description: partialDomain?.description ?? null,
  };
  return domain;
};

export const getFakeDeity = (
  partialDeity?: Partial<Deity>
): Deity => {
  const deity: Deity = {
    id: partialDeity?.id ?? cuid(),
    createdAt: partialDeity?.createdAt ?? new Date(),
    updatedAt: partialDeity?.updatedAt ?? new Date(),
    deletedAt: partialDeity?.deletedAt ?? null,
    name: partialDeity?.name ?? faker.word.noun(),
    description: partialDeity?.description ?? null,
    rarity: partialDeity?.rarity ?? Rarity.Common,
    edicts: partialDeity?.edicts ?? [],
    anathema: partialDeity?.anathema ?? [],
    divineAttributes: partialDeity?.divineAttributes ?? [Attribute.Wisdom],
    sanctification: partialDeity?.sanctification ?? DeitySanctification.HolyOnly,
    divineFont: partialDeity?.divineFont ?? DivineFont.Heal,
    divineSkillId: partialDeity?.divineSkillId ?? null,
  };
  return deity;
};

export const getFakeLanguage = (
  partialLanguage?: Partial<Language>
): Language => {
  const language: Language = {
    id: partialLanguage?.id ?? cuid(),
    createdAt: partialLanguage?.createdAt ?? new Date(),
    updatedAt: partialLanguage?.updatedAt ?? new Date(),
    deletedAt: partialLanguage?.deletedAt ?? null,
    name: partialLanguage?.name ?? faker.word.noun(),
    description: partialLanguage?.description ?? "",
    rarity: partialLanguage?.rarity ?? Rarity.Common,
  };
  return language;
};

export const getFakeFeat = (partialFeat?: Partial<Feat>): Feat => {
  const feat: Feat = {
    id: partialFeat?.id ?? cuid(),
    createdAt: partialFeat?.createdAt ?? new Date(),
    updatedAt: partialFeat?.updatedAt ?? new Date(),
    deletedAt: partialFeat?.deletedAt ?? null,
    name: partialFeat?.name ?? faker.word.noun(),
    description: partialFeat?.description ?? faker.lorem.sentence(),
    featType: partialFeat?.featType ?? FeatType.General,
    level: partialFeat?.level ?? 1,
    actionCost: partialFeat?.actionCost ?? null,
    rarity: partialFeat?.rarity ?? Rarity.Common,
    prerequisites: partialFeat?.prerequisites ?? null,
    frequency: partialFeat?.frequency ?? null,
    trigger: partialFeat?.trigger ?? null,
    requirements: partialFeat?.requirements ?? null,
    ancestryId: partialFeat?.ancestryId ?? null,
    characterClassId: partialFeat?.characterClassId ?? null,
    skillId: partialFeat?.skillId ?? null,
  };
  return feat;
};

export const getFakeCharacterFeat = (
  partialCharacterFeat?: Partial<CharacterFeat>
): CharacterFeat => {
  const characterFeat: CharacterFeat = {
    id: partialCharacterFeat?.id ?? cuid(),
    createdAt: partialCharacterFeat?.createdAt ?? new Date(),
    updatedAt: partialCharacterFeat?.updatedAt ?? new Date(),
    deletedAt: partialCharacterFeat?.deletedAt ?? null,
    characterId: partialCharacterFeat?.characterId ?? cuid(),
    featId: partialCharacterFeat?.featId ?? cuid(),
    levelItWasTaken: partialCharacterFeat?.levelItWasTaken ?? 1,
    slotType: partialCharacterFeat?.slotType ?? FeatType.General,
  };
  return characterFeat;
};

export const getFakeSpell = (partialSpell?: Partial<Spell>): Spell => {
  const spell: Spell = {
    id: partialSpell?.id ?? cuid(),
    createdAt: partialSpell?.createdAt ?? new Date(),
    updatedAt: partialSpell?.updatedAt ?? new Date(),
    deletedAt: partialSpell?.deletedAt ?? null,
    name: partialSpell?.name ?? faker.word.noun(),
    description: partialSpell?.description ?? faker.lorem.sentence(),
    rank: partialSpell?.rank ?? 1,
    isFocus: partialSpell?.isFocus ?? false,
    traditions: partialSpell?.traditions ?? [SpellTradition.Arcane],
    rarity: partialSpell?.rarity ?? Rarity.Common,
    components: partialSpell?.components ?? [SpellComponent.Verbal],
    actionCost: partialSpell?.actionCost ?? ActionCost.One,
    castTimeText: partialSpell?.castTimeText ?? null,
    range: partialSpell?.range ?? null,
    targets: partialSpell?.targets ?? null,
    targetType: partialSpell?.targetType ?? SpellTargetType.None,
    areaType: partialSpell?.areaType ?? SpellArea.None,
    areaSize: partialSpell?.areaSize ?? null,
    duration: partialSpell?.duration ?? null,
    savingThrow: partialSpell?.savingThrow ?? SpellSaveType.None,
    basicSave: partialSpell?.basicSave ?? false,
  };
  return spell;
};

export const getFakeSpellHeightening = (
  partialHeightening?: Partial<SpellHeightening>
): SpellHeightening => {
  const heightening: SpellHeightening = {
    id: partialHeightening?.id ?? cuid(),
    createdAt: partialHeightening?.createdAt ?? new Date(),
    updatedAt: partialHeightening?.updatedAt ?? new Date(),
    deletedAt: partialHeightening?.deletedAt ?? null,
    spellId: partialHeightening?.spellId ?? cuid(),
    kind: partialHeightening?.kind ?? HeighteningKind.Interval,
    bump: partialHeightening?.bump ?? 1,
    effect: partialHeightening?.effect ?? faker.lorem.sentence(),
  };
  return heightening;
};

export const getFakeRitual = (partialRitual?: Partial<Ritual>): Ritual => {
  const ritual: Ritual = {
    id: partialRitual?.id ?? cuid(),
    createdAt: partialRitual?.createdAt ?? new Date(),
    updatedAt: partialRitual?.updatedAt ?? new Date(),
    deletedAt: partialRitual?.deletedAt ?? null,
    name: partialRitual?.name ?? faker.word.noun(),
    description: partialRitual?.description ?? faker.lorem.sentence(),
    rank: partialRitual?.rank ?? 5,
    rarity: partialRitual?.rarity ?? Rarity.Common,
    castTime: partialRitual?.castTime ?? "1 day",
    cost: partialRitual?.cost ?? null,
    primaryCheck: partialRitual?.primaryCheck ?? "Religion (master)",
    secondaryCasters: partialRitual?.secondaryCasters ?? 0,
    range: partialRitual?.range ?? null,
    targets: partialRitual?.targets ?? null,
    duration: partialRitual?.duration ?? null,
    criticalSuccess: partialRitual?.criticalSuccess ?? null,
    success: partialRitual?.success ?? null,
    failure: partialRitual?.failure ?? null,
    criticalFailure: partialRitual?.criticalFailure ?? null,
  };
  return ritual;
};

export const getFakeRitualHeightening = (
  partialHeightening?: Partial<RitualHeightening>
): RitualHeightening => {
  const heightening: RitualHeightening = {
    id: partialHeightening?.id ?? cuid(),
    createdAt: partialHeightening?.createdAt ?? new Date(),
    updatedAt: partialHeightening?.updatedAt ?? new Date(),
    deletedAt: partialHeightening?.deletedAt ?? null,
    ritualId: partialHeightening?.ritualId ?? cuid(),
    fixedRank: partialHeightening?.fixedRank ?? 5,
    effect: partialHeightening?.effect ?? faker.lorem.sentence(),
  };
  return heightening;
};

export const getFakeFocusSpellGrant = (
  partialFocusSpellGrant?: Partial<FocusSpellGrant>
): FocusSpellGrant => {
  const focusSpellGrant: FocusSpellGrant = {
    id: partialFocusSpellGrant?.id ?? cuid(),
    createdAt: partialFocusSpellGrant?.createdAt ?? new Date(),
    updatedAt: partialFocusSpellGrant?.updatedAt ?? new Date(),
    deletedAt: partialFocusSpellGrant?.deletedAt ?? null,
    spellId: partialFocusSpellGrant?.spellId ?? cuid(),
    characterClassId: partialFocusSpellGrant?.characterClassId ?? null,
    domainId: partialFocusSpellGrant?.domainId ?? null,
  };
  return focusSpellGrant;
};

export const getFakeCharacterSpell = (
  partialCharacterSpell?: Partial<CharacterSpell>
): CharacterSpell => {
  const characterSpell: CharacterSpell = {
    id: partialCharacterSpell?.id ?? cuid(),
    createdAt: partialCharacterSpell?.createdAt ?? new Date(),
    updatedAt: partialCharacterSpell?.updatedAt ?? new Date(),
    deletedAt: partialCharacterSpell?.deletedAt ?? null,
    characterId: partialCharacterSpell?.characterId ?? cuid(),
    spellId: partialCharacterSpell?.spellId ?? cuid(),
    isPrepared: partialCharacterSpell?.isPrepared ?? false,
    preparedAtRank: partialCharacterSpell?.preparedAtRank ?? null,
  };
  return characterSpell;
};
