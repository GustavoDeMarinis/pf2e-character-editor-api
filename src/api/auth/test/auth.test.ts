import { Prisma, User } from "@prisma/client";
import { response } from "express";
import { getFakeUser } from "../../../testing/fakes";
import { mockCount } from "../../../testing/mock-pagination";
import { prismaMock } from "../../../testing/mock-prisma";
import { getPaginationOptions } from "../../../utils/pagination";
import { signIn, signUp } from "../auth";

describe("Auth tests", () => {
  describe("Auth Sign Up", () => {
    test("Create a User succesfully", async () => {
      const fakeUser = getFakeUser();
      const { password, ...publicUser } = fakeUser;
      prismaMock.user.create.mockResolvedValue(fakeUser); //TODO need to figure how to add a select, since the return should return user without password
      const result = await signUp(fakeUser);

      expect(prismaMock.user.create).toHaveBeenCalledTimes(1);
      expect(result).not.toBeFalsy();
      expect(result).toBe(fakeUser);
    });
  });

  describe("Auth Sign In", () => {
    test("SignIn with User succesfully", async () => {
      const mRes = response;
      const fakeUser = getFakeUser();
      prismaMock.user.findFirst.mockResolvedValue(fakeUser);
      const { userEmail, password, ...rest } = fakeUser;
      const result = await signIn(mRes, { userEmail, password });
      expect(result).not.toBeFalsy();
      expect(result).toBe(fakeUser);
    });
  });
});
