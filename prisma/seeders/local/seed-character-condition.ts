import prisma from "../../../src/integrations/prisma/prisma-client";
import { conditionIds } from "./seed-condition";

export const characterConditionIds = {
  frightened2Sourced:  "cm8chrcond000000000000001",
  prone:               "cm8chrcond000000000000002",
  slowed1Future:       "cm8chrcond000000000000003",
  frightened3Expired:  "cm8chrcond000000000000004",
};

export const seedLocalCharacterConditions = async (): Promise<{
  characterConditionIds: typeof characterConditionIds;
}> => {
  const characters = await prisma.character.findMany({
    select: { id: true },
    take: 2,
    orderBy: { createdAt: "asc" },
  });

  if (characters.length < 1) {
    console.warn("No seed characters found — skipping CharacterCondition seed.");
    return { characterConditionIds };
  }

  const char1 = characters[0];
  const char2 = characters[1] ?? characters[0];

  const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const pastDate = new Date("2024-01-01T00:00:00.000Z");

  await prisma.$transaction([
    // Valued + sourced, no expiry
    prisma.characterCondition.create({
      data: {
        id: characterConditionIds.frightened2Sourced,
        characterId: char1.id,
        conditionId: conditionIds.frightened,
        value: 2,
        source: "Intimidation critical success",
      },
    }),
    // Valueless condition, no source
    prisma.characterCondition.create({
      data: {
        id: characterConditionIds.prone,
        characterId: char1.id,
        conditionId: conditionIds.prone,
      },
    }),
    // Valued, expires in the future
    prisma.characterCondition.create({
      data: {
        id: characterConditionIds.slowed1Future,
        characterId: char2.id,
        conditionId: conditionIds.slowed,
        value: 1,
        source: "Web spell",
        expiresAt: futureDate,
      },
    }),
    // Valued, already expired (for currentlyActive filter testing)
    prisma.characterCondition.create({
      data: {
        id: characterConditionIds.frightened3Expired,
        characterId: char2.id,
        conditionId: conditionIds.frightened,
        value: 3,
        expiresAt: pastDate,
      },
    }),
  ]);

  return { characterConditionIds };
};
