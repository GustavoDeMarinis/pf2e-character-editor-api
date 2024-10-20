import { FromSchema } from "json-schema-to-ts";
import { CommonDeserializationOptions } from "../../utils/schema.types";
import {
  weaponBasePostGetResponseSchema,
  weaponBasePostRequestBodySchema,
  weaponBaseRequestParamsSchema,
  weaponBaseSearchRequestQuerySchema,
  weaponBaseSearchResponseSchema,
} from "./weapon-base-api.schema";

export type WeaponBaseSearchResponse = FromSchema<
  typeof weaponBaseSearchResponseSchema,
  CommonDeserializationOptions
>;

export type WeaponBaseSearchRequestQuery = FromSchema<
  typeof weaponBaseSearchRequestQuerySchema,
  CommonDeserializationOptions
>;

export type WeaponBaseGetResponse = FromSchema<
  typeof weaponBasePostGetResponseSchema,
  CommonDeserializationOptions
>;
export type WeaponBaseRequestParams = FromSchema<
  typeof weaponBaseRequestParamsSchema
>;

export type WeaponBasePostResponse = FromSchema<
  typeof weaponBasePostGetResponseSchema,
  CommonDeserializationOptions
>;

export type WeaponBasePostRequestBody = FromSchema<
  typeof weaponBasePostRequestBodySchema
>;
