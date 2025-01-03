import { Attribute } from "@prisma/client";
import {
  paginationRequestPropertySchema,
  paginationRequiredPropertiesSchema,
  paginationResponsePropertySchema,
} from "../../utils/pagination.types";

const commonCharacterClassProperties = {
  id: {
    description: "Class Id",
    type: "string",
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
  className: {
    description: "Name Of The Class",
    type: "string",
  },
  description: {
    description: "Class Description",
    type: "string",
  },
  keyAttributes: {
    description: "Attribute Option To Give Bonus",
    type: "array",
    items: {
      type: "string",
      enum: Object.values(Attribute),
    },
  },
  hitPoints: {
    description: "Amount Of Hitpoints Gained Per Level",
    type: "number",
  },
} as const;

export const characterClassSearchResponseSchema = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          ...commonCharacterClassProperties,
        },
        required: [
          "id",
          "createdAt",
          "updatedAt",
          "deletedAt",
          "className",
          "description",
          "keyAttributes",
          "hitPoints",
        ],
        additionalProperties: false,
      },
    },
    ...paginationResponsePropertySchema,
  },
  ...paginationRequiredPropertiesSchema,
} as const;

export const characterClassSearchRequestQuerySchema = {
  type: "object",
  properties: {
    className: {
      description: "Class Name",
      type: "string",
    },
    hitPoints: {
      description: "Amount Of Hitpoints Gained Per Level",
      type: "number",
    },
    isActive: {
      type: "boolean",
      description: "Is The Character Class Active?",
    },
    sort: {
      type: "string",
      description: "Columns To Build Prisma OrderBy Clause",
    },
    ...paginationRequestPropertySchema,
  },
  additionalProperties: false,
} as const;

export const characterClassGetResponseSchema = {
  type: "object",
  properties: {
    ...commonCharacterClassProperties,
  },
  required: [
    "id",
    "createdAt",
    "updatedAt",
    "deletedAt",
    "className",
    "description",
    "keyAttributes",
    "hitPoints",
  ],
  additionalProperties: false,
} as const;

export const characterClassRequestParamsSchema = {
  type: "object",
  properties: {
    characterClassId: {
      type: "string",
      description: "character Class Id",
      checkIdIsCuid: true,
    },
  },
  additionalProperties: false,
  required: ["characterClassId"],
} as const;

export const characterClassPostRequestBodySchema = {
  type: "object",
  properties: {
    className: {
      description: "Name Of The Class",
      type: "string",
    },
    description: {
      description: "Class Description",
      type: "string",
    },
    keyAttributes: {
      description: "Attribute Option To Give Bonus",
      type: "array",
      items: {
        type: "string",
        enum: Object.values(Attribute),
      },
    },
    hitPoints: {
      description: "Amount Of Hitpoints Gained Per Level",
      type: "number",
    },
  },
  additionalProperties: false,
  required: ["className", "description", "keyAttributes", "hitPoints"],
} as const;

export const characterClassPostResponseSchema = {
  type: "object",
  properties: {
    ...commonCharacterClassProperties,
  },
  required: [
    "id",
    "createdAt",
    "updatedAt",
    "deletedAt",
    "className",
    "description",
    "keyAttributes",
    "hitPoints",
  ],
  additionalProperties: false,
} as const;

export const characterClassPatchRequestBodySchema = {
  type: "object",
  properties: {
    className: {
      description: "Name Of The Class",
      type: "string",
    },
    description: {
      description: "Class Description",
      type: "string",
    },
    keyAttributes: {
      description: "Attribute Option To Give Bonus",
      type: "array",
      items: {
        type: "string",
        enum: Object.values(Attribute),
      },
    },
    hitPoints: {
      description: "Amount Of Hitpoints Gained Per Level",
      type: "number",
    },
  },
  additionalProperties: false,
  anyOf: [
    { required: ["className"] },
    { required: ["description"] },
    { required: ["keyAttributes"] },
    { required: ["hitPoints"] },
  ],
} as const;
