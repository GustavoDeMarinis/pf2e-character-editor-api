import { FromSchema } from "json-schema-to-ts";
import { CommonDeserializationOptions } from "../../utils/schema.types";
import {
  ancestryGetResponseSchema,
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
  typeof ancestryGetResponseSchema,
  CommonDeserializationOptions
>;
