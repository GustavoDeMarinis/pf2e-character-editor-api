import { FromSchema } from "json-schema-to-ts";
import { CommonDeserializationOptions } from "../../utils/schema.types";
import {
  conditionGetPostResponseSchema,
  conditionPatchRequestBodySchema,
  conditionPostRequestBodySchema,
  conditionRequestParamsSchema,
  conditionSearchRequestQuerySchema,
  conditionSearchResponseSchema,
} from "./condition-api.schema";

export type ConditionSearchRequestQuery = FromSchema<
  typeof conditionSearchRequestQuerySchema,
  CommonDeserializationOptions
>;

export type ConditionSearchResponse = FromSchema<
  typeof conditionSearchResponseSchema,
  CommonDeserializationOptions
>;

export type ConditionRequestParams = FromSchema<typeof conditionRequestParamsSchema>;

export type ConditionGetResponse = FromSchema<
  typeof conditionGetPostResponseSchema,
  CommonDeserializationOptions
>;

export type ConditionPostRequestBody = FromSchema<
  typeof conditionPostRequestBodySchema,
  CommonDeserializationOptions
>;

export type ConditionPostResponse = FromSchema<
  typeof conditionGetPostResponseSchema,
  CommonDeserializationOptions
>;

export type ConditionPatchRequestBody = FromSchema<
  typeof conditionPatchRequestBodySchema,
  CommonDeserializationOptions
>;
