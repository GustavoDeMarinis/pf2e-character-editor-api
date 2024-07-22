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

const commonGetSearchProperties = {
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
    description: "Character Class",
    type: "string",
    nullable: true,
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
          ...commonGetSearchProperties,
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
    ...commonGetSearchProperties,
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
    characterClass: {
      description: "Character Class",
      type: "string",
      nullable: true,
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
    "createdUserId",
    "assignedUserId",
    "ancestry",
    "characterClass",
    "background",
  ],
} as const;

export const characterPostResponseSchema = {
  type: "object",
  properties: {
    ...commonGetSearchProperties,
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
