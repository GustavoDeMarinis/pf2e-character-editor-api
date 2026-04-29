import { getFakeDomain } from "../../../testing/fakes";
import { mockCount } from "../../../testing/mock-pagination";
import { prismaMock } from "../../../testing/mock-prisma";
import { getPaginationOptions } from "../../../utils/pagination";
import { ErrorCode } from "../../../utils/shared-types";
import {
  deleteDomain,
  getDomain,
  insertDomain,
  searchDomains,
  updateDomain,
} from "../domain";

describe("Domain tests", () => {
  describe("Search Domain", () => {
    test("searchDomains returns domains", async () => {
      const pagination = getPaginationOptions({});
      const fakeDomain = getFakeDomain();
      prismaMock.domain.findMany.mockResolvedValue([fakeDomain]);
      mockCount(prismaMock.domain, 1);

      const results = await searchDomains({}, pagination);

      expect(results).toStrictEqual({ items: [fakeDomain], count: 1 });
    });

    test("searchDomains handles no results", async () => {
      const pagination = getPaginationOptions({});
      prismaMock.domain.findMany.mockResolvedValue([]);
      mockCount(prismaMock.domain, 0);

      const results = await searchDomains({}, pagination);

      expect(prismaMock.domain.findMany).toHaveBeenCalledTimes(1);
      expect(results).toStrictEqual({ items: [], count: 0 });
    });
  });

  describe("Get Domain", () => {
    test("should return a domain", async () => {
      const fakeDomain = getFakeDomain({ id: "test-id" });
      prismaMock.domain.findUniqueOrThrow.mockResolvedValue(fakeDomain);

      const result = await getDomain({ id: fakeDomain.id });

      expect(result).toBe(fakeDomain);
    });

    test("should throw when domain not found", async () => {
      prismaMock.domain.findUniqueOrThrow.mockRejectedValue(
        new Error("Domain not found")
      );

      await expect(getDomain({ id: "nonexistent-id" })).rejects.toThrow(
        "Domain not found"
      );
    });
  });

  describe("Insert Domain", () => {
    test("insertDomain creates and returns new domain", async () => {
      const fakeDomain = getFakeDomain();

      prismaMock.domain.findFirst.mockResolvedValue(null);
      prismaMock.domain.create.mockResolvedValue(fakeDomain);

      const result = await insertDomain({ name: fakeDomain.name });

      expect(prismaMock.domain.create).toHaveBeenCalledTimes(1);
      expect(result).toBe(fakeDomain);
    });

    test("insertDomain returns 409 when active domain with same name exists", async () => {
      const fakeDomain = getFakeDomain();

      prismaMock.domain.findFirst.mockResolvedValue(fakeDomain);

      const result = await insertDomain({ name: fakeDomain.name });

      expect(result).toStrictEqual({
        code: ErrorCode.DataConflict,
        message: "A domain with that name already exists",
      });
      expect(prismaMock.domain.create).not.toHaveBeenCalled();
    });

    test("insertDomain allows creation when existing match is soft-deleted", async () => {
      const fakeDomain = getFakeDomain();
      const softDeleted = getFakeDomain({ name: fakeDomain.name, deletedAt: new Date() });

      prismaMock.domain.findFirst.mockResolvedValue(softDeleted);
      prismaMock.domain.create.mockResolvedValue(fakeDomain);

      const result = await insertDomain({ name: fakeDomain.name });

      expect(prismaMock.domain.create).toHaveBeenCalledTimes(1);
      expect(result).toBe(fakeDomain);
    });
  });

  describe("Update Domain", () => {
    test("updateDomain updates and returns updated domain", async () => {
      const newName = "Updated Domain";
      const fakeDomain = getFakeDomain({ id: "test-id" });

      prismaMock.domain.findUnique.mockResolvedValue(fakeDomain);
      prismaMock.domain.update.mockResolvedValue({ ...fakeDomain, name: newName });

      const result = await updateDomain({ id: fakeDomain.id }, { name: newName });

      expect(prismaMock.domain.update).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual({ ...fakeDomain, name: newName });
    });

    test("updateDomain returns 404 when domain not found", async () => {
      prismaMock.domain.findUnique.mockResolvedValue(null);

      const result = await updateDomain({ id: "nonexistent-id" }, { name: "X" });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Domain Not Found",
      });
      expect(prismaMock.domain.update).not.toHaveBeenCalled();
    });

    test("updateDomain returns 404 when domain is already deleted", async () => {
      const fakeDomain = getFakeDomain({ deletedAt: new Date() });
      prismaMock.domain.findUnique.mockResolvedValue(fakeDomain);

      const result = await updateDomain({ id: fakeDomain.id }, { name: "X" });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Domain Not Found",
      });
      expect(prismaMock.domain.update).not.toHaveBeenCalled();
    });
  });

  describe("Delete Domain", () => {
    test("deleteDomain soft-deletes and returns domain", async () => {
      const now = new Date();
      const fakeDomain = getFakeDomain({ id: "test-id" });

      prismaMock.domain.findUnique.mockResolvedValue(fakeDomain);
      prismaMock.domain.update.mockResolvedValue({ ...fakeDomain, deletedAt: now });

      const result = await deleteDomain({ id: fakeDomain.id });

      expect(prismaMock.domain.update).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual({ ...fakeDomain, deletedAt: now });
    });

    test("deleteDomain returns 404 for non-existing domain", async () => {
      prismaMock.domain.findUnique.mockResolvedValue(null);

      const result = await deleteDomain({ id: "nonexistent-id" });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Domain Not Found",
      });
      expect(prismaMock.domain.update).not.toHaveBeenCalled();
    });

    test("deleteDomain returns 404 for already-deleted domain", async () => {
      const fakeDomain = getFakeDomain({ deletedAt: new Date() });
      prismaMock.domain.findUnique.mockResolvedValue(fakeDomain);

      const result = await deleteDomain({ id: fakeDomain.id });

      expect(result).toStrictEqual({
        code: ErrorCode.NotFound,
        message: "Domain Not Found",
      });
      expect(prismaMock.domain.update).not.toHaveBeenCalled();
    });
  });
});
