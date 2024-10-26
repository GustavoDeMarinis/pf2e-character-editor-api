import { faker } from "@faker-js/faker";
import {
  Attributes,
  Character,
  CharacterClass,
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
import { weaponGroupIds } from "../utils/global-const";

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
  const character: Character = {
    id: partialCharacter?.id ?? cuid(),
    createdAt: partialCharacter?.createdAt ?? new Date(),
    updatedAt: partialCharacter?.updatedAt ?? new Date(),
    deletedAt: partialCharacter?.createdAt ?? null,
    characterName: partialCharacter?.characterName ?? faker.internet.userName(),
    characterClassId: partialCharacter?.characterClassId ?? cuid(),
    ancestry: partialCharacter?.ancestry ?? faker.hacker.verb(),
    background: partialCharacter?.background ?? faker.hacker.verb(),
    createdByUserId: partialCharacter?.createdByUserId ?? cuid(),
    assignedUserId: partialCharacter?.assignedUserId ?? cuid(),
    level: partialCharacter?.level ?? Math.floor(Math.random() * 20),
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
    keyAttributes: partialCharacterClass?.keyAttributes ?? [
      Attributes.Strength,
    ],
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
