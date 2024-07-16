import {
  getFakeCurrentUserAuthorization,
  getFakeUser,
} from "../../../testing/fakes";
import { mockCount } from "../../../testing/mock-pagination";
import { prismaMock } from "../../../testing/mock-prisma";
import { getPaginationOptions } from "../../../utils/pagination";
import { deleteUser, getUser, searchUser, updateUser } from "../user";

describe("User Test", () => {
  describe("Search User", () => {
    test("searchUser returns User", async () => {
      const pagination = getPaginationOptions({});
      const fakeUser = getFakeUser();
      prismaMock.user.findMany.mockResolvedValue([fakeUser]);

      mockCount(prismaMock.user, 1);

      const results = await searchUser(
        { userEmail: fakeUser.userEmail },
        pagination
      );

      expect(results).not.toBeFalsy();
      expect(results).toStrictEqual({
        items: [fakeUser],
        count: 1,
      });
    });
  });
  describe("Get User", () => {
    test("getUser, should return a User", async () => {
      const fakeUser = getFakeUser({
        id: "cl1v51jp9000eqofg5bnu90gd",
      });
      prismaMock.user.findUniqueOrThrow.mockResolvedValue(fakeUser);
      const character = await getUser({ id: fakeUser.id });
      expect(character).not.toBeFalsy();
      expect(character).toBe(fakeUser);
    });
  });
  describe("Update User", () => {
    test("updateUser updates and returns updated User", async () => {
      const newUserEmail = "Pepi@pepi.com";
      const fakeUser = getFakeUser({
        id: "cl1v51jp9000eqofg5bnu90gd",
      });
      prismaMock.user.findUnique.mockResolvedValue(fakeUser);
      prismaMock.user.update.mockResolvedValue({
        ...fakeUser,
        userEmail: newUserEmail,
      });
      const result = await updateUser(
        { id: fakeUser.id },
        {
          userEmail: newUserEmail,
        }
      );

      expect(prismaMock.user.update).toHaveBeenCalledTimes(1);
      expect(result).not.toBeFalsy();
      expect(result).toStrictEqual({
        ...fakeUser,
        userEmail: newUserEmail,
      });
    });
  });

  describe("Delete User", () => {
    test("deleteCharacter deletes and returns deleted Character", async () => {
      const currentUser = getFakeCurrentUserAuthorization();
      const now = new Date();
      const fakeUser = getFakeUser({
        id: "cl1v51jp9000eqofg5bnu90gd",
      });
      prismaMock.user.findUnique.mockResolvedValue(fakeUser);
      prismaMock.user.update.mockResolvedValue({
        ...fakeUser,
        deletedAt: now,
      });
      const result = await deleteUser({ id: fakeUser.id }, currentUser);

      expect(prismaMock.user.update).toHaveBeenCalledTimes(1);
      expect(result).not.toBeFalsy();
      expect(result).toStrictEqual({
        ...fakeUser,
        deletedAt: now,
      });
    });
  });
});
