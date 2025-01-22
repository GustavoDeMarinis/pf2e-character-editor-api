import { FromSchema } from "json-schema-to-ts";
import { CommonDeserializationOptions } from "../../utils/schema.types";
import {
  languageGetPostResponseSchema,
  languagePatchRequestBodySchema,
  languagePostRequestBodySchema,
  languageRequestParamsSchema,
  languageSearchRequestQuerySchema,
  languageSearchResponseSchema,
} from "./language-api.schema";

export type LanguageSearchRequestQuery = FromSchema<
  typeof languageSearchRequestQuerySchema,
  CommonDeserializationOptions
>;

export type LanguageSearchResponse = FromSchema<
  typeof languageSearchResponseSchema,
  CommonDeserializationOptions
>;

export type LanguageRequestParams = FromSchema<
  typeof languageRequestParamsSchema
>;

export type LanguageGetResponse = FromSchema<
  typeof languageGetPostResponseSchema,
  CommonDeserializationOptions
>;

export type LanguagePostRequestBody = FromSchema<
  typeof languagePostRequestBodySchema,
  CommonDeserializationOptions
>;

export type LanguagePostResponse = FromSchema<
  typeof languageGetPostResponseSchema,
  CommonDeserializationOptions
>;

export type LanguagePatchRequestBody = FromSchema<
  typeof languagePatchRequestBodySchema,
  CommonDeserializationOptions
>;
