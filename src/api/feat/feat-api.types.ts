import { FromSchema } from "json-schema-to-ts";
import { CommonDeserializationOptions } from "../../utils/schema.types";
import {
  featGetPostResponseSchema,
  featPatchRequestBodySchema,
  featPostRequestBodySchema,
  featRequestParamsSchema,
  featSearchRequestQuerySchema,
  featSearchResponseSchema,
} from "./feat-api.schema";

export type FeatSearchRequestQuery = FromSchema<
  typeof featSearchRequestQuerySchema,
  CommonDeserializationOptions
>;

export type FeatSearchResponse = FromSchema<
  typeof featSearchResponseSchema,
  CommonDeserializationOptions
>;

export type FeatRequestParams = FromSchema<typeof featRequestParamsSchema>;

export type FeatGetResponse = FromSchema<
  typeof featGetPostResponseSchema,
  CommonDeserializationOptions
>;

export type FeatPostRequestBody = FromSchema<
  typeof featPostRequestBodySchema,
  CommonDeserializationOptions
>;

export type FeatPostResponse = FromSchema<
  typeof featGetPostResponseSchema,
  CommonDeserializationOptions
>;

export type FeatPatchRequestBody = FromSchema<
  typeof featPatchRequestBodySchema,
  CommonDeserializationOptions
>;
