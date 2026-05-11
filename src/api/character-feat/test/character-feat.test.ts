import { FeatType, UserRole } from "@prisma/client";
import {
  getFakeCharacter,
  getFakeCharacterFeat,
  getFakeCurrentUserAuthorization,
  getFakeFeat,
} from "../../../testing/fakes";
import { prismaMock } from "../../../testing/mock-prisma";
import { ErrorCode } from "../../../utils/shared-types";
import {
  assignFeatToCharacter,
  listCharacterFeats,
  removeFeatFromCharacter,
} from "../character-feat";

describe("CharacterFeat tests", () => {
  describe("List Character Feats", () => {
    test("listCharacterFeats returns active assignments", async () => {
      const fakeCharacterFeat = getFakeCharacterFeat();
      prismaMock.characterFeat.findMany.mockResolvedValue([fakeCharacterFeat]);

      const result = await listCharacterFeats(fakeCharacterFeat.characterId);

      expect(result).toStrictEqual({
        items: [fakeCharacterFeat],
        count: 1,
      });
    });
  });

  describe("Assign Feat to Character", () => {
    test("assignFeatToCharacter creates and returns the assignment (Admin)", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      const fakeCharacter = getFakeCharacter();
      const fakeFeat = getFakeFeat({ featType: FeatType.Class });
      const fakeCharacterFeat = getFakeCharacterFeat({
        characterId: fakeCharacter.id,
        featId: fakeFeat.id,
        slotType: FeatType.Class,
      });

      prismaMock.character.findUnique.mockResolvedValue(fakeCharacter);
      prismaMock.feat.findUnique.mockResolvedValue(fakeFeat);
      prismaMock.characterFeat.findFirst.mockResolvedValue(null);
      prismaMock.characterFeat.create.mockResolvedValue(fakeCharacterFeat);

      const result = await assignFeatToCharacter(
        fakeCharacter.id,
        { featId: fakeFeat.id, levelItWasTaken: 1, slotType: FeatType.Class },
        adminAuth
      );

      expect(prismaMock.characterFeat.create).toHaveBeenCalledTimes(1);
      expect(result).toBe(fakeCharacterFeat);
    });

    test("assignFeatToCharacter returns 404 when character not found", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      prismaMock.character.findUnique.mockResolvedValue(null);

      const result = await assignFeatToCharacter(
        "missing-character-id",
        { featId: "feat-id", levelItWasTaken: 1, slotType: FeatType.General },
        adminAuth
      );

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Character not found",
      });
      expect(prismaMock.characterFeat.create).not.toHaveBeenCalled();
    });

    test("assignFeatToCharacter returns 404 when feat not found", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      const fakeCharacter = getFakeCharacter();

      prismaMock.character.findUnique.mockResolvedValue(fakeCharacter);
      prismaMock.feat.findUnique.mockResolvedValue(null);

      const result = await assignFeatToCharacter(
        fakeCharacter.id,
        { featId: "missing-feat-id", levelItWasTaken: 1, slotType: FeatType.General },
        adminAuth
      );

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Feat not found",
      });
      expect(prismaMock.characterFeat.create).not.toHaveBeenCalled();
    });

    test("assignFeatToCharacter returns 409 when feat already actively assigned", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      const fakeCharacter = getFakeCharacter();
      const fakeFeat = getFakeFeat();
      const existing = getFakeCharacterFeat({
        characterId: fakeCharacter.id,
        featId: fakeFeat.id,
        deletedAt: null,
      });

      prismaMock.character.findUnique.mockResolvedValue(fakeCharacter);
      prismaMock.feat.findUnique.mockResolvedValue(fakeFeat);
      prismaMock.characterFeat.findFirst.mockResolvedValue(existing);

      const result = await assignFeatToCharacter(
        fakeCharacter.id,
        { featId: fakeFeat.id, levelItWasTaken: 1, slotType: FeatType.General },
        adminAuth
      );

      expect(result).toStrictEqual({
        code: ErrorCode.DataConflict,
        message: "This feat is already assigned to this character",
      });
      expect(prismaMock.characterFeat.create).not.toHaveBeenCalled();
    });

    test("assignFeatToCharacter reactivates a soft-deleted assignment", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      const fakeCharacter = getFakeCharacter();
      const fakeFeat = getFakeFeat();
      const softDeleted = getFakeCharacterFeat({
        characterId: fakeCharacter.id,
        featId: fakeFeat.id,
        deletedAt: new Date(),
      });
      const reactivated = { ...softDeleted, deletedAt: null, levelItWasTaken: 3 };

      prismaMock.character.findUnique.mockResolvedValue(fakeCharacter);
      prismaMock.feat.findUnique.mockResolvedValue(fakeFeat);
      prismaMock.characterFeat.findFirst.mockResolvedValue(softDeleted);
      prismaMock.characterFeat.update.mockResolvedValue(reactivated);

      const result = await assignFeatToCharacter(
        fakeCharacter.id,
        { featId: fakeFeat.id, levelItWasTaken: 3, slotType: FeatType.General },
        adminAuth
      );

      expect(prismaMock.characterFeat.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.characterFeat.create).not.toHaveBeenCalled();
      expect(result).toStrictEqual(reactivated);
    });

    test("assignFeatToCharacter returns 403 when Player is not owner", async () => {
      const playerId = "player-user-id";
      const playerAuth = getFakeCurrentUserAuthorization({
        role: UserRole.Player,
        userId: playerId,
      });
      const fakeCharacter = getFakeCharacter({
        createdByUserId: "other-user-id",
        assignedUserId: "other-user-id",
      });

      prismaMock.character.findUnique.mockResolvedValue(fakeCharacter);

      const result = await assignFeatToCharacter(
        fakeCharacter.id,
        { featId: "feat-id", levelItWasTaken: 1, slotType: FeatType.General },
        playerAuth
      );

      expect(result).toStrictEqual({
        code: ErrorCode.Forbidden,
        message: "Access denied",
      });
      expect(prismaMock.characterFeat.create).not.toHaveBeenCalled();
    });
  });

  describe("Remove Feat from Character", () => {
    test("removeFeatFromCharacter soft-deletes the assignment", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      const fakeCharacterFeat = getFakeCharacterFeat({ deletedAt: null });
      const deletedAt = new Date();

      prismaMock.characterFeat.findUnique.mockResolvedValue(fakeCharacterFeat);
      prismaMock.characterFeat.update.mockResolvedValue({
        ...fakeCharacterFeat,
        deletedAt,
      });

      const result = await removeFeatFromCharacter(
        {
          characterId: fakeCharacterFeat.characterId,
          characterFeatId: fakeCharacterFeat.id,
        },
        adminAuth
      );

      expect(prismaMock.characterFeat.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ deletedAt: expect.any(Date) }),
        })
      );
      expect(prismaMock.character.findUnique).not.toHaveBeenCalled();
      expect((result as typeof fakeCharacterFeat).deletedAt).toBeTruthy();
    });

    test("removeFeatFromCharacter returns 404 when assignment not found", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      prismaMock.characterFeat.findUnique.mockResolvedValue(null);

      const result = await removeFeatFromCharacter(
        { characterId: "char-id", characterFeatId: "nonexistent" },
        adminAuth
      );

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Character feat assignment Not Found",
      });
      expect(prismaMock.characterFeat.update).not.toHaveBeenCalled();
    });

    test("removeFeatFromCharacter returns 404 when assignment already deleted", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      const fakeCharacterFeat = getFakeCharacterFeat({ deletedAt: new Date() });
      prismaMock.characterFeat.findUnique.mockResolvedValue(fakeCharacterFeat);

      const result = await removeFeatFromCharacter(
        {
          characterId: fakeCharacterFeat.characterId,
          characterFeatId: fakeCharacterFeat.id,
        },
        adminAuth
      );

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Character feat assignment Not Found",
      });
      expect(prismaMock.characterFeat.update).not.toHaveBeenCalled();
    });

    test("removeFeatFromCharacter returns 403 when Player is not owner", async () => {
      const playerId = "player-user-id";
      const playerAuth = getFakeCurrentUserAuthorization({
        role: UserRole.Player,
        userId: playerId,
      });
      const fakeCharacter = getFakeCharacter({
        createdByUserId: "other-user-id",
        assignedUserId: "other-user-id",
      });

      prismaMock.character.findUnique.mockResolvedValue(fakeCharacter);

      const result = await removeFeatFromCharacter(
        { characterId: fakeCharacter.id, characterFeatId: "some-feat-id" },
        playerAuth
      );

      expect(result).toStrictEqual({
        code: ErrorCode.Forbidden,
        message: "Access denied",
      });
      expect(prismaMock.characterFeat.findUnique).not.toHaveBeenCalled();
      expect(prismaMock.characterFeat.update).not.toHaveBeenCalled();
    });
  });
});
