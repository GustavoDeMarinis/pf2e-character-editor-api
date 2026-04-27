import { getFakeBackground } from "../../../testing/fakes";
import { mockCount } from "../../../testing/mock-pagination";
import { prismaMock } from "../../../testing/mock-prisma";
import { getPaginationOptions } from "../../../utils/pagination";
import { ErrorCode } from "../../../utils/shared-types";
import {
  deleteBackground,
  getBackground,
  insertBackground,
  searchBackgrounds,
  updateBackground,
} from "../background";

describe("Background tests", () => {
  describe("Search Background", () => {
    test("searchBackgrounds returns backgrounds", async () => {
      const pagination = getPaginationOptions({});
      const fakeBackground = getFakeBackground();
      prismaMock.background.findMany.mockResolvedValue([fakeBackground]);
      mockCount(prismaMock.background, 1);

      const results = await searchBackgrounds({}, pagination);

      expect(results).not.toBeFalsy();
      expect(results).toStrictEqual({ items: [fakeBackground], count: 1 });
    });

    test("searchBackgrounds handles no results", async () => {
      const pagination = getPaginationOptions({});
      prismaMock.background.findMany.mockResolvedValue([]);
      mockCount(prismaMock.background, 0);

      const results = await searchBackgrounds({}, pagination);

      expect(prismaMock.background.findMany).toHaveBeenCalledTimes(1);
      expect(results).toStrictEqual({ items: [], count: 0 });
    });
  });

  describe("Get Background", () => {
    test("should return a background", async () => {
      const fakeBackground = getFakeBackground({ id: "test-id" });
      prismaMock.background.findUniqueOrThrow.mockResolvedValue(fakeBackground);

      const result = await getBackground({ id: fakeBackground.id });

      expect(result).not.toBeFalsy();
      expect(result).toBe(fakeBackground);
    });

    test("should throw when background not found", async () => {
      prismaMock.background.findUniqueOrThrow.mockRejectedValue(
        new Error("Background not found")
      );

      await expect(getBackground({ id: "nonexistent-id" })).rejects.toThrow(
        "Background not found"
      );
    });
  });

  describe("Insert Background", () => {
    test("insertBackground creates and returns new background", async () => {
      const fakeBackground = getFakeBackground();
      prismaMock.background.findFirst.mockResolvedValue(null);
      prismaMock.background.create.mockResolvedValue(fakeBackground);

      const { id, createdAt, updatedAt, deletedAt, ...rest } = fakeBackground;
      const result = await insertBackground({ ...rest, traitIds: [] });

      expect(prismaMock.background.create).toHaveBeenCalledTimes(1);
      expect(result).toBe(fakeBackground);
    });

    test("insertBackground returns 404 when trainedSkillId not found", async () => {
      const fakeBackground = getFakeBackground({ trainedSkillId: "cl_skill_missing" });
      prismaMock.skill.findUnique.mockResolvedValue(null);

      const { id, createdAt, updatedAt, deletedAt, ...rest } = fakeBackground;
      const result = await insertBackground({ ...rest, traitIds: [] });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Skill not found",
      });
      expect(prismaMock.background.create).not.toHaveBeenCalled();
    });

    test("insertBackground returns 409 when name already exists", async () => {
      const fakeBackground = getFakeBackground();
      prismaMock.background.findFirst.mockResolvedValue(fakeBackground);

      const { id, createdAt, updatedAt, deletedAt, ...rest } = fakeBackground;
      const result = await insertBackground({ ...rest, traitIds: [] });

      expect(result).toStrictEqual({
        code: ErrorCode.DataConflict,
        message: "A background with that name already exists",
      });
      expect(prismaMock.background.create).not.toHaveBeenCalled();
    });

    test("insertBackground allows creation when only a soft-deleted match exists", async () => {
      const fakeBackground = getFakeBackground();
      const deletedMatch = getFakeBackground({
        name: fakeBackground.name,
        deletedAt: new Date(),
      });
      prismaMock.background.findFirst.mockResolvedValue(deletedMatch);
      prismaMock.background.create.mockResolvedValue(fakeBackground);

      const { id, createdAt, updatedAt, deletedAt, ...rest } = fakeBackground;
      const result = await insertBackground({ ...rest, traitIds: [] });

      expect(prismaMock.background.create).toHaveBeenCalledTimes(1);
      expect(result).toBe(fakeBackground);
    });
  });

  describe("Update Background", () => {
    test("updateBackground updates and returns updated background", async () => {
      const newName = "Updated Background";
      const fakeBackground = getFakeBackground({ id: "test-id" });

      prismaMock.background.findUnique.mockResolvedValue(fakeBackground);
      prismaMock.background.update.mockResolvedValue({ ...fakeBackground, name: newName });

      const result = await updateBackground({ id: fakeBackground.id }, { name: newName });

      expect(prismaMock.background.update).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual({ ...fakeBackground, name: newName });
    });

    test("updateBackground returns 404 when background not found", async () => {
      prismaMock.background.findUnique.mockResolvedValue(null);

      const result = await updateBackground({ id: "nonexistent-id" }, { name: "X" });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Background Not Found",
      });
      expect(prismaMock.background.update).not.toHaveBeenCalled();
    });

    test("updateBackground returns 404 when background is already deleted", async () => {
      const fakeBackground = getFakeBackground({ deletedAt: new Date() });
      prismaMock.background.findUnique.mockResolvedValue(fakeBackground);

      const result = await updateBackground({ id: fakeBackground.id }, { name: "X" });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Background Not Found",
      });
      expect(prismaMock.background.update).not.toHaveBeenCalled();
    });
  });

  describe("Delete Background", () => {
    test("deleteBackground soft-deletes and returns background", async () => {
      const now = new Date();
      const fakeBackground = getFakeBackground({ id: "test-id" });

      prismaMock.background.findUnique.mockResolvedValue(fakeBackground);
      prismaMock.background.update.mockResolvedValue({ ...fakeBackground, deletedAt: now });

      const result = await deleteBackground({ id: fakeBackground.id });

      expect(prismaMock.background.update).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual({ ...fakeBackground, deletedAt: now });
    });

    test("deleteBackground returns 404 for non-existing background", async () => {
      prismaMock.background.findUnique.mockResolvedValue(null);

      const result = await deleteBackground({ id: "nonexistent-id" });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Background Not Found",
      });
      expect(prismaMock.background.update).not.toHaveBeenCalled();
    });

    test("deleteBackground returns 404 for already-deleted background", async () => {
      const fakeBackground = getFakeBackground({ deletedAt: new Date() });
      prismaMock.background.findUnique.mockResolvedValue(fakeBackground);

      const result = await deleteBackground({ id: fakeBackground.id });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Background Not Found",
      });
      expect(prismaMock.background.update).not.toHaveBeenCalled();
    });
  });
});
