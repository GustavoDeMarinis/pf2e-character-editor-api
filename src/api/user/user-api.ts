import { Request, Response } from "express";
import { validateJSONSchemaObject } from "../../middleware/validators/ajv-validator";
import { ErrorResponse } from "../../utils/shared-types";

import { User } from "@prisma/client";
import {
  UserSearchResult,
  deleteUser,
  getUser,
  searchUser,
  updateUser,
} from "./user";
import {
  createGetArrayResponse,
  createGetResponse,
  createPatchResponse,
  createPostResponse,
} from "../../utils/http-response-factory";
import {
  userPatchRequestBodySchema,
  userRequestParamsSchema,
  userSearchRequestQueryParamsSchema,
} from "./user-api.schema";
import {
  UserGetResponse,
  UserPatchRequestBody,
  UserRequestParams,
  UserSearchRequestQueryParams,
  UserSearchResponse,
} from "./user-api.types";
import { getPaginationOptions } from "../../utils/pagination";
import { createDeleteResponse } from "../../utils/http-response-factory";
import { getCurrentUserAuthorization } from "../../middleware/security/authorization";

export const handleSearchUser = async (
  req: Request,
  res: Response
): Promise<Response<UserSearchResponse> | Response<ErrorResponse>> => {
  const { pageOffset, pageLimit, sort, ...query } =
    validateJSONSchemaObject<UserSearchRequestQueryParams>(
      userSearchRequestQueryParamsSchema,
      req.query
    );

  const pagination = getPaginationOptions({
    pageLimit: pageLimit,
    pageOffset: pageOffset,
  });
  const result = await searchUser(query, pagination, sort);
  return createGetArrayResponse<UserSearchResult>(res, result, { pagination });
};

export const handleGetUser = async (
  req: Request,
  res: Response
): Promise<Response<UserGetResponse> | Response<ErrorResponse>> => {
  const { userId } = validateJSONSchemaObject<UserRequestParams>(
    userSearchRequestQueryParamsSchema,
    req.params
  );

  const result = await getUser({ id: userId });
  return createGetResponse<Omit<User, "password">>(res, result);
};

export const handlePatchUser = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { userId } = validateJSONSchemaObject<UserRequestParams>(
    userRequestParamsSchema,
    req.params
  );
  const body = validateJSONSchemaObject<UserPatchRequestBody>(
    userPatchRequestBodySchema,
    req.body
  );
  const result = await updateUser({ id: userId }, body);

  return createPatchResponse<Omit<User, "password">>(res, result);
};

export const handleDeleteUser = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { userId } = validateJSONSchemaObject<UserRequestParams>(
    userRequestParamsSchema,
    req.params
  );
  const currentUser = getCurrentUserAuthorization(req);
  const result = await deleteUser({ id: userId }, currentUser);

  return createDeleteResponse<User>(res, result);
};
