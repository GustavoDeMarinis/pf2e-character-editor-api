import { FromSchema } from "json-schema-to-ts";
import { CommonDeserializationOptions } from "../../utils/schema.types";
import {
  characterClassGetResponseSchema,
  characterClassPatchRequestBodySchema,
  characterClassPostRequestBodySchema,
  characterClassPostResponseSchema,
  characterClassRequestParamsSchema,
  characterClassSearchRequestQuerySchema,
  characterClassSearchResponseSchema,
} from "./character-class.schema";

export type CharacterClassSearchRequestQuery = FromSchema<
  typeof characterClassSearchRequestQuerySchema,
  CommonDeserializationOptions
>;

export type CharacterClassSearchResponse = FromSchema<
  typeof characterClassSearchResponseSchema,
  CommonDeserializationOptions
>;

export type CharacterClassRequestParams = FromSchema<
  typeof characterClassRequestParamsSchema
>;

export type CharacterClassGetResponse = FromSchema<
  typeof characterClassGetResponseSchema,
  CommonDeserializationOptions
>;

export type CharacterClassPostRequestBody = FromSchema<
  typeof characterClassPostRequestBodySchema,
  CommonDeserializationOptions
>;

export type CharacterClassPostResponse = FromSchema<
  typeof characterClassPostResponseSchema,
  CommonDeserializationOptions
>;

export type CharacterClassPatchRequestBody = FromSchema<
  typeof characterClassPatchRequestBodySchema,
  CommonDeserializationOptions
>;
