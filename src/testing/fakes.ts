import { faker } from "@faker-js/faker";
import { Character, User, UserRole } from "@prisma/client";
import cuid from "cuid";
import { CurrentUserAuthorization } from "../middleware/security/authorization";

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
    characterClass: partialCharacter?.characterClass ?? faker.hacker.verb(),
    ancestry: partialCharacter?.characterClass ?? faker.hacker.verb(),
    background: partialCharacter?.characterClass ?? faker.hacker.verb(),
    playerName: partialCharacter?.characterName ?? faker.internet.userName(),
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
    password: partialUser?.password ?? "@1234567",
    role: partialUser?.role ?? UserRole.Player,
  };
  return user;
};
