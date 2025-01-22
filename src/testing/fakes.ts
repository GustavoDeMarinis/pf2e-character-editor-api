import { faker } from "@faker-js/faker";
import {
  Ancestry,
  AncestrySize,
  ArmorBase,
  ArmorCategory,
  Attribute,
  Character,
  CharacterClass,
  Language,
  Rarity,
  Trait,
  User,
  UserRole,
  WeaponBase,
  WeaponCategory,
  WeaponDamageType,
  WeaponHands,
} from "@prisma/client";

import cuid from "cuid";
import { CurrentUserAuthorization } from "../middleware/security/authorization";
import { config } from "../config";
import { armorGroupIds, weaponGroupIds } from "../utils/global-const";

export function getFakeCurrentUserAuthorization(
  partialCurrentUserAuthorization?: Partial<CurrentUserAuthorization>
): CurrentUserAuthorization {
  const currentUserAuthorization: CurrentUserAuthorization = {
    userId: partialCurrentUserAuthorization?.userId ?? cuid(),
    role: partialCurrentUserAuthorization?.role ?? UserRole.Admin,
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
    background: partialCharacter?.background ?? faker.hacker.verb(),
    createdByUserId: partialCharacter?.createdByUserId ?? cuid(),
    assignedUserId: partialCharacter?.assignedUserId ?? cuid(),
    level: partialCharacter?.level ?? LEVEL,
    ancestryBoost: partialCharacter?.ancestryBoost ?? [Attribute.Strength],
    ancestryFlaw: partialCharacter?.ancestryFlaw ?? [Attribute.Strength],
    backgroundBoost: partialCharacter?.backgroundBoost ?? [Attribute.Strength],
    classBoost: partialCharacter?.classBoost ?? Attribute.Strength,
    classDc: partialCharacter?.classDc ?? LEVEL + 10 + 3 + 4,
  };
  return character;
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
