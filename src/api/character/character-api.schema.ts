import { Attribute, FeatType, SpellTradition } from "@prisma/client";
import {
  paginationRequestPropertySchema,
  paginationRequiredPropertiesSchema,
  paginationResponsePropertySchema,
} from "../../utils/pagination.types";

export const characterSearchRequestQuerySchema = {
  type: "object",
  properties: {
    userCreatorName: {
      description: "User Creator Name",
      type: "string",
    },
    userAssignedName: {
      description: "User Assigned Name",
      type: "string",
    },
    characterClassName: {
      description: "Character ClassName",
      type: "string",
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
  createdByUser: {
    type: "object",
    properties: {
      id: {
        description: "User Assigned Id",
        type: "string",
      },
      userName: {
        description: "User Name",
        type: "string",
      },
    },
    additionalProperties: false,
    required: ["id", "userName"],
  },
  assignedUser: {
    type: "object",
    properties: {
      id: {
        description: "User Assigned Id",
        type: "string",
      },
      userName: {
        description: "User Name",
        type: "string",
      },
    },
    additionalProperties: false,
    required: ["id", "userName"],
  },
  ancestry: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Character Ancestry Name",
      },
    },
    required: ["name"],
    additionalProperties: false,
  },
  characterClass: {
    type: "object",
    properties: {
      id: {
        description: "Character Id",
        type: "string",
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
          enum: Object.values(Attribute),
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
    type: "object",
    description: "Character Background",
    nullable: true,
    properties: {
      id: { type: "string" },
      name: { type: "string" },
    },
    required: ["id", "name"],
    additionalProperties: false,
  },
  heritage: {
    type: "object",
    description: "Character Heritage",
    nullable: true,
    properties: {
      id: { type: "string" },
      name: { type: "string" },
    },
    required: ["id", "name"],
    additionalProperties: false,
  },
  deity: {
    type: "object",
    description: "Character Deity",
    nullable: true,
    properties: {
      id: { type: "string" },
      name: { type: "string" },
    },
    required: ["id", "name"],
    additionalProperties: false,
  },
  languages: {
    type: "array",
    description: "Languages known by this character",
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
  characterFeats: {
    type: "array",
    description: "Feats assigned to this character",
    items: {
      type: "object",
      properties: {
        id: { type: "string" },
        levelItWasTaken: { type: "integer" },
        slotType: { type: "string", enum: Object.values(FeatType) },
        feat: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            featType: { type: "string", enum: Object.values(FeatType) },
            level: { type: "integer" },
          },
          required: ["id", "name", "featType", "level"],
          additionalProperties: false,
        },
      },
      required: ["id", "levelItWasTaken", "slotType", "feat"],
      additionalProperties: false,
    },
  },
  characterSpells: {
    type: "array",
    description: "Spells assigned to this character",
    items: {
      type: "object",
      properties: {
        id: { type: "string" },
        isPrepared: { type: "boolean" },
        preparedAtRank: { type: "integer", nullable: true },
        spell: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            rank: { type: "integer" },
            isFocus: { type: "boolean" },
            traditions: {
              type: "array",
              items: { type: "string", enum: Object.values(SpellTradition) },
            },
          },
          required: ["id", "name", "rank", "isFocus", "traditions"],
          additionalProperties: false,
        },
      },
      required: ["id", "isPrepared", "preparedAtRank", "spell"],
      additionalProperties: false,
    },
  },
  characterConditions: {
    type: "array",
    description: "Active conditions applied to this character",
    items: {
      type: "object",
      properties: {
        id: { type: "string" },
        value: { type: "integer", minimum: 1, nullable: true },
        source: { type: "string", nullable: true },
        appliedAt: { type: "string", format: "date-time" },
        expiresAt: { type: "string", format: "date-time-nullable" },
        condition: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            hasValue: { type: "boolean" },
          },
          required: ["id", "name", "hasValue"],
          additionalProperties: false,
        },
      },
      required: ["id", "value", "source", "appliedAt", "expiresAt", "condition"],
      additionalProperties: false,
    },
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
          "createdByUser",
          "assignedUser",
          "ancestry",
          "characterClass",
          "background",
          "deity",
          "languages",
          "characterFeats",
          "characterSpells",
          "characterConditions",
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
  additionalProperties: false,
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
    "deity",
    "languages",
    "characterFeats",
    "characterSpells",
    "characterConditions",
  ],
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
    ancestryId: {
      description: "Character Ancestry",
      type: "string",
      checkIdIsCuid: true,
    },
    characterClassId: {
      description: "Character Class Id",
      type: "string",
    },
    backgroundId: {
      description: "Character Background Id",
      type: "string",
      checkIdIsCuid: true,
    },
    level: {
      description: "Character Level",
      type: "number",
    },
    ancestryBoost: {
      description: "Selected Ancestry Bonus To Attributes",
      type: "array",
      items: {
        type: "string",
        enum: Object.values(Attribute),
      },
    },
    ancestryFlaw: {
      description: "Selected Ancestry Penalties To Attributes",
      type: "array",
      items: {
        type: "string",
        enum: Object.values(Attribute),
      },
    },
    backgroundBoost: {
      description: "Selected Background Bonus To Attributes",
      type: "array",
      items: {
        type: "string",
        enum: Object.values(Attribute),
      },
    },
    classBoost: {
      description: "Selected Class Bonus To Attributes",
      type: "string",
      enum: Object.values(Attribute),
    },
    languageIds: {
      type: "array",
      description: "Character Known Languages",
      items: {
        type: "string",
        checkIdIsCuid: true,
      },
    },
    heritageId: {
      description: "Character Heritage Id",
      type: "string",
      checkIdIsCuid: true,
    },
    deityId: {
      description: "Character Deity Id",
      type: "string",
      checkIdIsCuid: true,
    },
  },
  additionalProperties: false,
  required: [
    "characterName",
    "createdByUserId",
    "assignedUserId",
    "ancestryId",
    "characterClassId",
    "level",
    "ancestryBoost",
    "ancestryFlaw",
    "backgroundBoost",
    "classBoost",
    "languageIds",
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
    "ancestry",
    "background",
    "createdUserId",
    "assignedUserId",
    "characterClass",
    "deity",
    "languages",
    "characterFeats",
    "characterSpells",
    "characterConditions",
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
    ancestryId: {
      description: "Character Ancestry Id",
      type: "string",
      checkIdIsCuid: true,
    },
    characterClassId: {
      description: "Character Class Id",
      type: "string",
    },
    backgroundId: {
      description: "Character Background Id",
      type: "string",
      checkIdIsCuid: true,
    },
    heritageId: {
      description: "Character Heritage Id",
      type: "string",
      checkIdIsCuid: true,
    },
    deityId: {
      description: "Character Deity Id",
      type: "string",
      checkIdIsCuid: true,
    },
    languageIds: {
      type: "array",
      description: "Character Known Languages",
      items: {
        type: "string",
        checkIdIsCuid: true,
      },
    },
  },
  additionalProperties: false,
  anyOf: [
    { required: ["characterName"] },
    { required: ["assignedUserId"] },
    { required: ["ancestryId"] },
    { required: ["characterClassId"] },
    { required: ["backgroundId"] },
    { required: ["heritageId"] },
    { required: ["deityId"] },
    { required: ["languageIds"] },
  ],
} as const;
