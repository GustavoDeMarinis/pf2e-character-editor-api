import { ItemUsage, Rarity } from "@prisma/client";
import { getFakeEquipment, getFakeTrait } from "../../../testing/fakes";
import { mockCount } from "../../../testing/mock-pagination";
import { prismaMock } from "../../../testing/mock-prisma";
import { getPaginationOptions } from "../../../utils/pagination";
import { ErrorCode } from "../../../utils/shared-types";
import {
  deleteEquipment,
  getEquipment,
  insertEquipment,
  searchEquipment,
  updateEquipment,
} from "../equipment";

describe("Equipment tests", () => {
  describe("Search Equipment", () => {
    test("searchEquipment returns items", async () => {
      const pagination = getPaginationOptions({});
      const fake = getFakeEquipment();
      prismaMock.equipment.findMany.mockResolvedValue([fake]);
      mockCount(prismaMock.equipment, 1);

      const result = await searchEquipment({}, pagination);

      expect(result).toStrictEqual({ items: [fake], count: 1 });
    });

    test("searchEquipment handles empty result", async () => {
      const pagination = getPaginationOptions({});
      prismaMock.equipment.findMany.mockResolvedValue([]);
      mockCount(prismaMock.equipment, 0);

      const result = await searchEquipment({}, pagination);

      expect(prismaMock.equipment.findMany).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual({ items: [], count: 0 });
    });

    test("searchEquipment applies name filter (contains, case-insensitive)", async () => {
      const pagination = getPaginationOptions({});
      prismaMock.equipment.findMany.mockResolvedValue([]);
      mockCount(prismaMock.equipment, 0);

      await searchEquipment({ name: "rope" }, pagination);

      expect(prismaMock.equipment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            name: { contains: "rope", mode: "insensitive" },
          }),
        })
      );
    });

    test("searchEquipment applies usage, rarity and level filters", async () => {
      const pagination = getPaginationOptions({});
      prismaMock.equipment.findMany.mockResolvedValue([]);
      mockCount(prismaMock.equipment, 0);

      await searchEquipment(
        { usage: ItemUsage.Held, rarity: Rarity.Uncommon, level: 3 },
        pagination
      );

      expect(prismaMock.equipment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            usage: ItemUsage.Held,
            rarity: Rarity.Uncommon,
            level: 3,
          }),
        })
      );
    });

    test("searchEquipment applies traitIds filter as relational every clause", async () => {
      const pagination = getPaginationOptions({});
      prismaMock.equipment.findMany.mockResolvedValue([]);
      mockCount(prismaMock.equipment, 0);

      await searchEquipment({ traitIds: ["t1", "t2"] }, pagination);

      expect(prismaMock.equipment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            traits: { every: { id: { in: ["t1", "t2"] } } },
          }),
        })
      );
    });

    test("searchEquipment applies isActive filter", async () => {
      const pagination = getPaginationOptions({});
      prismaMock.equipment.findMany.mockResolvedValue([]);
      mockCount(prismaMock.equipment, 0);

      await searchEquipment({ isActive: false }, pagination);

      expect(prismaMock.equipment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ deletedAt: { not: null } }),
        })
      );
    });
  });

  describe("Get Equipment", () => {
    test("getEquipment returns item by id", async () => {
      const fake = getFakeEquipment({ id: "test-id" });
      prismaMock.equipment.findUniqueOrThrow.mockResolvedValue(fake);

      const result = await getEquipment({ id: fake.id });

      expect(result).toBe(fake);
    });

    test("getEquipment throws when not found", async () => {
      prismaMock.equipment.findUniqueOrThrow.mockRejectedValue(
        new Error("Not found")
      );

      await expect(getEquipment({ id: "nonexistent" })).rejects.toThrow(
        "Not found"
      );
    });
  });

  describe("Insert Equipment", () => {
    test("insertEquipment creates item (no traits)", async () => {
      const fake = getFakeEquipment();

      prismaMock.equipment.findFirst.mockResolvedValue(null);
      prismaMock.equipment.create.mockResolvedValue(fake);

      const { id, createdAt, updatedAt, deletedAt, ...rest } = fake;
      const result = await insertEquipment({ ...rest, traitIds: [] });

      expect(prismaMock.equipment.create).toHaveBeenCalledTimes(1);
      expect(result).toBe(fake);
    });

    test("insertEquipment creates item with traitIds (verifies connect)", async () => {
      const fake = getFakeEquipment();
      const trait = getFakeTrait();

      prismaMock.equipment.findFirst.mockResolvedValue(null);
      prismaMock.trait.findMany.mockResolvedValue([trait]);
      prismaMock.equipment.create.mockResolvedValue(fake);

      const { id, createdAt, updatedAt, deletedAt, ...rest } = fake;
      const result = await insertEquipment({ ...rest, traitIds: [trait.id] });

      expect(prismaMock.equipment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            traits: { connect: [{ id: trait.id }] },
          }),
        })
      );
      expect(result).toBe(fake);
    });

    test("insertEquipment returns 409 when active name conflict", async () => {
      const existing = getFakeEquipment({ deletedAt: null });

      prismaMock.equipment.findFirst.mockResolvedValue(existing);

      const { id, createdAt, updatedAt, deletedAt, ...rest } = existing;
      const result = await insertEquipment({ ...rest, traitIds: [] });

      expect(result).toStrictEqual({
        code: ErrorCode.DataConflict,
        message: "An equipment item with that name already exists",
      });
      expect(prismaMock.equipment.create).not.toHaveBeenCalled();
    });

    test("insertEquipment allows creation when only a soft-deleted match exists", async () => {
      const softDeleted = getFakeEquipment({ deletedAt: new Date() });
      const newFake = getFakeEquipment({ name: softDeleted.name });

      prismaMock.equipment.findFirst.mockResolvedValue(softDeleted);
      prismaMock.equipment.create.mockResolvedValue(newFake);

      const { id, createdAt, updatedAt, deletedAt, ...rest } = newFake;
      const result = await insertEquipment({ ...rest, traitIds: [] });

      expect(prismaMock.equipment.create).toHaveBeenCalledTimes(1);
      expect(result).toBe(newFake);
    });

    test("insertEquipment returns 404 when a traitId does not exist", async () => {
      const fake = getFakeEquipment();

      prismaMock.equipment.findFirst.mockResolvedValue(null);
      prismaMock.trait.findMany.mockResolvedValue([]); // none found

      const { id, createdAt, updatedAt, deletedAt, ...rest } = fake;
      const result = await insertEquipment({
        ...rest,
        traitIds: ["nonexistent-id"],
      });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Trait not found in traitIds",
      });
      expect(prismaMock.equipment.create).not.toHaveBeenCalled();
    });
  });

  describe("Update Equipment", () => {
    test("updateEquipment updates and returns item", async () => {
      const fake = getFakeEquipment({ id: "equip-123" });

      prismaMock.equipment.findUnique.mockResolvedValue(fake);
      prismaMock.equipment.update.mockResolvedValue({ ...fake, name: "Updated" });

      const result = await updateEquipment({ id: fake.id }, { name: "Updated" });

      expect(prismaMock.equipment.update).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual({ ...fake, name: "Updated" });
    });

    test("updateEquipment replaces traits via set", async () => {
      const fake = getFakeEquipment({ id: "equip-123" });
      const trait = getFakeTrait();

      prismaMock.equipment.findUnique.mockResolvedValue(fake);
      prismaMock.trait.findMany.mockResolvedValue([trait]);
      prismaMock.equipment.update.mockResolvedValue(fake);

      await updateEquipment({ id: fake.id }, { traitIds: [trait.id] });

      expect(prismaMock.equipment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            traits: { set: [{ id: trait.id }] },
          }),
        })
      );
    });

    test("updateEquipment returns 404 when a traitId does not exist", async () => {
      const fake = getFakeEquipment({ id: "equip-123" });

      prismaMock.equipment.findUnique.mockResolvedValue(fake);
      prismaMock.trait.findMany.mockResolvedValue([]); // none found

      const result = await updateEquipment(
        { id: fake.id },
        { traitIds: ["missing"] }
      );

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Trait not found in traitIds",
      });
      expect(prismaMock.equipment.update).not.toHaveBeenCalled();
    });

    test("updateEquipment returns 404 when item not found", async () => {
      prismaMock.equipment.findUnique.mockResolvedValue(null);

      const result = await updateEquipment({ id: "nonexistent" }, { name: "X" });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Equipment Not Found",
      });
      expect(prismaMock.equipment.update).not.toHaveBeenCalled();
    });
  });

  describe("Delete Equipment", () => {
    test("deleteEquipment soft-deletes the item", async () => {
      const fake = getFakeEquipment({ deletedAt: null });
      const deletedAt = new Date();

      prismaMock.equipment.findUnique.mockResolvedValue(fake);
      prismaMock.equipment.update.mockResolvedValue({ ...fake, deletedAt });

      const result = await deleteEquipment({ id: fake.id });

      expect(prismaMock.equipment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ deletedAt: expect.any(Date) }),
        })
      );
      expect((result as typeof fake).deletedAt).toBeTruthy();
    });

    test("deleteEquipment returns 404 when item not found", async () => {
      prismaMock.equipment.findUnique.mockResolvedValue(null);

      const result = await deleteEquipment({ id: "nonexistent" });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Equipment Not Found",
      });
      expect(prismaMock.equipment.update).not.toHaveBeenCalled();
    });

    test("deleteEquipment returns 404 when item already deleted", async () => {
      const fake = getFakeEquipment({ deletedAt: new Date() });
      prismaMock.equipment.findUnique.mockResolvedValue(fake);

      const result = await deleteEquipment({ id: fake.id });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Equipment Not Found",
      });
      expect(prismaMock.equipment.update).not.toHaveBeenCalled();
    });
  });
});
