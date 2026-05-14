import { FromSchema } from "json-schema-to-ts";
import { CommonDeserializationOptions } from "../../utils/schema.types";
import {
  characterSpellCharacterParamsSchema,
  characterSpellGetPostResponseSchema,
  characterSpellListResponseSchema,
  characterSpellParamsSchema,
  characterSpellPostRequestBodySchema,
} from "./character-spell-api.schema";

export type CharacterSpellCharacterParams = FromSchema<typeof characterSpellCharacterParamsSchema>;

export type CharacterSpellParams = FromSchema<typeof characterSpellParamsSchema>;

export type CharacterSpellPostRequestBody = FromSchema<
  typeof characterSpellPostRequestBodySchema,
  CommonDeserializationOptions
>;

export type CharacterSpellGetResponse = FromSchema<
  typeof characterSpellGetPostResponseSchema,
  CommonDeserializationOptions
>;

export type CharacterSpellPostResponse = FromSchema<
  typeof characterSpellGetPostResponseSchema,
  CommonDeserializationOptions
>;

export type CharacterSpellListResponse = FromSchema<
  typeof characterSpellListResponseSchema,
  CommonDeserializationOptions
>;
