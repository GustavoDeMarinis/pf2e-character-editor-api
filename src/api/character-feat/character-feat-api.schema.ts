import { FeatType, Rarity } from "@prisma/client";

const commonCharacterFeatProperties = {
  id: { type: "string", description: "CharacterFeat Id" },
  createdAt: { type: "string", format: "date-time" },
  updatedAt: { type: "string", format: "date-time" },
  deletedAt: { type: "string", format: "date-time-nullable" },
  characterId: { type: "string", description: "Character Id" },
  featId: { type: "string", description: "Feat Id" },
  levelItWasTaken: { type: "integer", description: "Character level when this feat was taken" },
  slotType: { type: "string", enum: Object.values(FeatType), description: "Feat slot type" },
  feat: {
    type: "object",
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      featType: { type: "string", enum: Object.values(FeatType) },
      level: { type: "integer" },
      rarity: { type: "string", enum: Object.values(Rarity) },
    },
    additionalProperties: false,
    required: ["id", "name", "featType", "level", "rarity"],
  },
} as const;

const commonCharacterFeatRequired = [
  "id",
  "createdAt",
  "updatedAt",
  "deletedAt",
  "characterId",
  "featId",
  "levelItWasTaken",
  "slotType",
  "feat",
] as const;

export const characterFeatCharacterParamsSchema = {
  type: "object",
  properties: {
    characterId: { type: "string", description: "Character Id", checkIdIsCuid: true },
  },
  required: ["characterId"],
  additionalProperties: false,
} as const;

export const characterFeatParamsSchema = {
  type: "object",
  properties: {
    characterId: { type: "string", description: "Character Id", checkIdIsCuid: true },
    characterFeatId: { type: "string", description: "CharacterFeat Id", checkIdIsCuid: true },
  },
  required: ["characterId", "characterFeatId"],
  additionalProperties: false,
} as const;

export const characterFeatPostRequestBodySchema = {
  type: "object",
  properties: {
    featId: { type: "string", checkIdIsCuid: true, description: "Feat Id to assign" },
    levelItWasTaken: {
      type: "integer",
      minimum: 1,
      maximum: 20,
      description: "Character level when this feat was taken",
    },
    slotType: {
      type: "string",
      enum: Object.values(FeatType),
      description: "Feat slot type (which slot this feat fills)",
    },
  },
  required: ["featId", "levelItWasTaken", "slotType"],
  additionalProperties: false,
} as const;

export const characterFeatGetPostResponseSchema = {
  type: "object",
  properties: { ...commonCharacterFeatProperties },
  required: commonCharacterFeatRequired,
  additionalProperties: false,
} as const;

export const characterFeatListResponseSchema = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: { ...commonCharacterFeatProperties },
        required: commonCharacterFeatRequired,
        additionalProperties: false,
      },
    },
  },
  required: ["items"],
  additionalProperties: false,
} as const;
