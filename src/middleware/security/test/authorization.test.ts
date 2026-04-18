import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { authorize } from "../authorization";
import { config } from "../../../config";

const makeReq = (cookie?: string): Partial<Request> => ({
  cookies: {
    access_token: cookie ?? "",
    user: { userId: "user-1", role: UserRole.Player },
  },
});

const makeRes = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const validToken = () =>
  jwt.sign({ userId: "user-1", role: UserRole.Player }, config.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });

describe("authorize middleware", () => {
  describe("missing / invalid token", () => {
    test("returns 401 and does NOT call next when token is missing", async () => {
      const req = makeReq("") as Request;
      const res = makeRes() as Response;
      const next: NextFunction = jest.fn();

      await authorize()(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    test("returns 401 and does NOT call next when token is invalid", async () => {
      const req = makeReq("not.a.valid.token") as Request;
      const res = makeRes() as Response;
      const next: NextFunction = jest.fn();

      await authorize()(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    test("returns 401 and does NOT call next when token is expired", async () => {
      const expired = jwt.sign(
        { userId: "user-1", role: UserRole.Player },
        config.JWT_SECRET_KEY,
        { expiresIn: -1 }
      );
      const req = makeReq(expired) as Request;
      const res = makeRes() as Response;
      const next: NextFunction = jest.fn();

      await authorize()(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("role mismatch", () => {
    test("returns 403 and does NOT call next when role is not allowed", async () => {
      const token = validToken();
      const req = makeReq(token) as Request;
      const res = makeRes() as Response;
      const next: NextFunction = jest.fn();

      await authorize({ roles: [UserRole.Admin] })(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("valid token and authorized role", () => {
    test("calls next when token is valid and no role restriction", async () => {
      const token = validToken();
      const req = makeReq(token) as Request;
      const res = makeRes() as Response;
      const next: NextFunction = jest.fn();

      await authorize()(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });

    test("calls next when token is valid and role matches", async () => {
      const token = validToken();
      const req = makeReq(token) as Request;
      const res = makeRes() as Response;
      const next: NextFunction = jest.fn();

      await authorize({ roles: [UserRole.Player] })(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});
