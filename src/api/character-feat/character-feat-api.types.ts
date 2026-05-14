import { FromSchema } from "json-schema-to-ts";
import { CommonDeserializationOptions } from "../../utils/schema.types";
import {
  characterFeatCharacterParamsSchema,
  characterFeatGetPostResponseSchema,
  characterFeatListResponseSchema,
  characterFeatParamsSchema,
  characterFeatPostRequestBodySchema,
} from "./character-feat-api.schema";

export type CharacterFeatCharacterParams = FromSchema<typeof characterFeatCharacterParamsSchema>;

export type CharacterFeatParams = FromSchema<typeof characterFeatParamsSchema>;

export type CharacterFeatPostRequestBody = FromSchema<
  typeof characterFeatPostRequestBodySchema,
  CommonDeserializationOptions
>;

export type CharacterFeatGetResponse = FromSchema<
  typeof characterFeatGetPostResponseSchema,
  CommonDeserializationOptions
>;

export type CharacterFeatPostResponse = FromSchema<
  typeof characterFeatGetPostResponseSchema,
  CommonDeserializationOptions
>;

export type CharacterFeatListResponse = FromSchema<
  typeof characterFeatListResponseSchema,
  CommonDeserializationOptions
>;
