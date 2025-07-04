import { FromSchema } from "json-schema-to-ts";
import { CommonDeserializationOptions } from "../../utils/schema.types";
import {
  skillGetResponseSchema,
  skillPatchRequestBodySchema,
  skillPostRequestBodySchema,
  skillPostResponseSchema,
  skillRequestParamsSchema,
  skillSearchRequestQuerySchema,
  skillSearchResponseSchema,
} from "./skill-api.schema";

export type SkillSearchRequestQuery = FromSchema<
  typeof skillSearchRequestQuerySchema,
  CommonDeserializationOptions
>;

export type SkillSearchResponse = FromSchema<
  typeof skillSearchResponseSchema,
  CommonDeserializationOptions
>;

export type SkillRequestParams = FromSchema<typeof skillRequestParamsSchema>;

export type SkillGetResponse = FromSchema<
  typeof skillGetResponseSchema,
  CommonDeserializationOptions
>;

export type SkillPostRequestBody = FromSchema<
  typeof skillPostRequestBodySchema,
  CommonDeserializationOptions
>;

export type SkillPostResponse = FromSchema<
  typeof skillPostResponseSchema,
  CommonDeserializationOptions
>;

export type SkillPatchRequestBody = FromSchema<
  typeof skillPatchRequestBodySchema,
  CommonDeserializationOptions
>;
