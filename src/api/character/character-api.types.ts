import { FromSchema } from "json-schema-to-ts";
import { CommonDeserializationOptions } from "../../utils/schema.types";
import {
  characterGetResponseSchema,
  characterPatchRequestBodySchema,
  characterPostResponseSchema,
  characterRequestParamsSchema,
  characterSearchRequestQuerySchema,
  characterSearchResponseSchema,
} from "./character-api.schema";

export type CharacterSearchRequestQuery = FromSchema<
  typeof characterSearchRequestQuerySchema,
  CommonDeserializationOptions
>;

export type CharacterSearchResponse = FromSchema<
  typeof characterSearchResponseSchema,
  CommonDeserializationOptions
>;

export type CharacterRequestParams = FromSchema<
  typeof characterRequestParamsSchema,
  CommonDeserializationOptions
>;

export type CharacterGetResponse = FromSchema<
  typeof characterGetResponseSchema,
  CommonDeserializationOptions
>;

export type CharacterPostResponse = FromSchema<
  typeof characterPostResponseSchema,
  CommonDeserializationOptions
>;

export type CharacterPatchRequestBody = FromSchema<
  typeof characterPatchRequestBodySchema,
  CommonDeserializationOptions
>;
