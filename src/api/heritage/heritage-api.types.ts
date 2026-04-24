import { FromSchema } from "json-schema-to-ts";
import { CommonDeserializationOptions } from "../../utils/schema.types";
import {
  heritageGetPostResponseSchema,
  heritagePatchRequestBodySchema,
  heritagePostRequestBodySchema,
  heritageRequestParamsSchema,
  heritageSearchRequestQuerySchema,
  heritageSearchResponseSchema,
} from "./heritage-api.schema";

export type HeritageSearchRequestQuery = FromSchema<
  typeof heritageSearchRequestQuerySchema,
  CommonDeserializationOptions
>;

export type HeritageSearchResponse = FromSchema<
  typeof heritageSearchResponseSchema,
  CommonDeserializationOptions
>;

export type HeritageRequestParams = FromSchema<typeof heritageRequestParamsSchema>;

export type HeritageGetResponse = FromSchema<
  typeof heritageGetPostResponseSchema,
  CommonDeserializationOptions
>;

export type HeritagePostRequestBody = FromSchema<
  typeof heritagePostRequestBodySchema,
  CommonDeserializationOptions
>;

export type HeritagePostResponse = FromSchema<
  typeof heritageGetPostResponseSchema,
  CommonDeserializationOptions
>;

export type HeritagePatchRequestBody = FromSchema<
  typeof heritagePatchRequestBodySchema,
  CommonDeserializationOptions
>;
