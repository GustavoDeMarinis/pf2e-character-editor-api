import { FromSchema } from "json-schema-to-ts";
import { CommonDeserializationOptions } from "../../utils/schema.types";
import {
  backgroundGetPostResponseSchema,
  backgroundPatchRequestBodySchema,
  backgroundPostRequestBodySchema,
  backgroundRequestParamsSchema,
  backgroundSearchRequestQuerySchema,
  backgroundSearchResponseSchema,
} from "./background-api.schema";

export type BackgroundSearchRequestQuery = FromSchema<
  typeof backgroundSearchRequestQuerySchema,
  CommonDeserializationOptions
>;

export type BackgroundSearchResponse = FromSchema<
  typeof backgroundSearchResponseSchema,
  CommonDeserializationOptions
>;

export type BackgroundRequestParams = FromSchema<typeof backgroundRequestParamsSchema>;

export type BackgroundGetResponse = FromSchema<
  typeof backgroundGetPostResponseSchema,
  CommonDeserializationOptions
>;

export type BackgroundPostRequestBody = FromSchema<
  typeof backgroundPostRequestBodySchema,
  CommonDeserializationOptions
>;

export type BackgroundPostResponse = FromSchema<
  typeof backgroundGetPostResponseSchema,
  CommonDeserializationOptions
>;

export type BackgroundPatchRequestBody = FromSchema<
  typeof backgroundPatchRequestBodySchema,
  CommonDeserializationOptions
>;
