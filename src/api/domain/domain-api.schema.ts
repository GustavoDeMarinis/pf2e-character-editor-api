import {
  paginationRequestPropertySchema,
  paginationRequiredPropertiesSchema,
  paginationResponsePropertySchema,
} from "../../utils/pagination.types";

const commonDomainProperties = {
  id: { type: "string", description: "Domain Id" },
  createdAt: { type: "string", format: "date-time" },
  updatedAt: { type: "string", format: "date-time" },
  deletedAt: { type: "string", format: "date-time-nullable" },
  name: { type: "string", description: "Domain Name" },
  description: { type: "string", description: "Domain Description", nullable: true },
} as const;

export const domainSearchRequestQuerySchema = {
  type: "object",
  properties: {
    name: { type: "string", description: "Domain Name" },
    deityId: { type: "string", description: "Filter by Deity Id", checkIdIsCuid: true },
    isActive: { type: "boolean", description: "Is Domain Active?" },
    sort: { type: "string", description: "Columns To Build Prisma OrderBy Clause" },
    ...paginationRequestPropertySchema,
  },
  additionalProperties: false,
} as const;

export const domainSearchResponseSchema = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: { ...commonDomainProperties },
        required: ["id", "createdAt", "updatedAt", "deletedAt", "name", "description"],
        additionalProperties: false,
      },
    },
    ...paginationResponsePropertySchema,
  },
  ...paginationRequiredPropertiesSchema,
} as const;

export const domainRequestParamsSchema = {
  type: "object",
  properties: {
    domainId: {
      type: "string",
      description: "Domain Id",
      checkIdIsCuid: true,
    },
  },
  required: ["domainId"],
  additionalProperties: false,
} as const;

export const domainGetPostResponseSchema = {
  type: "object",
  properties: { ...commonDomainProperties },
  required: ["id", "createdAt", "updatedAt", "deletedAt", "name", "description"],
  additionalProperties: false,
} as const;

export const domainPostRequestBodySchema = {
  type: "object",
  properties: {
    name: { type: "string", description: "Domain Name" },
    description: { type: "string", description: "Domain Description" },
  },
  required: ["name"],
  additionalProperties: false,
} as const;

export const domainPatchRequestBodySchema = {
  type: "object",
  properties: {
    name: { type: "string", description: "Domain Name" },
    description: { type: "string", description: "Domain Description" },
  },
  additionalProperties: false,
  anyOf: [{ required: ["name"] }, { required: ["description"] }],
} as const;
