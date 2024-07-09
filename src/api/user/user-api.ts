import { Request, Response } from "express";
import { validateJSONSchemaObject } from "../../middleware/validators/ajv-validator";
import { ErrorResponse } from "../../utils/shared-types";
import { UserPostRequestBody, UserPostResponse } from "./user-api.types";
import { userPostRequestBodySchema } from "./user-api.schema";
import { User } from "@prisma/client";
import { insertUser } from "./user";
import { createPostResponse } from "../../utils/http-response-factory";

export const handlePostUser = async (
  req: Request,
  res: Response
): Promise<Response<UserPostResponse> | Response<ErrorResponse>> => {
  const body = validateJSONSchemaObject<UserPostRequestBody>(
    userPostRequestBodySchema,
    req.body
  );
  const result = await insertUser(body);

  return createPostResponse<Omit<User, "password">>(req, res, result);
};
