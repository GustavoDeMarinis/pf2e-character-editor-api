import { Rarity } from "@prisma/client";
import {
  paginationRequestPropertySchema,
  paginationRequiredPropertiesSchema,
  paginationResponsePropertySchema,
} from "../../utils/pagination.types";

export const languageSearchRequestQuerySchema = {
  type: "object",
  properties: {
    rarity: {
      description: "Language Rarity Filter",
      type: "string",
      enum: Object.values(Rarity),
    },
    isActive: {
      type: "boolean",
      description: "Is The Character Active?",
    },
    sort: {
      type: "string",
      description: "Columns To Build Prisma OrderBy Clause",
    },
    ...paginationRequestPropertySchema,
  },

  additionalProperties: false,
} as const;

const commonLanguageProperties = {
  name: {
    type: "string",
    description: "Language Name",
  },
  description: {
    type: "string",
    description: "Language Description",
  },
  rarity: {
    type: "string",
    description: "Language Rarity",
    enum: Object.values(Rarity),
  },
} as const;

export const languageSearchResponseSchema = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Language Id",
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
          },
          deletedAt: {
            type: "string",
            format: "date-time-nullable",
          },
          ...commonLanguageProperties,
        },
        required: [
          "id",
          "createdAt",
          "updatedAt",
          "deletedAt",
          "name",
          "description",
          "rarity",
        ],
        additionalProperties: false,
      },
    },
    ...paginationResponsePropertySchema,
  },
  ...paginationRequiredPropertiesSchema,
} as const;

export const languageGetPostResponseSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      description: "Language Id",
    },
    createdAt: {
      type: "string",
      format: "date-time",
    },
    updatedAt: {
      type: "string",
      format: "date-time",
    },
    deletedAt: {
      type: "string",
      format: "date-time-nullable",
    },
    ...commonLanguageProperties,
  },
  required: [
    "id",
    "createdAt",
    "updatedAt",
    "deletedAt",
    "name",
    "description",
    "rarity",
  ],
  additionalProperties: false,
} as const;

export const languageRequestParamsSchema = {
  type: "object",
  properties: {
    languageId: {
      type: "string",
      checkIdIsCuid: true,
    },
  },
  required: ["languageId"],
  additionalProperties: false,
} as const;

export const languagePostRequestBodySchema = {
  type: "object",
  properties: {
    ...commonLanguageProperties,
  },
  required: ["name", "description", "rarity"],
  additionalProperties: false,
} as const;

export const languagePatchRequestBodySchema = {
  type: "object",
  properties: {
    ...commonLanguageProperties,
  },
  anyOf: [
    { required: ["name"] },
    { required: ["description"] },
    { required: ["rarity"] },
  ],
  additionalProperties: false,
} as const;
