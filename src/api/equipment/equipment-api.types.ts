import { FromSchema } from "json-schema-to-ts";
import { CommonDeserializationOptions } from "../../utils/schema.types";
import {
  equipmentGetPostResponseSchema,
  equipmentPatchRequestBodySchema,
  equipmentPostRequestBodySchema,
  equipmentRequestParamsSchema,
  equipmentSearchRequestQuerySchema,
  equipmentSearchResponseSchema,
} from "./equipment-api.schema";

export type EquipmentSearchRequestQuery = FromSchema<
  typeof equipmentSearchRequestQuerySchema,
  CommonDeserializationOptions
>;

export type EquipmentSearchResponse = FromSchema<
  typeof equipmentSearchResponseSchema,
  CommonDeserializationOptions
>;

export type EquipmentRequestParams = FromSchema<typeof equipmentRequestParamsSchema>;

export type EquipmentGetResponse = FromSchema<
  typeof equipmentGetPostResponseSchema,
  CommonDeserializationOptions
>;

export type EquipmentPostRequestBody = FromSchema<
  typeof equipmentPostRequestBodySchema,
  CommonDeserializationOptions
>;

export type EquipmentPostResponse = FromSchema<
  typeof equipmentGetPostResponseSchema,
  CommonDeserializationOptions
>;

export type EquipmentPatchRequestBody = FromSchema<
  typeof equipmentPatchRequestBodySchema,
  CommonDeserializationOptions
>;
