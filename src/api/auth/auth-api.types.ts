import { FromSchema } from "json-schema-to-ts";
import { CommonDeserializationOptions } from "../../utils/schema.types";

import {
  authPatchPasswordRequestBodySchema,
  authSignInPostRequestBodySchema,
  authSignUpPostRequestBodySchema,
} from "./auth-api.schema";

export type AuthSignUpPostRequestBody = FromSchema<
  typeof authSignUpPostRequestBodySchema,
  CommonDeserializationOptions
>;

export type AuthSignInPostRequestBody = FromSchema<
  typeof authSignInPostRequestBodySchema
>;

export type AuthPatchPasswordRequestBody = FromSchema<
  typeof authPatchPasswordRequestBodySchema
>;
