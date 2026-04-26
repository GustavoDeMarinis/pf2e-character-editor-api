import { Rarity } from "@prisma/client";
import {
  paginationRequestPropertySchema,
  paginationRequiredPropertiesSchema,
  paginationResponsePropertySchema,
} from "../../utils/pagination.types";

const commonHeritageProperties = {
  id: { type: "string", 
      description: "Heritage Id" 
  },
  createdAt: { 
    type: "string", 
    format: "date-time" 
  },
  updatedAt: { 
    type: "string", 
    format: "date-time" 
  },
  deletedAt: { 
    type: "string", 
    format: "date-time-nullable" 
  },
  name: { 
    type: "string", 
    description: "Heritage Name" 
  },
  description: { 
    type: "string", 
    description: "Heritage Description",
    nullable: true
  },
  ancestryId: { 
    type: "string", 
    description: "Ancestry Id" 
  },
  rarity: {
    type: "string",
    description: "Heritage Rarity",
    enum: Object.values(Rarity),
  },
  traits: {
    type: "array",
    items: {
      type: "object",
      properties: {
        name: { 
          type: "string"
        },
        description: { 
          type: "string", 
          nullable: true 
        },
      },
      additionalProperties: false,
      required: ["name", "description"],
    },
  },
} as const;

export const heritageSearchRequestQuerySchema = {
  type: "object",
  properties: {
    name: { type: "string", description: "Heritage Name" },
    ancestryId: { type: "string", description: "Filter by Ancestry Id" },
    rarity: {
      type: "string",
      enum: Object.values(Rarity),
      description: "Heritage Rarity",
    },
    isActive: { type: "boolean", description: "Is Heritage Active?" },
    sort: {
      type: "string",
      description: "Columns To Build Prisma OrderBy Clause",
    },
    ...paginationRequestPropertySchema,
  },
  additionalProperties: false,
} as const;

export const heritageSearchResponseSchema = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: { ...commonHeritageProperties },
        required: [
          "id",
          "createdAt",
          "updatedAt",
          "deletedAt",
          "name",
          "description",
          "ancestryId",
          "rarity",
          "traits",
        ],
        additionalProperties: false,
      },
    },
    ...paginationResponsePropertySchema,
  },
  ...paginationRequiredPropertiesSchema,
} as const;

export const heritageRequestParamsSchema = {
  type: "object",
  properties: {
    heritageId: {
      type: "string",
      description: "Heritage Id",
      checkIdIsCuid: true,
    },
  },
  required: ["heritageId"],
  additionalProperties: false,
} as const;

export const heritageGetPostResponseSchema = {
  type: "object",
  properties: { ...commonHeritageProperties },
  required: [
    "id",
    "createdAt",
    "updatedAt",
    "deletedAt",
    "name",
    "description",
    "ancestryId",
    "rarity",
    "traits",
  ],
  additionalProperties: false,
} as const;

export const heritagePostRequestBodySchema = {
  type: "object",
  properties: {
    name: { type: "string", description: "Heritage Name" },
    description: { type: "string", description: "Heritage Description" },
    ancestryId: {
      type: "string",
      description: "Ancestry Id",
      checkIdIsCuid: true,
    },
    rarity: {
      type: "string",
      description: "Heritage Rarity",
      enum: Object.values(Rarity),
    },
    traitIds: {
      type: "array",
      description: "Heritage Trait Ids",
      items: { type: "string", checkIdIsCuid: true },
    },
  },
  required: ["name", "ancestryId", "rarity", "traitIds"],
  additionalProperties: false,
} as const;

export const heritagePatchRequestBodySchema = {
  type: "object",
  properties: {
    name: { type: "string", description: "Heritage Name" },
    description: { type: "string", description: "Heritage Description" },
    rarity: {
      type: "string",
      description: "Heritage Rarity",
      enum: Object.values(Rarity),
    },
    traitIds: {
      type: "array",
      description: "Heritage Trait Ids",
      items: { type: "string", checkIdIsCuid: true },
    },
  },
  additionalProperties: false,
  anyOf: [
    { required: ["name"] },
    { required: ["description"] },
    { required: ["rarity"] },
    { required: ["traitIds"] },
  ],
} as const;
