import { Request, Response } from "express";
import { validateJSONSchemaObject } from "../../middleware/validators/ajv-validator";
import { ErrorResponse } from "../../utils/shared-types";
import { User } from "@prisma/client";
import {
  createPatchResponse,
  createPostResponse,
} from "../../utils/http-response-factory";
import { changePassword, signIn, signUp } from "./auth";
import {
  AuthSignInPostRequestBody,
  AuthSignUpPostRequestBody,
} from "./auth-api.types";
import {
  UserPostPatchResponse,
  UserRequestParams,
} from "../user/user-api.types";
import { isErrorResult } from "../../utils/exceptions";
import {
  authSignInPostRequestBodySchema,
  authSignUpPostRequestBodySchema,
} from "./auth-api.schema";
import { userRequestParamsSchema } from "../user/user-api.schema";
import { getCurrentUserAuthorization } from "../../middleware/security/authorization";

export const handleSignUp = async (
  req: Request,
  res: Response
): Promise<Response<UserPostPatchResponse> | Response<ErrorResponse>> => {
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
): Promise<Response<UserPostPatchResponse> | Response<ErrorResponse>> => {
  const body = validateJSONSchemaObject<AuthSignInPostRequestBody>(
    authSignInPostRequestBodySchema,
    req.body
  );
  const result = await signIn(res, body);
  if (isErrorResult(result)) {
    return createPostResponse<Omit<User, "userEmail" | "password">>(
      req,
      res,
      result
    );
  }

  return createPostResponse<Pick<User, "id">>(req, res, result);
};

export const handleChangePassword = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { userId } = validateJSONSchemaObject<UserRequestParams>(
    userRequestParamsSchema,
    req.params
  );
  const currentUser = getCurrentUserAuthorization(req);
  const result = await changePassword({ id: userId }, currentUser);

  return createPatchResponse<void>(res, result);
};
