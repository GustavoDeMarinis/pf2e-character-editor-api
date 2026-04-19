import { Request, Response } from "express";
import { validateJSONSchemaObject } from "../../middleware/validators/ajv-validator";
import { ErrorResponse } from "../../utils/shared-types";
import { User } from "@prisma/client";
import { UserSearchResult } from "../user/user";
import {
  createDeleteResponse,
  createGetArrayResponse,
  createPatchResponse,
  createPostResponse,
} from "../../utils/http-response-factory";
import {
  changePassword,
  getSessions,
  refreshSession,
  revokeSession,
  signIn,
  signOut,
  signUp,
} from "./auth";
import {
  AuthPatchPasswordRequestBody,
  AuthSignInPostRequestBody,
  AuthSignInResponse,
  AuthSignUpPostRequestBody,
  AuthSignUpResponse,
  SessionIdParams,
} from "./auth-api.types";
import { UserRequestParams } from "../user/user-api.types";
import {
  authPatchPasswordRequestBodySchema,
  authSignInPostRequestBodySchema,
  authSignUpPostRequestBodySchema,
  sessionIdParamsSchema,
} from "./auth-api.schema";
import { userRequestParamsSchema } from "../user/user-api.schema";
import { getCurrentUserAuthorization } from "../../middleware/security/authorization";

export const handleSignUp = async (
  req: Request,
  res: Response
): Promise<Response<AuthSignUpResponse> | Response<ErrorResponse>> => {
  const body = validateJSONSchemaObject<AuthSignUpPostRequestBody>(
    authSignUpPostRequestBodySchema,
    req.body
  );
  const result = await signUp(body);

  return createPostResponse<UserSearchResult>(req, res, result);
};

export const handleSignIn = async (
  req: Request,
  res: Response
): Promise<Response<AuthSignInResponse> | Response<ErrorResponse>> => {
  const body = validateJSONSchemaObject<AuthSignInPostRequestBody>(
    authSignInPostRequestBodySchema,
    req.body
  );
  const result = await signIn(req, res, body);

  return createPostResponse<Pick<User, "id" | "role">>(req, res, result);
};

export const handleSignOut = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  await signOut(req, res);
  return createDeleteResponse<void>(res, undefined);
};

export const handleRefresh = async (
  req: Request,
  res: Response
): Promise<Response<{ token: string }> | Response<ErrorResponse>> => {
  const result = await refreshSession(req, res);
  return createPostResponse<{ token: string }>(req, res, result);
};

export const handleGetSessions = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const currentUser = getCurrentUserAuthorization(req);
  const sessions = await getSessions(currentUser.userId);
  return createGetArrayResponse(res, { items: sessions, count: sessions.length });
};

export const handleRevokeSession = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { sessionId } = validateJSONSchemaObject<SessionIdParams>(
    sessionIdParamsSchema,
    req.params
  );
  const currentUser = getCurrentUserAuthorization(req);
  const result = await revokeSession(sessionId, currentUser);
  return createDeleteResponse<void>(res, result);
};

export const handleChangePassword = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { userId } = validateJSONSchemaObject<UserRequestParams>(
    userRequestParamsSchema,
    req.params
  );
  const { currentPassword, newPassword } =
    validateJSONSchemaObject<AuthPatchPasswordRequestBody>(
      authPatchPasswordRequestBodySchema,
      req.body
    );

  const currentUser = getCurrentUserAuthorization(req);
  const result = await changePassword({ id: userId }, currentUser, {
    currentPassword,
    newPassword,
  });

  return createPatchResponse<void>(res, result);
};
