import { AncestrySize, Attribute, Rarity } from "@prisma/client";
import {
  paginationRequestPropertySchema,
  paginationRequiredPropertiesSchema,
  paginationResponsePropertySchema,
} from "../../utils/pagination.types";

export const ancestrySearchRequestQuerySchema = {
  type: "object",
  properties: {
    traits: {
      description: "Ancestry Traits",
      type: "array",
      items: {
        type: "string",
      },
    },
    hitpoints: {
      description: "Ancestry HitPoints",
      type: "number",
    },
    size: {
      description: "Ancestry Size",
      type: "string",
      enum: Object.values(AncestrySize),
    },
    speed: {
      description: "Ancestry Land Speed",
      type: "number",
    },
    attributeBoost: {
      description: "Ancestry Attribute Boost",
      type: "array",
      items: {
        type: "string",
        enum: Object.values(Attribute),
      },
    },
    attributeFlaw: {
      description: "Ancestry Attribute Flaw",
      type: "array",
      items: {
        type: "string",
        enum: Object.values(Attribute),
      },
    },
    rarity: {
      description: "Ancestry Rarity",
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

const commonAncestryProperties = {
  id: {
    type: "string",
    description: "Ancestry Id",
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
    description: "Ancestry Name",
  },
  description: {
    type: "string",
    description: "Ancestry Description",
  },
  traits: {
    type: "array",
    items: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Ancestry Trait Name",
        },
        description: {
          type: "string",
          description: "Ancestry Trait Description",
        },
      },
      additionalProperties: false,
      required: ["name", "description"],
    },
  },
  hitPoints: {
    type: "number",
    description: "Ancestry Base HitPoints",
  },
  size: {
    type: "string",
    description: "Ancestry Size",
    enum: Object.values(AncestrySize),
  },
  speed: {
    type: "number",
    description: "Ancestry Base Speed",
  },
  attributeBoost: {
    type: "array",
    description: "Ancestry Attribute Boosts",
    items: {
      type: "string",
      enum: Object.values(Attribute),
    },
  },
  attributeFlaw: {
    type: "array",
    description: "Ancestry Attribute Flaws",
    items: {
      type: "string",
      enum: Object.values(Attribute),
    },
  },
  languages: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Ancestry Initial Known Languages",
      },
    },
  },
  rarity: {
    type: "string",
    description: "Ancestry Rarity",
    enum: Object.values(Rarity),
  },
} as const;

export const ancestrySearchResponseSchema = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          ...commonAncestryProperties,
        },
        required: [
          "id",
          "createdAt",
          "updatedAt",
          "deletedAt",
          "name",
          "description",
          "traits",
          "hitpoints",
          "size",
          "speed",
          "attributeBoost",
          "attributeFlaw",
          "languages",
          "rarity",
        ],
        additionalProperties: false,
      },
    },
    ...paginationResponsePropertySchema,
  },
  ...paginationRequiredPropertiesSchema,
} as const;

export const ancestryRequestParamsSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      description: "Ancestry Id",
      checkidIsCuid: true,
    },
  },
} as const;

export const ancestryGetResponseSchema = {
  type: "object",
  properties: {
    ...commonAncestryProperties,
  },
  required: [
    "id",
    "createdAt",
    "updatedAt",
    "deletedAt",
    "name",
    "description",
    "traits",
    "hitpoints",
    "size",
    "speed",
    "attributeBoost",
    "attributeFlaw",
    "languages",
    "rarity",
  ],
  additionalProperties: false,
} as const;
