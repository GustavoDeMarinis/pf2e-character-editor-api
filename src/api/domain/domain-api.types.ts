import { FromSchema } from "json-schema-to-ts";
import { CommonDeserializationOptions } from "../../utils/schema.types";
import {
  domainGetPostResponseSchema,
  domainPatchRequestBodySchema,
  domainPostRequestBodySchema,
  domainRequestParamsSchema,
  domainSearchRequestQuerySchema,
  domainSearchResponseSchema,
} from "./domain-api.schema";

export type DomainSearchRequestQuery = FromSchema<
  typeof domainSearchRequestQuerySchema,
  CommonDeserializationOptions
>;

export type DomainSearchResponse = FromSchema<
  typeof domainSearchResponseSchema,
  CommonDeserializationOptions
>;

export type DomainRequestParams = FromSchema<typeof domainRequestParamsSchema>;

export type DomainGetResponse = FromSchema<
  typeof domainGetPostResponseSchema,
  CommonDeserializationOptions
>;

export type DomainPostRequestBody = FromSchema<
  typeof domainPostRequestBodySchema,
  CommonDeserializationOptions
>;

export type DomainPostResponse = FromSchema<
  typeof domainGetPostResponseSchema,
  CommonDeserializationOptions
>;

export type DomainPatchRequestBody = FromSchema<
  typeof domainPatchRequestBodySchema,
  CommonDeserializationOptions
>;
