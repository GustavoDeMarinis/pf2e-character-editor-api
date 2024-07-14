import { Request, Response } from "express";
import { validateJSONSchemaObject } from "../../middleware/validators/ajv-validator";
import { ErrorResponse } from "../../utils/shared-types";

import { User } from "@prisma/client";
import { updateUser } from "./user";
import { createPostResponse } from "../../utils/http-response-factory";
import {
  userPatchRequestBodySchema,
  userRequestParamsSchema,
} from "./user-api.schema";
import {
  UserPatchRequestBody,
  UserPostPatchResponse,
  UserRequestParams,
} from "./user-api.types";

export const handlePatchUser = async (
  req: Request,
  res: Response
): Promise<Response<UserPostPatchResponse> | Response<ErrorResponse>> => {
  const { userId } = validateJSONSchemaObject<UserRequestParams>(
    userRequestParamsSchema,
    req.params
  );
  const body = validateJSONSchemaObject<UserPatchRequestBody>(
    userPatchRequestBodySchema,
    req.body
  );
  const result = await updateUser({ id: userId }, body);

  return createPostResponse<Omit<User, "password">>(req, res, result);
};
