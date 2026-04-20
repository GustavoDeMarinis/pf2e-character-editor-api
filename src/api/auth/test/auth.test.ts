import { response } from "express";
import { getFakeUser } from "../../../testing/fakes";
import { prismaMock } from "../../../testing/mock-prisma";
import { signIn, signUp } from "../auth";

describe("Auth tests", () => {
  describe("Auth Sign Up", () => {
    test("Create a User succesfully", async () => {
      const fakeUser = getFakeUser();
      const { password, failedLoginAttempts, lockedUntil, ...publicUser } = fakeUser;
      prismaMock.user.create.mockResolvedValue(publicUser as any);
      const result = await signUp(fakeUser);

      expect(prismaMock.user.create).toHaveBeenCalledTimes(1);
      expect(result).not.toBeFalsy();
      expect(result).toBe(publicUser);
    });
  });

  describe("Auth Sign In", () => {
    test("SignIn with User succesfully", async () => {
      const mReq = { cookies: {}, headers: {}, ip: "127.0.0.1" } as any;
      const mRes = response;
      const fakeUser = getFakeUser();
      prismaMock.user.findFirst.mockResolvedValue(fakeUser);
      prismaMock.session.create.mockResolvedValue({} as any);
      prismaMock.user.update.mockResolvedValue(fakeUser);
      const { userEmail, password } = fakeUser;
      const result = await signIn(mReq, mRes, { userEmail, password });
      expect(result).not.toBeFalsy();
    });
  });
});
