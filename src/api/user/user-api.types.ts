import { FromSchema } from "json-schema-to-ts";
import { CommonDeserializationOptions } from "../../utils/schema.types";
import {
  userGetResponseSchema,
  userPatchRequestBodySchema,
  userPostPatchResponseSchema,
  userRequestParamsSchema,
  userSearchRequestQueryParamsSchema,
  userSearchResponseSchema,
} from "./user-api.schema";

export type UserRequestParams = FromSchema<typeof userRequestParamsSchema>;

export type UserSearchRequestQueryParams = FromSchema<
  typeof userSearchRequestQueryParamsSchema,
  CommonDeserializationOptions
>;

export type UserSearchResponse = FromSchema<
  typeof userSearchResponseSchema,
  CommonDeserializationOptions
>;

export type UserGetResponse = FromSchema<
  typeof userGetResponseSchema,
  CommonDeserializationOptions
>;

export type UserPatchRequestBody = FromSchema<
  typeof userPatchRequestBodySchema,
  CommonDeserializationOptions
>;

export type UserPostPatchResponse = FromSchema<
  typeof userPostPatchResponseSchema,
  CommonDeserializationOptions
>;
