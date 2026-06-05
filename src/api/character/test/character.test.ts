import { getFakeCharacter, getFakeCharacterFeat, getFakeCharacterSpell, getFakeFeat, getFakeLanguage, getFakeSpell, getFakeUser } from "../../../testing/fakes";
import { mockCount } from "../../../testing/mock-pagination";
import { prismaMock } from "../../../testing/mock-prisma";
import { getPaginationOptions } from "../../../utils/pagination";
import { ErrorCode } from "../../../utils/shared-types";
import {
  deleteCharacter,
  getCharacter,
  insertCharacter,
  searchCharacters,
  updateCharacter,
} from "../character";

describe("Character tests", () => {
  describe("Search Character", () => {
    test("searchCharacter returns Character", async () => {
      const pagination = getPaginationOptions({});
      const fakeCharacter = getFakeCharacter();
      const fakeUserCreator = getFakeUser();
      const fakeUserAssigned = getFakeUser();
      prismaMock.character.findMany.mockResolvedValue([fakeCharacter]);

      mockCount(prismaMock.character, 1);

      const results = await searchCharacters(
        { userCreatorName: fakeCharacter.characterName },
        pagination
      );

      expect(results).not.toBeFalsy();
      expect(results).toStrictEqual({
        items: [fakeCharacter],
        count: 1,
      });
    });

    test("searchCharacter handles no results", async () => {
      const pagination = getPaginationOptions({});

      prismaMock.character.findMany.mockResolvedValue([]);
      mockCount(prismaMock.character, 0);

      const results = await searchCharacters(
        { userCreatorName: "nonexistent" },
        pagination
      );

      expect(prismaMock.character.findMany).toHaveBeenCalledTimes(1);
      expect(results).toStrictEqual({
        items: [],
        count: 0,
      });
    });
  });
  describe("Get Character", () => {
    test("Should return a Character", async () => {
      const fakeCharacter = getFakeCharacter({
        id: "cl1v51jp9000eqofg5bnu90gd",
      });
      prismaMock.character.findUniqueOrThrow.mockResolvedValue(fakeCharacter);
      const character = await getCharacter({ id: fakeCharacter.id });
      expect(character).not.toBeFalsy();
      expect(character).toBe(fakeCharacter);
    });

    test("Should throw an error when Character not found", async () => {
      const fakeCharacterId = "nonexistent-id";
      prismaMock.character.findUniqueOrThrow.mockRejectedValue(
        new Error("Character not found")
      );

      await expect(getCharacter({ id: fakeCharacterId })).rejects.toThrow(
        "Character not found"
      );
      expect(prismaMock.character.findUniqueOrThrow).toHaveBeenCalledTimes(1);
    });

    test("getCharacter result includes characterFeats array", async () => {
      const fakeFeat = getFakeFeat();
      const fakeCharacterFeat = getFakeCharacterFeat({ featId: fakeFeat.id });
      const fakeCharacter = {
        ...getFakeCharacter(),
        characterFeats: [fakeCharacterFeat],
      };
      prismaMock.character.findUniqueOrThrow.mockResolvedValue(fakeCharacter as any);

      const result = await getCharacter({ id: fakeCharacter.id });

      expect(result).toHaveProperty("characterFeats");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const feats = (result as any).characterFeats as typeof fakeCharacter.characterFeats;
      expect(feats).toHaveLength(1);
      expect(feats[0].featId).toBe(fakeFeat.id);
    });

    test("getCharacter result includes characterSpells array", async () => {
      const fakeSpell = getFakeSpell();
      const fakeCharacterSpell = getFakeCharacterSpell({ spellId: fakeSpell.id });
      const fakeCharacter = {
        ...getFakeCharacter(),
        characterSpells: [fakeCharacterSpell],
      };
      prismaMock.character.findUniqueOrThrow.mockResolvedValue(fakeCharacter as any);

      const result = await getCharacter({ id: fakeCharacter.id });

      expect(result).toHaveProperty("characterSpells");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const spells = (result as any).characterSpells as typeof fakeCharacter.characterSpells;
      expect(spells).toHaveLength(1);
      expect(spells[0].spellId).toBe(fakeSpell.id);
    });

    test("getCharacter result includes languages array", async () => {
      const fakeLanguage = getFakeLanguage();
      const fakeCharacter = {
        ...getFakeCharacter(),
        languages: [{ id: fakeLanguage.id, name: fakeLanguage.name }],
      };
      prismaMock.character.findUniqueOrThrow.mockResolvedValue(fakeCharacter as any);

      const result = await getCharacter({ id: fakeCharacter.id });

      expect(result).toHaveProperty("languages");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const languages = (result as any).languages as { id: string; name: string }[];
      expect(languages).toHaveLength(1);
      expect(languages[0].id).toBe(fakeLanguage.id);
    });
  });
  describe("Insert Character", () => {
    test("insertCharacter inserts and returns new Character", async () => {
      const fakeCharacter = getFakeCharacter();
      prismaMock.character.findMany.mockResolvedValue([]);
      prismaMock.character.create.mockResolvedValue(fakeCharacter);
      const result = await insertCharacter({ ...fakeCharacter, languageIds: [] });

      expect(prismaMock.character.create).toHaveBeenCalledTimes(1);
      expect(result).not.toBeFalsy();
      expect(result).toBe(fakeCharacter);
    });

    test("insertCharacter returns 404 when backgroundId not found", async () => {
      const backgroundId = "cl_background_missing";
      const fakeCharacter = getFakeCharacter({ backgroundId });
      prismaMock.background.findUnique.mockResolvedValue(null);

      const result = await insertCharacter({ ...fakeCharacter, languageIds: [] });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Background not found",
      });
    });

    test("insertCharacter returns 404 when deityId not found", async () => {
      const fakeCharacter = getFakeCharacter({ deityId: "cl_deity_missing" });
      prismaMock.deity.findUnique.mockResolvedValue(null);

      const result = await insertCharacter({ ...fakeCharacter, languageIds: [] });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Deity not found",
      });
    });

    test("insertCharacter handles character conflict", async () => {
      const fakeCharacter = getFakeCharacter();
      prismaMock.character.findMany.mockResolvedValue([fakeCharacter]);

      const result = await insertCharacter({ ...fakeCharacter, languageIds: [] });

      expect(result).toStrictEqual({
        code: ErrorCode.DataConflict,
        message: "User already has an active character with the same name",
      });
    });

    test("insertCharacter connects languageIds", async () => {
      const fakeCharacter = getFakeCharacter();
      const languageId = "cl_language_common";
      prismaMock.character.findMany.mockResolvedValue([]);
      prismaMock.character.create.mockResolvedValue(fakeCharacter);

      await insertCharacter({ ...fakeCharacter, languageIds: [languageId] });

      expect(prismaMock.character.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            languages: { connect: [{ id: languageId }] },
          }),
        })
      );
    });
  });
  describe("Update Character", () => {
    test("updateCharacter updates and returns updated Character", async () => {
      const newCharacterName = "Pepi";
      const fakeCharacter = getFakeCharacter({
        id: "cl1v51jp9000eqofg5bnu90gd",
      });
      prismaMock.character.update.mockResolvedValue({
        ...fakeCharacter,
        characterName: newCharacterName,
      });
      const result = await updateCharacter(
        { id: fakeCharacter.id },
        {
          characterName: newCharacterName,
        }
      );

      expect(prismaMock.character.update).toHaveBeenCalledTimes(1);
      expect(result).not.toBeFalsy();
      expect(result).toStrictEqual({
        ...fakeCharacter,
        characterName: newCharacterName,
      });
    });

    test("updateCharacter replaces languages via set when languageIds provided", async () => {
      const fakeCharacter = getFakeCharacter({ id: "cl1v51jp9000eqofg5bnu90gd" });
      const languageId = "cl_language_orc";
      prismaMock.character.update.mockResolvedValue(fakeCharacter);

      await updateCharacter({ id: fakeCharacter.id }, { languageIds: [languageId] });

      expect(prismaMock.character.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            languages: { set: [{ id: languageId }] },
          }),
        })
      );
    });

    test("updateCharacter omits languages when languageIds not provided", async () => {
      const fakeCharacter = getFakeCharacter({ id: "cl1v51jp9000eqofg5bnu90gd" });
      prismaMock.character.update.mockResolvedValue(fakeCharacter);

      await updateCharacter({ id: fakeCharacter.id }, { characterName: "NoLangChange" });

      const updateArg = prismaMock.character.update.mock.calls[0][0];
      expect(updateArg.data).not.toHaveProperty("languages");
    });
  });
  describe("Delete Character", () => {
    test("deleteCharacter deletes and returns deleted Character", async () => {
      const now = new Date();
      const fakeCharacter = getFakeCharacter({
        id: "cl1v51jp9000eqofg5bnu90gd",
      });
      prismaMock.character.findUnique.mockResolvedValue(fakeCharacter);
      prismaMock.character.update.mockResolvedValue({
        ...fakeCharacter,
        deletedAt: now,
      });
      const result = await deleteCharacter({ id: fakeCharacter.id });

      expect(prismaMock.character.update).toHaveBeenCalledTimes(1);
      expect(result).not.toBeFalsy();
      expect(result).toStrictEqual({
        ...fakeCharacter,
        deletedAt: now,
      });
    });

    test("deleteCharacter handles non-existing character", async () => {
      const fakeCharacterId = "nonexistent-id";

      prismaMock.character.findUnique.mockResolvedValue(null);

      const result = await deleteCharacter({ id: fakeCharacterId });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Character Not Found",
      });
      expect(prismaMock.character.update).not.toHaveBeenCalled();
    });
  });
});
