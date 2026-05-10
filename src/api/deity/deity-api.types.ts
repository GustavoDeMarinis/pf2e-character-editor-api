import { FromSchema } from "json-schema-to-ts";
import { CommonDeserializationOptions } from "../../utils/schema.types";
import {
  deityGetPostResponseSchema,
  deityPatchRequestBodySchema,
  deityPostRequestBodySchema,
  deityRequestParamsSchema,
  deitySearchRequestQuerySchema,
  deitySearchResponseSchema,
} from "./deity-api.schema";

export type DeitySearchRequestQuery = FromSchema<
  typeof deitySearchRequestQuerySchema,
  CommonDeserializationOptions
>;

export type DeitySearchResponse = FromSchema<
  typeof deitySearchResponseSchema,
  CommonDeserializationOptions
>;

export type DeityRequestParams = FromSchema<typeof deityRequestParamsSchema>;

export type DeityGetResponse = FromSchema<
  typeof deityGetPostResponseSchema,
  CommonDeserializationOptions
>;

export type DeityPostRequestBody = FromSchema<
  typeof deityPostRequestBodySchema,
  CommonDeserializationOptions
>;

export type DeityPostResponse = FromSchema<
  typeof deityGetPostResponseSchema,
  CommonDeserializationOptions
>;

export type DeityPatchRequestBody = FromSchema<
  typeof deityPatchRequestBodySchema,
  CommonDeserializationOptions
>;
