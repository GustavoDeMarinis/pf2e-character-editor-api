import { FromSchema } from "json-schema-to-ts";
import { CommonDeserializationOptions } from "../../utils/schema.types";

import {
  authPatchPasswordRequestBodySchema,
  authSignInPostRequestBodySchema,
  authSignInResponseSchema,
  authSignUpPostRequestBodySchema,
  authSignUpResponseSchema,
} from "./auth-api.schema";

export type AuthSignUpPostRequestBody = FromSchema<
  typeof authSignUpPostRequestBodySchema,
  CommonDeserializationOptions
>;

export type AuthSignUpResponse = FromSchema<
  typeof authSignUpResponseSchema,
  CommonDeserializationOptions
>;

export type AuthSignInPostRequestBody = FromSchema<
  typeof authSignInPostRequestBodySchema
>;

export type AuthSignInResponse = FromSchema<typeof authSignInResponseSchema>;

export type AuthPatchPasswordRequestBody = FromSchema<
  typeof authPatchPasswordRequestBodySchema
>;
