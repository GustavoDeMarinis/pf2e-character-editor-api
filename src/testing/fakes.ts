import { faker } from "@faker-js/faker";
import { Character } from "@prisma/client";
import cuid from "cuid";

export const getFakeCharacter = (
  partialCharacter?: Partial<Character>
): Character => {
  const character: Character = {
    id: partialCharacter?.characterName ?? cuid(),
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
