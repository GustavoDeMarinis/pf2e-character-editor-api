import {
  paginationRequestPropertySchema,
  paginationRequiredPropertiesSchema,
  paginationResponsePropertySchema,
} from "../../utils/pagination.types";

const commonConditionProperties = {
  id: { type: "string", description: "Condition Id" },
  createdAt: { type: "string", format: "date-time" },
  updatedAt: { type: "string", format: "date-time" },
  deletedAt: { type: "string", format: "date-time-nullable" },
  name: { type: "string", description: "Condition Name" },
  description: { type: "string", description: "Condition Description" },
  hasValue: { type: "boolean", description: "Whether this condition has a numeric value" },
  overrides: {
    type: "array",
    items: {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
      },
      required: ["id", "name"],
      additionalProperties: false,
    },
  },
  overriddenBy: {
    type: "array",
    items: {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
      },
      required: ["id", "name"],
      additionalProperties: false,
    },
  },
} as const;

export const conditionSearchRequestQuerySchema = {
  type: "object",
  properties: {
    name: { type: "string", description: "Condition Name" },
    hasValue: { type: "boolean", description: "Filter by hasValue" },
    isActive: { type: "boolean", description: "Is Condition Active?" },
    sort: { type: "string", description: "Columns To Build Prisma OrderBy Clause" },
    ...paginationRequestPropertySchema,
  },
  additionalProperties: false,
} as const;

export const conditionSearchResponseSchema = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: { ...commonConditionProperties },
        required: [
          "id",
          "createdAt",
          "updatedAt",
          "deletedAt",
          "name",
          "description",
          "hasValue",
          "overrides",
          "overriddenBy",
        ],
        additionalProperties: false,
      },
    },
    ...paginationResponsePropertySchema,
  },
  ...paginationRequiredPropertiesSchema,
} as const;

export const conditionRequestParamsSchema = {
  type: "object",
  properties: {
    conditionId: {
      type: "string",
      description: "Condition Id",
      checkIdIsCuid: true,
    },
  },
  required: ["conditionId"],
  additionalProperties: false,
} as const;

export const conditionGetPostResponseSchema = {
  type: "object",
  properties: { ...commonConditionProperties },
  required: [
    "id",
    "createdAt",
    "updatedAt",
    "deletedAt",
    "name",
    "description",
    "hasValue",
    "overrides",
    "overriddenBy",
  ],
  additionalProperties: false,
} as const;

export const conditionPostRequestBodySchema = {
  type: "object",
  properties: {
    name: { type: "string", description: "Condition Name" },
    description: { type: "string", description: "Condition Description" },
    hasValue: {
      type: "boolean",
      description: "Whether this condition has a numeric value",
      default: false,
    },
    overrideIds: {
      type: "array",
      description: "Ids of conditions this condition overrides",
      items: { type: "string", checkIdIsCuid: true },
    },
  },
  required: ["name", "description"],
  additionalProperties: false,
} as const;

export const conditionPatchRequestBodySchema = {
  type: "object",
  properties: {
    name: { type: "string", description: "Condition Name" },
    description: { type: "string", description: "Condition Description" },
    hasValue: { type: "boolean", description: "Whether this condition has a numeric value" },
    overrideIds: {
      type: "array",
      description: "Ids of conditions this condition overrides",
      items: { type: "string", checkIdIsCuid: true },
    },
  },
  additionalProperties: false,
  anyOf: [
    { required: ["name"] },
    { required: ["description"] },
    { required: ["hasValue"] },
    { required: ["overrideIds"] },
  ],
} as const;
