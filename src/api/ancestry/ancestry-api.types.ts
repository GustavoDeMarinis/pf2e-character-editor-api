import { FromSchema } from "json-schema-to-ts";
import { CommonDeserializationOptions } from "../../utils/schema.types";
import {
  ancestryGetPostResponseSchema,
  ancestryPatchRequestBodySchema,
  ancestryPostRequestBodySchema,
  ancestryRequestParamsSchema,
  ancestrySearchRequestQuerySchema,
  ancestrySearchResponseSchema,
} from "./ancestry-api.schema";

export type AncestrySearchRequestQuery = FromSchema<
  typeof ancestrySearchRequestQuerySchema,
  CommonDeserializationOptions
>;

export type AncestrySearchResponse = FromSchema<
  typeof ancestrySearchResponseSchema,
  CommonDeserializationOptions
>;

export type AncestryRequestParams = FromSchema<
  typeof ancestryRequestParamsSchema
>;

export type AncestryGetResponse = FromSchema<
  typeof ancestryGetPostResponseSchema,
  CommonDeserializationOptions
>;

export type AncestryPostRequestBody = FromSchema<
  typeof ancestryPostRequestBodySchema,
  CommonDeserializationOptions
>;

export type AncestryPostResponse = FromSchema<
  typeof ancestryGetPostResponseSchema,
  CommonDeserializationOptions
>;

export type AncestryPatchRequestBody = FromSchema<
  typeof ancestryPatchRequestBodySchema,
  CommonDeserializationOptions
>;
