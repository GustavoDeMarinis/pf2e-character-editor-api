import { FromSchema } from "json-schema-to-ts";
import { CommonDeserializationOptions } from "../../utils/schema.types";
import {
  armorBasePatchRequestBodySchema,
  armorBasePostGetResponseSchema,
  armorBasePostRequestBodySchema,
  armorBaseRequestParamsSchema,
  armorBaseSearchRequestQuerySchema,
  armorBaseSearchResponseSchema,
} from "./armor-base-api.schema";

export type ArmorBaseSearchResponse = FromSchema<
  typeof armorBaseSearchResponseSchema,
  CommonDeserializationOptions
>;

export type ArmorBaseSearchRequestQuery = FromSchema<
  typeof armorBaseSearchRequestQuerySchema,
  CommonDeserializationOptions
>;

export type ArmorBaseGetResponse = FromSchema<
  typeof armorBasePostGetResponseSchema,
  CommonDeserializationOptions
>;
export type ArmorBaseRequestParams = FromSchema<
  typeof armorBaseRequestParamsSchema
>;

export type ArmorBasePostResponse = FromSchema<
  typeof armorBasePostGetResponseSchema,
  CommonDeserializationOptions
>;

export type ArmorBasePostRequestBody = FromSchema<
  typeof armorBasePostRequestBodySchema
>;

export type ArmorBasePatchRequestBody = FromSchema<
  typeof armorBasePatchRequestBodySchema
>;
