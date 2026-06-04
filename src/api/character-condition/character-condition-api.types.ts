import { FromSchema } from "json-schema-to-ts";
import { CommonDeserializationOptions } from "../../utils/schema.types";
import {
  characterConditionCharacterParamsSchema,
  characterConditionGetPostResponseSchema,
  characterConditionListRequestQuerySchema,
  characterConditionListResponseSchema,
  characterConditionParamsSchema,
  characterConditionPatchRequestBodySchema,
  characterConditionPostRequestBodySchema,
} from "./character-condition-api.schema";

export type CharacterConditionCharacterParams = FromSchema<
  typeof characterConditionCharacterParamsSchema
>;

export type CharacterConditionParams = FromSchema<typeof characterConditionParamsSchema>;

export type CharacterConditionListRequestQuery = FromSchema<
  typeof characterConditionListRequestQuerySchema,
  CommonDeserializationOptions
>;

export type CharacterConditionPostRequestBody = FromSchema<
  typeof characterConditionPostRequestBodySchema,
  CommonDeserializationOptions
>;

export type CharacterConditionPatchRequestBody = FromSchema<
  typeof characterConditionPatchRequestBodySchema,
  CommonDeserializationOptions
>;

export type CharacterConditionPostResponse = FromSchema<
  typeof characterConditionGetPostResponseSchema,
  CommonDeserializationOptions
>;

export type CharacterConditionListResponse = FromSchema<
  typeof characterConditionListResponseSchema,
  CommonDeserializationOptions
>;
