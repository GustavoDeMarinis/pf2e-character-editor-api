import { Attribute, Rarity } from "@prisma/client";
import {
  paginationRequestPropertySchema,
  paginationRequiredPropertiesSchema,
  paginationResponsePropertySchema,
} from "../../utils/pagination.types";

const nonFreeAttributes = [
  Attribute.Strength,
  Attribute.Dexterity,
  Attribute.Constitution,
  Attribute.Intelligence,
  Attribute.Wisdom,
  Attribute.Charisma,
] as const;

const commonBackgroundProperties = {
  id: { type: "string", description: "Background Id" },
  createdAt: { type: "string", format: "date-time" },
  updatedAt: { type: "string", format: "date-time" },
  deletedAt: { type: "string", format: "date-time-nullable" },
  name: { type: "string", description: "Background Name" },
  description: { type: "string", description: "Background Description", nullable: true },
  rarity: {
    type: "string",
    description: "Background Rarity",
    enum: Object.values(Rarity),
  },
  attributeBoostOptions: {
    type: "array",
    description: "Attribute boost options (1 or 2, excluding Free)",
    items: { type: "string", enum: nonFreeAttributes },
  },
  trainedSkillId: {
    type: "string",
    description: "Trained Skill Id",
    nullable: true,
  },
  trainedLoreName: {
    type: "string",
    description: "Trained Lore Name (must end in ' Lore')",
    nullable: true,
  },
  traits: {
    type: "array",
    items: {
      type: "object",
      properties: {
        name: { type: "string" },
        description: { type: "string", nullable: true },
      },
      additionalProperties: false,
      required: ["name", "description"],
    },
  },
  trainedSkill: {
    type: "object",
    properties: {
      id: { type: "string" },
      name: { type: "string" },
    },
    additionalProperties: false,
    required: ["id", "name"],
    nullable: true,
  },
} as const;

export const backgroundSearchRequestQuerySchema = {
  type: "object",
  properties: {
    name: { type: "string", description: "Background Name" },
    rarity: {
      type: "string",
      enum: Object.values(Rarity),
      description: "Background Rarity",
    },
    trainedSkillId: { type: "string", description: "Filter by Trained Skill Id" },
    isActive: { type: "boolean", description: "Is Background Active?" },
    sort: {
      type: "string",
      description: "Columns To Build Prisma OrderBy Clause",
    },
    ...paginationRequestPropertySchema,
  },
  additionalProperties: false,
} as const;

export const backgroundSearchResponseSchema = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: { ...commonBackgroundProperties },
        required: [
          "id",
          "createdAt",
          "updatedAt",
          "deletedAt",
          "name",
          "description",
          "rarity",
          "attributeBoostOptions",
          "trainedSkillId",
          "trainedLoreName",
          "traits",
          "trainedSkill",
        ],
        additionalProperties: false,
      },
    },
    ...paginationResponsePropertySchema,
  },
  ...paginationRequiredPropertiesSchema,
} as const;

export const backgroundRequestParamsSchema = {
  type: "object",
  properties: {
    backgroundId: {
      type: "string",
      description: "Background Id",
      checkIdIsCuid: true,
    },
  },
  required: ["backgroundId"],
  additionalProperties: false,
} as const;

export const backgroundGetPostResponseSchema = {
  type: "object",
  properties: { ...commonBackgroundProperties },
  required: [
    "id",
    "createdAt",
    "updatedAt",
    "deletedAt",
    "name",
    "description",
    "rarity",
    "attributeBoostOptions",
    "trainedSkillId",
    "trainedLoreName",
    "traits",
    "trainedSkill",
  ],
  additionalProperties: false,
} as const;

export const backgroundPostRequestBodySchema = {
  type: "object",
  properties: {
    name: { type: "string", description: "Background Name" },
    description: { type: "string", description: "Background Description" },
    rarity: {
      type: "string",
      description: "Background Rarity",
      enum: Object.values(Rarity),
    },
    attributeBoostOptions: {
      type: "array",
      description: "Attribute boost options (1 or 2, excluding Free)",
      minItems: 1,
      maxItems: 2,
      uniqueItems: true,
      items: { type: "string", enum: nonFreeAttributes },
    },
    trainedSkillId: {
      type: "string",
      description: "Trained Skill Id",
      checkIdIsCuid: true,
    },
    trainedLoreName: {
      type: "string",
      description: "Trained Lore Name",
      pattern: "^.+ Lore$",
    },
    traitIds: {
      type: "array",
      description: "Background Trait Ids",
      items: { type: "string", checkIdIsCuid: true },
    },
  },
  required: ["name", "rarity", "attributeBoostOptions", "traitIds"],
  additionalProperties: false,
} as const;

export const backgroundPatchRequestBodySchema = {
  type: "object",
  properties: {
    name: { type: "string", description: "Background Name" },
    description: { type: "string", description: "Background Description" },
    rarity: {
      type: "string",
      description: "Background Rarity",
      enum: Object.values(Rarity),
    },
    attributeBoostOptions: {
      type: "array",
      description: "Attribute boost options (1 or 2, excluding Free)",
      minItems: 1,
      maxItems: 2,
      uniqueItems: true,
      items: { type: "string", enum: nonFreeAttributes },
    },
    trainedSkillId: {
      type: "string",
      description: "Trained Skill Id",
      checkIdIsCuid: true,
    },
    trainedLoreName: {
      type: "string",
      description: "Trained Lore Name",
      pattern: "^.+ Lore$",
    },
    traitIds: {
      type: "array",
      description: "Background Trait Ids",
      items: { type: "string", checkIdIsCuid: true },
    },
  },
  additionalProperties: false,
  anyOf: [
    { required: ["name"] },
    { required: ["description"] },
    { required: ["rarity"] },
    { required: ["attributeBoostOptions"] },
    { required: ["trainedSkillId"] },
    { required: ["trainedLoreName"] },
    { required: ["traitIds"] },
  ],
} as const;
