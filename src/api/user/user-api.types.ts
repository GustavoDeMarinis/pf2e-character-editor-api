import { FromSchema } from "json-schema-to-ts";
import { CommonDeserializationOptions } from "../../utils/schema.types";
import {
  userPatchRequestBodySchema,
  userPostPatchResponseSchema,
  userRequestParamsSchema,
} from "./user-api.schema";

export type UserRequestParams = FromSchema<typeof userRequestParamsSchema>;

export type UserPatchRequestBody = FromSchema<
  typeof userPatchRequestBodySchema,
  CommonDeserializationOptions
>;

export type UserPostPatchResponse = FromSchema<
  typeof userPostPatchResponseSchema,
  CommonDeserializationOptions
>;
