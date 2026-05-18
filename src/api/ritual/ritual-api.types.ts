import { FromSchema } from "json-schema-to-ts";
import { CommonDeserializationOptions } from "../../utils/schema.types";
import {
  ritualGetPostResponseSchema,
  ritualPatchRequestBodySchema,
  ritualPostRequestBodySchema,
  ritualRequestParamsSchema,
  ritualSearchRequestQuerySchema,
  ritualSearchResponseSchema,
} from "./ritual-api.schema";

export type RitualSearchRequestQuery = FromSchema<
  typeof ritualSearchRequestQuerySchema,
  CommonDeserializationOptions
>;

export type RitualSearchResponse = FromSchema<
  typeof ritualSearchResponseSchema,
  CommonDeserializationOptions
>;

export type RitualRequestParams = FromSchema<typeof ritualRequestParamsSchema>;

export type RitualGetResponse = FromSchema<
  typeof ritualGetPostResponseSchema,
  CommonDeserializationOptions
>;

export type RitualPostRequestBody = FromSchema<
  typeof ritualPostRequestBodySchema,
  CommonDeserializationOptions
>;

export type RitualPostResponse = FromSchema<
  typeof ritualGetPostResponseSchema,
  CommonDeserializationOptions
>;

export type RitualPatchRequestBody = FromSchema<
  typeof ritualPatchRequestBodySchema,
  CommonDeserializationOptions
>;
