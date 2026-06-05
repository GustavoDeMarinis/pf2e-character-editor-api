import { getFakeCondition } from "../../../testing/fakes";
import { mockCount } from "../../../testing/mock-pagination";
import { prismaMock } from "../../../testing/mock-prisma";
import { getPaginationOptions } from "../../../utils/pagination";
import { ErrorCode } from "../../../utils/shared-types";
import {
  deleteCondition,
  getCondition,
  insertCondition,
  searchConditions,
  updateCondition,
} from "../condition";

describe("Condition tests", () => {
  describe("Search Conditions", () => {
    test("searchConditions returns items", async () => {
      const pagination = getPaginationOptions({});
      const fake = getFakeCondition();
      prismaMock.condition.findMany.mockResolvedValue([fake]);
      mockCount(prismaMock.condition, 1);

      const result = await searchConditions({}, pagination);

      expect(result).toStrictEqual({ items: [fake], count: 1 });
    });

    test("searchConditions handles empty result", async () => {
      const pagination = getPaginationOptions({});
      prismaMock.condition.findMany.mockResolvedValue([]);
      mockCount(prismaMock.condition, 0);

      const result = await searchConditions({}, pagination);

      expect(result).toStrictEqual({ items: [], count: 0 });
    });

    test("searchConditions applies name filter (contains, case-insensitive)", async () => {
      const pagination = getPaginationOptions({});
      prismaMock.condition.findMany.mockResolvedValue([]);
      mockCount(prismaMock.condition, 0);

      await searchConditions({ name: "fright" }, pagination);

      expect(prismaMock.condition.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ name: { contains: "fright", mode: "insensitive" } }),
        })
      );
    });

    test("searchConditions applies hasValue filter", async () => {
      const pagination = getPaginationOptions({});
      prismaMock.condition.findMany.mockResolvedValue([]);
      mockCount(prismaMock.condition, 0);

      await searchConditions({ hasValue: true }, pagination);

      expect(prismaMock.condition.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ hasValue: true }) })
      );
    });

    test("searchConditions applies isActive filter", async () => {
      const pagination = getPaginationOptions({});
      prismaMock.condition.findMany.mockResolvedValue([]);
      mockCount(prismaMock.condition, 0);

      await searchConditions({ isActive: false }, pagination);

      expect(prismaMock.condition.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ deletedAt: { not: null } }) })
      );
    });
  });

  describe("Get Condition", () => {
    test("getCondition returns condition by id", async () => {
      const fake = getFakeCondition({ id: "test-id" });
      prismaMock.condition.findUniqueOrThrow.mockResolvedValue(fake);

      const result = await getCondition({ id: fake.id });

      expect(result).toBe(fake);
    });

    test("getCondition throws when not found", async () => {
      prismaMock.condition.findUniqueOrThrow.mockRejectedValue(new Error("Not found"));

      await expect(getCondition({ id: "nonexistent" })).rejects.toThrow("Not found");
    });
  });

  describe("Insert Condition", () => {
    test("insertCondition creates condition (no overrides)", async () => {
      const fake = getFakeCondition();

      prismaMock.condition.findFirst.mockResolvedValue(null);
      prismaMock.condition.create.mockResolvedValue(fake);

      const result = await insertCondition({ name: fake.name, description: fake.description });

      expect(prismaMock.condition.create).toHaveBeenCalledTimes(1);
      expect(result).toBe(fake);
    });

    test("insertCondition creates condition with overrideIds (verifies connect)", async () => {
      const fake = getFakeCondition();
      const overrideId = "override-cond-id";

      prismaMock.condition.findFirst.mockResolvedValue(null);
      prismaMock.condition.findMany.mockResolvedValue([getFakeCondition({ id: overrideId })]);
      prismaMock.condition.create.mockResolvedValue(fake);

      const result = await insertCondition({
        name: fake.name,
        description: fake.description,
        overrideIds: [overrideId],
      });

      expect(prismaMock.condition.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            overrides: { connect: [{ id: overrideId }] },
          }),
        })
      );
      expect(result).toBe(fake);
    });

    test("insertCondition returns 409 when active name conflict", async () => {
      const existing = getFakeCondition({ deletedAt: null });

      prismaMock.condition.findFirst.mockResolvedValue(existing);

      const result = await insertCondition({ name: existing.name, description: "desc" });

      expect(result).toStrictEqual({
        code: ErrorCode.DataConflict,
        message: "A condition with that name already exists",
      });
      expect(prismaMock.condition.create).not.toHaveBeenCalled();
    });

    test("insertCondition allows creation when only a soft-deleted match exists", async () => {
      const softDeleted = getFakeCondition({ deletedAt: new Date() });
      const newFake = getFakeCondition({ name: softDeleted.name });

      prismaMock.condition.findFirst.mockResolvedValue(softDeleted);
      prismaMock.condition.create.mockResolvedValue(newFake);

      const result = await insertCondition({ name: softDeleted.name, description: "desc" });

      expect(prismaMock.condition.create).toHaveBeenCalledTimes(1);
      expect(result).toBe(newFake);
    });

    test("insertCondition returns 404 when an overrideId does not exist", async () => {
      prismaMock.condition.findFirst.mockResolvedValue(null);
      prismaMock.condition.findMany.mockResolvedValue([]); // none found

      const result = await insertCondition({
        name: "New Condition",
        description: "desc",
        overrideIds: ["nonexistent-id"],
      });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Condition not found in overrideIds",
      });
      expect(prismaMock.condition.create).not.toHaveBeenCalled();
    });
  });

  describe("Update Condition", () => {
    test("updateCondition updates and returns condition", async () => {
      const fake = getFakeCondition({ id: "cond-123" });

      prismaMock.condition.findUnique.mockResolvedValue(fake);
      prismaMock.condition.update.mockResolvedValue({ ...fake, name: "Updated" });

      const result = await updateCondition({ id: fake.id }, { name: "Updated" });

      expect(prismaMock.condition.update).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual({ ...fake, name: "Updated" });
    });

    test("updateCondition replaces overrides via set", async () => {
      const fake = getFakeCondition({ id: "cond-123" });
      const overrideId = "override-456";

      prismaMock.condition.findUnique.mockResolvedValue(fake);
      prismaMock.condition.findMany.mockResolvedValue([getFakeCondition({ id: overrideId })]);
      prismaMock.condition.update.mockResolvedValue(fake);

      await updateCondition({ id: fake.id }, { overrideIds: [overrideId] });

      expect(prismaMock.condition.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            overrides: { set: [{ id: overrideId }] },
          }),
        })
      );
    });

    test("updateCondition returns 400 when overrideIds includes the condition's own id", async () => {
      const fake = getFakeCondition({ id: "cond-self" });

      prismaMock.condition.findUnique.mockResolvedValue(fake);

      const result = await updateCondition({ id: fake.id }, { overrideIds: [fake.id] });

      expect(result).toStrictEqual({
        code: ErrorCode.BadRequest,
        message: "A condition cannot override itself",
      });
      expect(prismaMock.condition.update).not.toHaveBeenCalled();
    });

    test("updateCondition returns 404 when an overrideId does not exist", async () => {
      const fake = getFakeCondition({ id: "cond-123" });

      prismaMock.condition.findUnique.mockResolvedValue(fake);
      prismaMock.condition.findMany.mockResolvedValue([]); // none found

      const result = await updateCondition({ id: fake.id }, { overrideIds: ["missing"] });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Condition not found in overrideIds",
      });
      expect(prismaMock.condition.update).not.toHaveBeenCalled();
    });

    test("updateCondition returns 404 when condition not found", async () => {
      prismaMock.condition.findUnique.mockResolvedValue(null);

      const result = await updateCondition({ id: "nonexistent" }, { name: "X" });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Condition Not Found",
      });
      expect(prismaMock.condition.update).not.toHaveBeenCalled();
    });
  });

  describe("Delete Condition", () => {
    test("deleteCondition soft-deletes the condition", async () => {
      const fake = getFakeCondition({ deletedAt: null });
      const deletedAt = new Date();

      prismaMock.condition.findUnique.mockResolvedValue(fake);
      prismaMock.condition.update.mockResolvedValue({ ...fake, deletedAt });

      const result = await deleteCondition({ id: fake.id });

      expect(prismaMock.condition.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ deletedAt: expect.any(Date) }) })
      );
      expect((result as typeof fake).deletedAt).toBeTruthy();
    });

    test("deleteCondition returns 404 when condition not found", async () => {
      prismaMock.condition.findUnique.mockResolvedValue(null);

      const result = await deleteCondition({ id: "nonexistent" });

      expect(result).toStrictEqual({ code: ErrorCode.NotFound, message: "Condition Not Found" });
      expect(prismaMock.condition.update).not.toHaveBeenCalled();
    });

    test("deleteCondition returns 404 when condition already deleted", async () => {
      const fake = getFakeCondition({ deletedAt: new Date() });
      prismaMock.condition.findUnique.mockResolvedValue(fake);

      const result = await deleteCondition({ id: fake.id });

      expect(result).toStrictEqual({ code: ErrorCode.NotFound, message: "Condition Not Found" });
      expect(prismaMock.condition.update).not.toHaveBeenCalled();
    });
  });
});
