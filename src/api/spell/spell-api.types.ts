import { FromSchema } from "json-schema-to-ts";
import { CommonDeserializationOptions } from "../../utils/schema.types";
import {
  spellGetPostResponseSchema,
  spellPatchRequestBodySchema,
  spellPostRequestBodySchema,
  spellRequestParamsSchema,
  spellSearchRequestQuerySchema,
  spellSearchResponseSchema,
} from "./spell-api.schema";

export type SpellSearchRequestQuery = FromSchema<
  typeof spellSearchRequestQuerySchema,
  CommonDeserializationOptions
>;

export type SpellSearchResponse = FromSchema<
  typeof spellSearchResponseSchema,
  CommonDeserializationOptions
>;

export type SpellRequestParams = FromSchema<typeof spellRequestParamsSchema>;

export type SpellGetResponse = FromSchema<
  typeof spellGetPostResponseSchema,
  CommonDeserializationOptions
>;

export type SpellPostRequestBody = FromSchema<
  typeof spellPostRequestBodySchema,
  CommonDeserializationOptions
>;

export type SpellPostResponse = FromSchema<
  typeof spellGetPostResponseSchema,
  CommonDeserializationOptions
>;

export type SpellPatchRequestBody = FromSchema<
  typeof spellPatchRequestBodySchema,
  CommonDeserializationOptions
>;
