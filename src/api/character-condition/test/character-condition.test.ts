import { UserRole } from "@prisma/client";
import {
  getFakeCharacter,
  getFakeCharacterCondition,
  getFakeCondition,
  getFakeCurrentUserAuthorization,
} from "../../../testing/fakes";
import { prismaMock } from "../../../testing/mock-prisma";
import { ErrorCode } from "../../../utils/shared-types";
import {
  applyConditionToCharacter,
  listCharacterConditions,
  removeConditionFromCharacter,
  updateCharacterCondition,
} from "../character-condition";

describe("CharacterCondition tests", () => {
  describe("List Character Conditions", () => {
    test("listCharacterConditions returns active assignments", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      const char = getFakeCharacter();
      const fakeCC = getFakeCharacterCondition({ characterId: char.id });

      prismaMock.character.findUnique.mockResolvedValue(char);
      prismaMock.characterCondition.findMany.mockResolvedValue([fakeCC]);

      const result = await listCharacterConditions(char.id, {}, adminAuth);

      expect(result).toStrictEqual({ items: [fakeCC], count: 1 });
    });

    test("listCharacterConditions returns empty list", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      const char = getFakeCharacter();

      prismaMock.character.findUnique.mockResolvedValue(char);
      prismaMock.characterCondition.findMany.mockResolvedValue([]);

      const result = await listCharacterConditions(char.id, {}, adminAuth);

      expect(result).toStrictEqual({ items: [], count: 0 });
    });

    test("listCharacterConditions returns 404 when character not found", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      prismaMock.character.findUnique.mockResolvedValue(null);

      const result = await listCharacterConditions("missing-char", {}, adminAuth);

      expect(result).toStrictEqual({ code: ErrorCode.NotFound, message: "Character not found" });
      expect(prismaMock.characterCondition.findMany).not.toHaveBeenCalled();
    });

    test("listCharacterConditions returns 403 when Player is not owner", async () => {
      const playerAuth = getFakeCurrentUserAuthorization({
        role: UserRole.Player,
        userId: "player-id",
      });
      const char = getFakeCharacter({ createdByUserId: "other-id", assignedUserId: "other-id" });

      prismaMock.character.findUnique.mockResolvedValue(char);

      const result = await listCharacterConditions(char.id, {}, playerAuth);

      expect(result).toStrictEqual({ code: ErrorCode.Forbidden, message: "Access denied" });
      expect(prismaMock.characterCondition.findMany).not.toHaveBeenCalled();
    });

    test("listCharacterConditions Admin bypasses ownership check", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      const char = getFakeCharacter({ createdByUserId: "other-id", assignedUserId: "other-id" });

      prismaMock.character.findUnique.mockResolvedValue(char);
      prismaMock.characterCondition.findMany.mockResolvedValue([]);

      const result = await listCharacterConditions(char.id, {}, adminAuth);

      expect(result).toStrictEqual({ items: [], count: 0 });
    });

    test("listCharacterConditions with currentlyActive=true adds expiresAt filter", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      const char = getFakeCharacter();

      prismaMock.character.findUnique.mockResolvedValue(char);
      prismaMock.characterCondition.findMany.mockResolvedValue([]);

      await listCharacterConditions(char.id, { currentlyActive: true }, adminAuth);

      expect(prismaMock.characterCondition.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [{ expiresAt: null }, { expiresAt: { gt: expect.any(Date) } }],
          }),
        })
      );
    });
  });

  describe("Apply Condition to Character", () => {
    test("applyConditionToCharacter creates assignment (valued condition)", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      const char = getFakeCharacter();
      const cond = getFakeCondition({ hasValue: true });
      const fakeCC = getFakeCharacterCondition({ characterId: char.id, conditionId: cond.id, value: 2 });

      prismaMock.character.findUnique.mockResolvedValue(char);
      prismaMock.condition.findUnique.mockResolvedValue({ id: cond.id, hasValue: true } as never);
      prismaMock.characterCondition.create.mockResolvedValue(fakeCC);

      const result = await applyConditionToCharacter(
        char.id,
        { conditionId: cond.id, value: 2, source: "Intimidation crit" },
        adminAuth
      );

      expect(prismaMock.characterCondition.create).toHaveBeenCalledTimes(1);
      expect(result).toBe(fakeCC);
    });

    test("applyConditionToCharacter allows stacking — two calls both succeed", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      const char = getFakeCharacter();
      const cond = getFakeCondition({ hasValue: false });
      const cc1 = getFakeCharacterCondition({ characterId: char.id, conditionId: cond.id });
      const cc2 = getFakeCharacterCondition({ characterId: char.id, conditionId: cond.id });

      prismaMock.character.findUnique.mockResolvedValue(char);
      prismaMock.condition.findUnique.mockResolvedValue({ id: cond.id, hasValue: false } as never);
      prismaMock.characterCondition.create
        .mockResolvedValueOnce(cc1)
        .mockResolvedValueOnce(cc2);

      const result1 = await applyConditionToCharacter(char.id, { conditionId: cond.id }, adminAuth);
      const result2 = await applyConditionToCharacter(char.id, { conditionId: cond.id }, adminAuth);

      expect(prismaMock.characterCondition.create).toHaveBeenCalledTimes(2);
      expect(result1).toBe(cc1);
      expect(result2).toBe(cc2);
    });

    test("applyConditionToCharacter returns 400 when value provided for hasValue=false condition", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      const char = getFakeCharacter();
      const cond = getFakeCondition({ hasValue: false });

      prismaMock.character.findUnique.mockResolvedValue(char);
      prismaMock.condition.findUnique.mockResolvedValue({ id: cond.id, hasValue: false } as never);

      const result = await applyConditionToCharacter(
        char.id,
        { conditionId: cond.id, value: 1 },
        adminAuth
      );

      expect(result).toStrictEqual({
        code: ErrorCode.BadRequest,
        message: "This condition does not accept a value",
      });
      expect(prismaMock.characterCondition.create).not.toHaveBeenCalled();
    });

    test("applyConditionToCharacter returns 400 when value missing for hasValue=true condition", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      const char = getFakeCharacter();
      const cond = getFakeCondition({ hasValue: true });

      prismaMock.character.findUnique.mockResolvedValue(char);
      prismaMock.condition.findUnique.mockResolvedValue({ id: cond.id, hasValue: true } as never);

      const result = await applyConditionToCharacter(char.id, { conditionId: cond.id }, adminAuth);

      expect(result).toStrictEqual({
        code: ErrorCode.BadRequest,
        message: "This condition requires a value",
      });
      expect(prismaMock.characterCondition.create).not.toHaveBeenCalled();
    });

    test("applyConditionToCharacter returns 404 when character not found", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      prismaMock.character.findUnique.mockResolvedValue(null);

      const result = await applyConditionToCharacter(
        "missing-char",
        { conditionId: "cond-id" },
        adminAuth
      );

      expect(result).toStrictEqual({ code: ErrorCode.NotFound, message: "Character not found" });
      expect(prismaMock.characterCondition.create).not.toHaveBeenCalled();
    });

    test("applyConditionToCharacter returns 404 when condition not found", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      const char = getFakeCharacter();

      prismaMock.character.findUnique.mockResolvedValue(char);
      prismaMock.condition.findUnique.mockResolvedValue(null);

      const result = await applyConditionToCharacter(char.id, { conditionId: "missing" }, adminAuth);

      expect(result).toStrictEqual({ code: ErrorCode.NotFound, message: "Condition not found" });
      expect(prismaMock.characterCondition.create).not.toHaveBeenCalled();
    });

    test("applyConditionToCharacter returns 403 when Player is not owner", async () => {
      const playerAuth = getFakeCurrentUserAuthorization({
        role: UserRole.Player,
        userId: "player-id",
      });
      const char = getFakeCharacter({ createdByUserId: "other-id", assignedUserId: "other-id" });

      prismaMock.character.findUnique.mockResolvedValue(char);

      const result = await applyConditionToCharacter(char.id, { conditionId: "cond-id" }, playerAuth);

      expect(result).toStrictEqual({ code: ErrorCode.Forbidden, message: "Access denied" });
      expect(prismaMock.characterCondition.create).not.toHaveBeenCalled();
    });
  });

  describe("Update Character Condition", () => {
    test("updateCharacterCondition adjusts value", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      const char = getFakeCharacter();
      const fakeCC = getFakeCharacterCondition({ characterId: char.id, value: 2, deletedAt: null });
      const existingSelect = { characterId: char.id, deletedAt: null, condition: { hasValue: true } };
      const updated = { ...fakeCC, value: 1 };

      prismaMock.character.findUnique.mockResolvedValue(char);
      prismaMock.characterCondition.findUnique.mockResolvedValue(existingSelect as never);
      prismaMock.characterCondition.update.mockResolvedValue(updated);

      const result = await updateCharacterCondition(
        { characterId: char.id, characterConditionId: fakeCC.id },
        { value: 1 },
        adminAuth
      );

      expect(prismaMock.characterCondition.update).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(updated);
    });

    test("updateCharacterCondition returns 400 when value provided for hasValue=false", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      const char = getFakeCharacter();
      const existingSelect = { characterId: char.id, deletedAt: null, condition: { hasValue: false } };

      prismaMock.character.findUnique.mockResolvedValue(char);
      prismaMock.characterCondition.findUnique.mockResolvedValue(existingSelect as never);

      const result = await updateCharacterCondition(
        { characterId: char.id, characterConditionId: "cc-id" },
        { value: 1 },
        adminAuth
      );

      expect(result).toStrictEqual({
        code: ErrorCode.BadRequest,
        message: "This condition does not accept a value",
      });
      expect(prismaMock.characterCondition.update).not.toHaveBeenCalled();
    });

    test("updateCharacterCondition returns 400 when value cleared for hasValue=true", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      const char = getFakeCharacter();
      const existingSelect = { characterId: char.id, deletedAt: null, condition: { hasValue: true } };

      prismaMock.character.findUnique.mockResolvedValue(char);
      prismaMock.characterCondition.findUnique.mockResolvedValue(existingSelect as never);

      const result = await updateCharacterCondition(
        { characterId: char.id, characterConditionId: "cc-id" },
        { value: null },
        adminAuth
      );

      expect(result).toStrictEqual({
        code: ErrorCode.BadRequest,
        message: "This condition requires a value",
      });
      expect(prismaMock.characterCondition.update).not.toHaveBeenCalled();
    });

    test("updateCharacterCondition returns 404 when assignment not found", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      const char = getFakeCharacter();

      prismaMock.character.findUnique.mockResolvedValue(char);
      prismaMock.characterCondition.findUnique.mockResolvedValue(null);

      const result = await updateCharacterCondition(
        { characterId: char.id, characterConditionId: "missing" },
        { source: "x" },
        adminAuth
      );

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Character condition assignment Not Found",
      });
      expect(prismaMock.characterCondition.update).not.toHaveBeenCalled();
    });

    test("updateCharacterCondition returns 404 when assignment is soft-deleted", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      const char = getFakeCharacter();
      const existingSelect = { characterId: char.id, deletedAt: new Date(), condition: { hasValue: false } };

      prismaMock.character.findUnique.mockResolvedValue(char);
      prismaMock.characterCondition.findUnique.mockResolvedValue(existingSelect as never);

      const result = await updateCharacterCondition(
        { characterId: char.id, characterConditionId: "cc-id" },
        { source: "x" },
        adminAuth
      );

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Character condition assignment Not Found",
      });
    });

    test("updateCharacterCondition returns 404 when assignment belongs to a different character", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      const char = getFakeCharacter();
      const existingSelect = { characterId: "other-char-id", deletedAt: null, condition: { hasValue: false } };

      prismaMock.character.findUnique.mockResolvedValue(char);
      prismaMock.characterCondition.findUnique.mockResolvedValue(existingSelect as never);

      const result = await updateCharacterCondition(
        { characterId: char.id, characterConditionId: "cc-id" },
        { source: "x" },
        adminAuth
      );

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Character condition assignment Not Found",
      });
    });

    test("updateCharacterCondition returns 403 when Player is not owner", async () => {
      const playerAuth = getFakeCurrentUserAuthorization({
        role: UserRole.Player,
        userId: "player-id",
      });
      const char = getFakeCharacter({ createdByUserId: "other-id", assignedUserId: "other-id" });

      prismaMock.character.findUnique.mockResolvedValue(char);

      const result = await updateCharacterCondition(
        { characterId: char.id, characterConditionId: "cc-id" },
        { source: "x" },
        playerAuth
      );

      expect(result).toStrictEqual({ code: ErrorCode.Forbidden, message: "Access denied" });
      expect(prismaMock.characterCondition.findUnique).not.toHaveBeenCalled();
    });

    test("updateCharacterCondition Admin bypasses ownership and succeeds", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      const char = getFakeCharacter({ createdByUserId: "other-id", assignedUserId: "other-id" });
      const fakeCC = getFakeCharacterCondition({ characterId: char.id, deletedAt: null });
      const existingSelect = { characterId: char.id, deletedAt: null, condition: { hasValue: false } };

      prismaMock.character.findUnique.mockResolvedValue(char);
      prismaMock.characterCondition.findUnique.mockResolvedValue(existingSelect as never);
      prismaMock.characterCondition.update.mockResolvedValue(fakeCC);

      const result = await updateCharacterCondition(
        { characterId: char.id, characterConditionId: fakeCC.id },
        { source: "admin override" },
        adminAuth
      );

      expect(prismaMock.characterCondition.update).toHaveBeenCalledTimes(1);
      expect(result).toBe(fakeCC);
    });
  });

  describe("Remove Condition from Character", () => {
    test("removeConditionFromCharacter soft-deletes the assignment (Admin)", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      const fakeCC = getFakeCharacterCondition({ deletedAt: null });
      const deletedAt = new Date();

      prismaMock.characterCondition.findUnique.mockResolvedValue(fakeCC);
      prismaMock.characterCondition.update.mockResolvedValue({ ...fakeCC, deletedAt });

      const result = await removeConditionFromCharacter(
        { characterId: fakeCC.characterId, characterConditionId: fakeCC.id },
        adminAuth
      );

      expect(prismaMock.characterCondition.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ deletedAt: expect.any(Date) }),
        })
      );
      expect(prismaMock.character.findUnique).not.toHaveBeenCalled();
      expect((result as typeof fakeCC).deletedAt).toBeTruthy();
    });

    test("removeConditionFromCharacter returns 404 when assignment not found", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      prismaMock.characterCondition.findUnique.mockResolvedValue(null);

      const result = await removeConditionFromCharacter(
        { characterId: "char-id", characterConditionId: "missing" },
        adminAuth
      );

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Character condition assignment Not Found",
      });
      expect(prismaMock.characterCondition.update).not.toHaveBeenCalled();
    });

    test("removeConditionFromCharacter returns 404 when assignment already deleted", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      const fakeCC = getFakeCharacterCondition({ deletedAt: new Date() });

      prismaMock.characterCondition.findUnique.mockResolvedValue(fakeCC);

      const result = await removeConditionFromCharacter(
        { characterId: fakeCC.characterId, characterConditionId: fakeCC.id },
        adminAuth
      );

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Character condition assignment Not Found",
      });
      expect(prismaMock.characterCondition.update).not.toHaveBeenCalled();
    });

    test("removeConditionFromCharacter returns 404 when assignment belongs to different character", async () => {
      const adminAuth = getFakeCurrentUserAuthorization({ role: UserRole.Admin });
      const fakeCC = getFakeCharacterCondition({ characterId: "real-char-id", deletedAt: null });

      prismaMock.characterCondition.findUnique.mockResolvedValue(fakeCC);

      const result = await removeConditionFromCharacter(
        { characterId: "other-char-id", characterConditionId: fakeCC.id },
        adminAuth
      );

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Character condition assignment Not Found",
      });
      expect(prismaMock.characterCondition.update).not.toHaveBeenCalled();
    });

    test("removeConditionFromCharacter returns 403 when Player is not owner", async () => {
      const playerAuth = getFakeCurrentUserAuthorization({
        role: UserRole.Player,
        userId: "player-id",
      });
      const char = getFakeCharacter({ createdByUserId: "other-id", assignedUserId: "other-id" });

      prismaMock.character.findUnique.mockResolvedValue(char);

      const result = await removeConditionFromCharacter(
        { characterId: char.id, characterConditionId: "cc-id" },
        playerAuth
      );

      expect(result).toStrictEqual({ code: ErrorCode.Forbidden, message: "Access denied" });
      expect(prismaMock.characterCondition.findUnique).not.toHaveBeenCalled();
      expect(prismaMock.characterCondition.update).not.toHaveBeenCalled();
    });
  });
});
