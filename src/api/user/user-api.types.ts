import { FromSchema } from "json-schema-to-ts";
import { CommonDeserializationOptions } from "../../utils/schema.types";
import {
  userPostRequestBodySchema,
  userPostResponseSchema,
} from "./user-api.schema";

export type UserPostRequestBody = FromSchema<
  typeof userPostRequestBodySchema,
  CommonDeserializationOptions
>;

export type UserPostResponse = FromSchema<
  typeof userPostResponseSchema,
  CommonDeserializationOptions
>;
