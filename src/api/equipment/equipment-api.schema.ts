import { ItemUsage, Rarity } from "@prisma/client";
import {
  paginationRequestPropertySchema,
  paginationRequiredPropertiesSchema,
  paginationResponsePropertySchema,
} from "../../utils/pagination.types";

const commonEquipmentProperties = {
  id: {
    type: "string",
    description: "Equipment Id",
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
  name: {
    type: "string",
    description: "Equipment Name",
  },
  description: {
    type: "string",
    description: "Equipment Description",
    nullable: true,
  },
  level: {
    type: "integer",
    description: "Equipment Level",
  },
  price: {
    type: "integer",
    description: "Equipment Price in copper pieces (cp)",
  },
  bulk: {
    type: "string",
    description: 'Equipment Bulk ("—", "L", "1", "2", ...)',
  },
  hands: {
    type: "integer",
    description: "Hands required when held (0, 1, or 2)",
    nullable: true,
  },
  usage: {
    type: "string",
    description: "Equipment Usage",
    enum: Object.values(ItemUsage),
  },
  rarity: {
    type: "string",
    description: "Equipment Rarity",
    enum: Object.values(Rarity),
  },
  traits: {
    type: "array",
    items: {
      type: "object",
      properties: {
        id: {
          type: "string",
        },
        name: {
          type: "string",
        },
      },
      additionalProperties: false,
      required: ["id", "name"],
    },
  },
} as const;

export const equipmentSearchRequestQuerySchema = {
  type: "object",
  properties: {
    name: { type: "string", description: "Equipment Name" },
    usage: {
      type: "string",
      enum: Object.values(ItemUsage),
      description: "Filter by Usage",
    },
    rarity: {
      type: "string",
      enum: Object.values(Rarity),
      description: "Filter by Rarity",
    },
    level: { type: "integer", description: "Filter by Level" },
    traitIds: {
      type: "array",
      description: "Filter by Trait Ids",
      items: { type: "string", checkIdIsCuid: true },
    },
    isActive: { type: "boolean", description: "Is Equipment Active?" },
    sort: {
      type: "string",
      description: "Columns To Build Prisma OrderBy Clause",
    },
    ...paginationRequestPropertySchema,
  },
  additionalProperties: false,
} as const;

export const equipmentSearchResponseSchema = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: { ...commonEquipmentProperties },
        required: [
          "id",
          "createdAt",
          "updatedAt",
          "deletedAt",
          "name",
          "description",
          "level",
          "price",
          "bulk",
          "hands",
          "usage",
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

export const equipmentRequestParamsSchema = {
  type: "object",
  properties: {
    equipmentId: {
      type: "string",
      description: "Equipment Id",
      checkIdIsCuid: true,
    },
  },
  required: ["equipmentId"],
  additionalProperties: false,
} as const;

export const equipmentGetPostResponseSchema = {
  type: "object",
  properties: { ...commonEquipmentProperties },
  required: [
    "id",
    "createdAt",
    "updatedAt",
    "deletedAt",
    "name",
    "description",
    "level",
    "price",
    "bulk",
    "hands",
    "usage",
    "rarity",
    "traits",
  ],
  additionalProperties: false,
} as const;

export const equipmentPostRequestBodySchema = {
  type: "object",
  properties: {
    name: { type: "string", description: "Equipment Name" },
    description: { type: "string", description: "Equipment Description" },
    level: { type: "integer", description: "Equipment Level", minimum: 0 },
    price: {
      type: "integer",
      description: "Equipment Price in copper pieces (cp)",
      minimum: 0,
    },
    bulk: {
      type: "string",
      description: 'Equipment Bulk ("—", "L", "1", "2", ...)',
    },
    hands: {
      type: "integer",
      description: "Hands required when held (0, 1, or 2)",
      minimum: 0,
      maximum: 2,
      nullable: true,
    },
    usage: {
      type: "string",
      description: "Equipment Usage",
      enum: Object.values(ItemUsage),
    },
    rarity: {
      type: "string",
      description: "Equipment Rarity",
      enum: Object.values(Rarity),
    },
    traitIds: {
      type: "array",
      description: "Equipment Trait Ids",
      items: { type: "string", checkIdIsCuid: true },
    },
  },
  required: ["name", "price", "bulk", "usage", "rarity", "traitIds"],
  additionalProperties: false,
} as const;

export const equipmentPatchRequestBodySchema = {
  type: "object",
  properties: {
    name: { type: "string", description: "Equipment Name" },
    description: { type: "string", description: "Equipment Description" },
    level: { type: "integer", description: "Equipment Level", minimum: 0 },
    price: {
      type: "integer",
      description: "Equipment Price in copper pieces (cp)",
      minimum: 0,
    },
    bulk: {
      type: "string",
      description: 'Equipment Bulk ("—", "L", "1", "2", ...)',
    },
    hands: {
      type: "integer",
      description: "Hands required when held (0, 1, or 2)",
      minimum: 0,
      maximum: 2,
      nullable: true,
    },
    usage: {
      type: "string",
      description: "Equipment Usage",
      enum: Object.values(ItemUsage),
    },
    rarity: {
      type: "string",
      description: "Equipment Rarity",
      enum: Object.values(Rarity),
    },
    traitIds: {
      type: "array",
      description: "Equipment Trait Ids",
      items: { type: "string", checkIdIsCuid: true },
    },
  },
  additionalProperties: false,
  anyOf: [
    { required: ["name"] },
    { required: ["description"] },
    { required: ["level"] },
    { required: ["price"] },
    { required: ["bulk"] },
    { required: ["hands"] },
    { required: ["usage"] },
    { required: ["rarity"] },
    { required: ["traitIds"] },
  ],
} as const;
