import { FromSchema } from "json-schema-to-ts";
import { CommonDeserializationOptions } from "../../utils/schema.types";
import {
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
