import { FromSchema } from "json-schema-to-ts";
import { CommonDeserializationOptions } from "../../utils/schema.types";
import {
  focusSpellGrantGetPostResponseSchema,
  focusSpellGrantPatchRequestBodySchema,
  focusSpellGrantPostRequestBodySchema,
  focusSpellGrantRequestParamsSchema,
  focusSpellGrantSearchRequestQuerySchema,
  focusSpellGrantSearchResponseSchema,
} from "./focus-spell-grant-api.schema";

export type FocusSpellGrantSearchRequestQuery = FromSchema<
  typeof focusSpellGrantSearchRequestQuerySchema,
  CommonDeserializationOptions
>;

export type FocusSpellGrantSearchResponse = FromSchema<
  typeof focusSpellGrantSearchResponseSchema,
  CommonDeserializationOptions
>;

export type FocusSpellGrantRequestParams = FromSchema<
  typeof focusSpellGrantRequestParamsSchema
>;

export type FocusSpellGrantGetResponse = FromSchema<
  typeof focusSpellGrantGetPostResponseSchema,
  CommonDeserializationOptions
>;

export type FocusSpellGrantPostRequestBody = FromSchema<
  typeof focusSpellGrantPostRequestBodySchema,
  CommonDeserializationOptions
>;

export type FocusSpellGrantPostResponse = FromSchema<
  typeof focusSpellGrantGetPostResponseSchema,
  CommonDeserializationOptions
>;

export type FocusSpellGrantPatchRequestBody = FromSchema<
  typeof focusSpellGrantPatchRequestBodySchema,
  CommonDeserializationOptions
>;
