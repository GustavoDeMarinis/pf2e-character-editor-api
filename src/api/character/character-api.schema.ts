import { Attributes } from "@prisma/client";
import {
  paginationRequestPropertySchema,
  paginationRequiredPropertiesSchema,
  paginationResponsePropertySchema,
} from "../../utils/pagination.types";

export const characterSearchRequestQuerySchema = {
  type: "object",
  properties: {
    createdByUserId: {
      description: "User Creator Id",
      type: "string",
      checkIdIsCuid: true,
    },
    assignedUserId: {
      description: "User Assigned Id",
      type: "string",
      checkIdIsCuid: true,
    },
    characterClassId: {
      description: "Character Class Id",
      type: "string",
      checkIdIsCuid: true,
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

const commonCharacterProperties = {
  id: {
    description: "Character Id",
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
  characterName: {
    description: "Character Name",
    type: "string",
  },
  createdByUserId: {
    description: "User Creator Id",
    type: "string",
  },
  assignedUserId: {
    description: "User Assigned Id",
    type: "string",
  },
  ancestry: {
    description: "Character Ancestry",
    type: "string",
    nullable: true,
  },
  characterClass: {
    type: "object",
    properties: {
      id: {
        description: "Character Id",
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
        description: "Character Class Name",
        type: "string",
      },
      description: {
        description: "Character Class Description",
        type: "string",
      },
      keyAttributes: {
        description: "Attribute Option To Give Bonus",
        type: "array",
        items: {
          type: "string",
          enum: Object.values(Attributes),
        },
      },
      hitPoints: {
        description: "Amount Of Hitpoints Gained Per Level",
        type: "number",
      },
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
  background: {
    description: "Character Background",
    type: "string",
    nullable: true,
  },
} as const;

export const characterSearchResponseSchema = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          ...commonCharacterProperties,
        },
        required: [
          "id",
          "createdAt",
          "updatedAt",
          "deletedAt",
          "characterName",
          "createdByUserId",
          "assignedUserId",
          "ancestry",
          "characterClass",
          "background",
        ],
        additionalProperties: false,
      },
    },
    ...paginationResponsePropertySchema,
  },
  ...paginationRequiredPropertiesSchema,
} as const;

export const characterRequestParamsSchema = {
  type: "object",
  properties: {
    characterId: {
      type: "string",
      description: "character Id",
      checkIdIsCuid: true,
    },
  },
  additionalProperties: false,
  required: ["characterId"],
} as const;

export const characterGetResponseSchema = {
  type: "object",
  properties: {
    ...commonCharacterProperties,
  },
  required: [
    "id",
    "createdAt",
    "updatedAt",
    "deletedAt",
    "characterName",
    "createdUserId",
    "assignedUserId",
    "ancestry",
    "characterClass",
    "background",
  ],
  additionalProperties: false,
} as const;

export const characterPostRequestBodySchema = {
  type: "object",
  properties: {
    characterName: {
      description: "Character Name",
      type: "string",
    },
    createdByUserId: {
      description: "User Creator Id",
      type: "string",
    },
    assignedUserId: {
      description: "User Assigned Id",
      type: "string",
    },
    ancestry: {
      description: "Character Ancestry",
      type: "string",
      nullable: true,
    },
    characterClassId: {
      description: "Character Class Id",
      type: "string",
    },
    background: {
      description: "Character Background",
      type: "string",
      nullable: true,
    },
  },
  additionalProperties: false,
  required: [
    "characterName",
    "createdByUserId",
    "assignedUserId",
    "ancestry",
    "characterClassId",
    "background",
  ],
} as const;

export const characterPostResponseSchema = {
  type: "object",
  properties: {
    ...commonCharacterProperties,
  },
  required: [
    "id",
    "createdAt",
    "updatedAt",
    "deletedAt",
    "characterName",
    "createdUserId",
    "assignedUserId",
    "ancestry",
    "characterClass",
    "background",
  ],
  additionalProperties: false,
} as const;

export const characterPatchRequestBodySchema = {
  type: "object",
  properties: {
    characterName: {
      description: "Character Name",
      type: "string",
    },
    createdByUserId: {
      description: "User Creator Id",
      type: "string",
    },
    assignedUserId: {
      description: "User Assigned Id",
      type: "string",
    },
    ancestry: {
      description: "Character Ancestry",
      type: "string",
    },
    characterClass: {
      description: "Character Class",
      type: "string",
    },
    background: {
      description: "Character Background",
      type: "string",
    },
  },
  additionalProperties: false,
  anyOf: [
    { required: ["characterName"] },
    { required: ["assignedUserId"] },
    { required: ["ancestry"] },
    { required: ["characterClass"] },
    { required: ["background"] },
  ],
} as const;
