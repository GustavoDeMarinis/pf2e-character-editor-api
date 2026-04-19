import { Request, Response, NextFunction } from "express";
import { csrfMiddleware } from "../csrf";

const makeReq = (
  method: string = "POST",
  path: string = "/test",
  cookies: Record<string, string> = {},
  headers: Record<string, string> = {}
): Partial<Request> => ({
  method,
  path,
  cookies,
  headers,
});

const makeRes = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.cookie = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("CSRF middleware", () => {
  describe("token generation and setting", () => {
    test("generates and sets csrf_token cookie on GET if missing", () => {
      const req = makeReq("GET") as Request;
      const res = makeRes() as Response;
      const next: NextFunction = jest.fn();

      csrfMiddleware(req, res, next);

      expect(res.cookie).toHaveBeenCalledWith(
        "csrf_token",
        expect.any(String),
        expect.objectContaining({ httpOnly: false })
      );
      expect(next).toHaveBeenCalled();
    });

    test("preserves existing csrf_token cookie", () => {
      const existingToken = "existing-token-12345";
      const req = makeReq("POST", "/test", { csrf_token: existingToken }) as Request;
      const res = makeRes() as Response;
      const next: NextFunction = jest.fn();

      csrfMiddleware(req, res, next);

      expect(res.cookie).toHaveBeenCalledWith(
        "csrf_token",
        existingToken,
        expect.any(Object)
      );
    });
  });

  describe("safe methods", () => {
    test("allows GET requests without token validation", () => {
      const req = makeReq("GET") as Request;
      const res = makeRes() as Response;
      const next: NextFunction = jest.fn();

      csrfMiddleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test("allows HEAD requests without token validation", () => {
      const req = makeReq("HEAD") as Request;
      const res = makeRes() as Response;
      const next: NextFunction = jest.fn();

      csrfMiddleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test("allows OPTIONS requests without token validation", () => {
      const req = makeReq("OPTIONS") as Request;
      const res = makeRes() as Response;
      const next: NextFunction = jest.fn();

      csrfMiddleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe("exempt paths", () => {
    test("allows /auth/signIn without token validation", () => {
      const req = makeReq("POST", "/auth/signIn") as Request;
      const res = makeRes() as Response;
      const next: NextFunction = jest.fn();

      csrfMiddleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test("allows /auth/signUp without token validation", () => {
      const req = makeReq("POST", "/auth/signUp") as Request;
      const res = makeRes() as Response;
      const next: NextFunction = jest.fn();

      csrfMiddleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test("allows /auth/refresh without token validation", () => {
      const req = makeReq("POST", "/auth/refresh") as Request;
      const res = makeRes() as Response;
      const next: NextFunction = jest.fn();

      csrfMiddleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe("POST validation", () => {
    test("rejects POST without X-CSRF-Token header", () => {
      const token = "generated-token";
      const req = makeReq("POST", "/protected", { csrf_token: token }) as Request;
      const res = makeRes() as Response;
      const next: NextFunction = jest.fn();

      csrfMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    test("rejects POST with mismatched X-CSRF-Token header", () => {
      const token = "generated-token";
      const req = makeReq("POST", "/protected", { csrf_token: token }, {
        "x-csrf-token": "wrong-token",
      }) as Request;
      const res = makeRes() as Response;
      const next: NextFunction = jest.fn();

      csrfMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    test("allows POST with matching X-CSRF-Token header", () => {
      const token = "generated-token";
      const req = makeReq("POST", "/protected", { csrf_token: token }, {
        "x-csrf-token": token,
      }) as Request;
      const res = makeRes() as Response;
      const next: NextFunction = jest.fn();

      csrfMiddleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe("PATCH and DELETE", () => {
    test("rejects PATCH without token", () => {
      const token = "generated-token";
      const req = makeReq("PATCH", "/protected", { csrf_token: token }) as Request;
      const res = makeRes() as Response;
      const next: NextFunction = jest.fn();

      csrfMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    test("rejects DELETE without token", () => {
      const token = "generated-token";
      const req = makeReq("DELETE", "/protected", { csrf_token: token }) as Request;
      const res = makeRes() as Response;
      const next: NextFunction = jest.fn();

      csrfMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    test("allows PATCH with matching token", () => {
      const token = "generated-token";
      const req = makeReq("PATCH", "/protected", { csrf_token: token }, {
        "x-csrf-token": token,
      }) as Request;
      const res = makeRes() as Response;
      const next: NextFunction = jest.fn();

      csrfMiddleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
