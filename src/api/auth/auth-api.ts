import { Request, Response } from "express";
import { validateJSONSchemaObject } from "../../middleware/validators/ajv-validator";
import { ErrorResponse } from "../../utils/shared-types";
import { User } from "@prisma/client";
import {
  createPatchResponse,
  createPostResponse,
} from "../../utils/http-response-factory";
import { changePassword, signIn, signOut, signUp } from "./auth";
import {
  AuthPatchPasswordRequestBody,
  AuthSignInPostRequestBody,
  AuthSignInResponse,
  AuthSignUpPostRequestBody,
  AuthSignUpResponse,
} from "./auth-api.types";
import { UserRequestParams } from "../user/user-api.types";
import {
  authPatchPasswordRequestBodySchema,
  authSignInPostRequestBodySchema,
  authSignUpPostRequestBodySchema,
} from "./auth-api.schema";
import { userRequestParamsSchema } from "../user/user-api.schema";
import { getCurrentUserAuthorization } from "../../middleware/security/authorization";
import { createDeleteResponse } from "../../utils/http-response-factory";

export const handleSignUp = async (
  req: Request,
  res: Response
): Promise<Response<AuthSignUpResponse> | Response<ErrorResponse>> => {
  const body = validateJSONSchemaObject<AuthSignUpPostRequestBody>(
    authSignUpPostRequestBodySchema,
    req.body
  );
  const result = await signUp(body);

  return createPostResponse<Omit<User, "password">>(req, res, result);
};

export const handleSignIn = async (
  req: Request,
  res: Response
): Promise<Response<AuthSignInResponse> | Response<ErrorResponse>> => {
  const body = validateJSONSchemaObject<AuthSignInPostRequestBody>(
    authSignInPostRequestBodySchema,
    req.body
  );
  const result = await signIn(res, body);

  return createPostResponse<Pick<User, "id" | "role">>(req, res, result);
};

export const handleSignOut = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const result = signOut(res);
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
