import { getFakeLanguage } from "../../../testing/fakes";
import { mockCount } from "../../../testing/mock-pagination";
import { prismaMock } from "../../../testing/mock-prisma";
import { getPaginationOptions } from "../../../utils/pagination";
import { ErrorCode } from "../../../utils/shared-types";
import {
  deleteLanguage,
  getLanguage,
  insertLanguage,
  searchLanguage,
  updateLanguage,
} from "../language";

describe("Language tests", () => {
  describe("Search Language", () => {
    test("searchLanguage returns languages", async () => {
      const pagination = getPaginationOptions({});
      const fake = getFakeLanguage();
      prismaMock.language.findMany.mockResolvedValue([fake]);
      mockCount(prismaMock.language, 1);

      const result = await searchLanguage({}, pagination);

      expect(result).toStrictEqual({ items: [fake], count: 1 });
    });

    test("searchLanguage handles empty result", async () => {
      const pagination = getPaginationOptions({});
      prismaMock.language.findMany.mockResolvedValue([]);
      mockCount(prismaMock.language, 0);

      const result = await searchLanguage({}, pagination);

      expect(prismaMock.language.findMany).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual({ items: [], count: 0 });
    });

    test("searchLanguage applies name filter (contains, case-insensitive)", async () => {
      const pagination = getPaginationOptions({});
      prismaMock.language.findMany.mockResolvedValue([]);
      mockCount(prismaMock.language, 0);

      await searchLanguage({ name: "com" }, pagination);

      expect(prismaMock.language.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            name: { contains: "com", mode: "insensitive" },
          }),
        })
      );
    });

    test("searchLanguage applies isActive filter", async () => {
      const pagination = getPaginationOptions({});
      prismaMock.language.findMany.mockResolvedValue([]);
      mockCount(prismaMock.language, 0);

      await searchLanguage({ isActive: false }, pagination);

      expect(prismaMock.language.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ deletedAt: { not: null } }),
        })
      );
    });
  });

  describe("Get Language", () => {
    test("getLanguage returns a language by id", async () => {
      const fake = getFakeLanguage({ id: "test-id" });
      prismaMock.language.findUniqueOrThrow.mockResolvedValue(fake);

      const result = await getLanguage({ id: fake.id });

      expect(result).toBe(fake);
    });

    test("getLanguage throws when not found", async () => {
      prismaMock.language.findUniqueOrThrow.mockRejectedValue(
        new Error("Language not found")
      );

      await expect(getLanguage({ id: "nonexistent" })).rejects.toThrow(
        "Language not found"
      );
    });
  });

  describe("Insert Language", () => {
    test("insertLanguage creates and returns a new language", async () => {
      const fake = getFakeLanguage();
      prismaMock.language.findFirst.mockResolvedValue(null);
      prismaMock.language.create.mockResolvedValue(fake);

      const result = await insertLanguage({
        name: fake.name,
        description: fake.description,
        rarity: fake.rarity,
      });

      expect(prismaMock.language.create).toHaveBeenCalledTimes(1);
      expect(result).toBe(fake);
    });

    test("insertLanguage returns 409 on active duplicate name", async () => {
      const fake = getFakeLanguage({ deletedAt: null });
      prismaMock.language.findFirst.mockResolvedValue(fake);

      const result = await insertLanguage({
        name: fake.name,
        description: fake.description,
        rarity: fake.rarity,
      });

      expect(result).toStrictEqual({
        code: ErrorCode.DataConflict,
        message: "A language with that name already exists",
      });
      expect(prismaMock.language.create).not.toHaveBeenCalled();
    });

    test("insertLanguage allows creation when only a soft-deleted match exists", async () => {
      const softDeleted = getFakeLanguage({ deletedAt: new Date() });
      const created = getFakeLanguage({ name: softDeleted.name });
      prismaMock.language.findFirst.mockResolvedValue(softDeleted);
      prismaMock.language.create.mockResolvedValue(created);

      const result = await insertLanguage({
        name: softDeleted.name,
        description: created.description,
        rarity: created.rarity,
      });

      expect(prismaMock.language.create).toHaveBeenCalledTimes(1);
      expect(result).toBe(created);
    });
  });

  describe("Update Language", () => {
    test("updateLanguage updates and returns the language", async () => {
      const fake = getFakeLanguage({ id: "lang-1" });
      prismaMock.language.findUnique.mockResolvedValue(fake);
      prismaMock.language.findFirst.mockResolvedValue(null);
      prismaMock.language.update.mockResolvedValue({ ...fake, name: "Updated" });

      const result = await updateLanguage({ id: fake.id }, { name: "Updated" });

      expect(prismaMock.language.update).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual({ ...fake, name: "Updated" });
    });

    test("updateLanguage returns 404 when language not found", async () => {
      prismaMock.language.findUnique.mockResolvedValue(null);

      const result = await updateLanguage({ id: "nonexistent" }, { name: "X" });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Language Not Found",
      });
      expect(prismaMock.language.update).not.toHaveBeenCalled();
    });

    test("updateLanguage returns 404 when language already soft-deleted", async () => {
      const fake = getFakeLanguage({ deletedAt: new Date() });
      prismaMock.language.findUnique.mockResolvedValue(fake);

      const result = await updateLanguage({ id: fake.id }, { name: "X" });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Language Not Found",
      });
      expect(prismaMock.language.update).not.toHaveBeenCalled();
    });

    test("updateLanguage returns 409 when renaming to an existing active name", async () => {
      const fake = getFakeLanguage({ id: "lang-1" });
      const conflict = getFakeLanguage({ id: "lang-2", deletedAt: null });
      prismaMock.language.findUnique.mockResolvedValue(fake);
      prismaMock.language.findFirst.mockResolvedValue(conflict);

      const result = await updateLanguage({ id: fake.id }, { name: "Taken" });

      expect(result).toStrictEqual({
        code: ErrorCode.DataConflict,
        message: "A language with that name already exists",
      });
      expect(prismaMock.language.update).not.toHaveBeenCalled();
    });
  });

  describe("Delete Language", () => {
    test("deleteLanguage soft-deletes and returns the language", async () => {
      const fake = getFakeLanguage({ deletedAt: null });
      const now = new Date();
      prismaMock.language.findUnique.mockResolvedValue(fake);
      prismaMock.language.update.mockResolvedValue({ ...fake, deletedAt: now });

      const result = await deleteLanguage({ id: fake.id });

      expect(prismaMock.language.update).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual({ ...fake, deletedAt: now });
    });

    test("deleteLanguage returns 404 when language not found", async () => {
      prismaMock.language.findUnique.mockResolvedValue(null);

      const result = await deleteLanguage({ id: "nonexistent" });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Language Not Found",
      });
      expect(prismaMock.language.update).not.toHaveBeenCalled();
    });

    test("deleteLanguage returns 404 when language already deleted", async () => {
      const fake = getFakeLanguage({ deletedAt: new Date() });
      prismaMock.language.findUnique.mockResolvedValue(fake);

      const result = await deleteLanguage({ id: fake.id });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Language Not Found",
      });
      expect(prismaMock.language.update).not.toHaveBeenCalled();
    });
  });
});
