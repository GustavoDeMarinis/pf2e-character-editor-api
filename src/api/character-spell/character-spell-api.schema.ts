import { SpellTradition } from "@prisma/client";

const commonCharacterSpellProperties = {
  id: { type: "string", description: "CharacterSpell Id" },
  createdAt: { type: "string", format: "date-time" },
  updatedAt: { type: "string", format: "date-time" },
  deletedAt: { type: "string", format: "date-time-nullable" },
  characterId: { type: "string", description: "Character Id" },
  spellId: { type: "string", description: "Spell Id" },
  isPrepared: { type: "boolean", description: "Prepared (true) vs spontaneous (false)" },
  preparedAtRank: {
    type: "integer",
    nullable: true,
    minimum: 0,
    maximum: 10,
    description: "Rank at which this spell was prepared",
  },
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
    additionalProperties: false,
    required: ["id", "name", "rank", "isFocus", "traditions"],
  },
} as const;

const commonCharacterSpellRequired = [
  "id",
  "createdAt",
  "updatedAt",
  "deletedAt",
  "characterId",
  "spellId",
  "isPrepared",
  "preparedAtRank",
  "spell",
] as const;

export const characterSpellCharacterParamsSchema = {
  type: "object",
  properties: {
    characterId: { type: "string", description: "Character Id", checkIdIsCuid: true },
  },
  required: ["characterId"],
  additionalProperties: false,
} as const;

export const characterSpellParamsSchema = {
  type: "object",
  properties: {
    characterId: { type: "string", description: "Character Id", checkIdIsCuid: true },
    characterSpellId: { type: "string", description: "CharacterSpell Id", checkIdIsCuid: true },
  },
  required: ["characterId", "characterSpellId"],
  additionalProperties: false,
} as const;

export const characterSpellPostRequestBodySchema = {
  type: "object",
  properties: {
    spellId: { type: "string", checkIdIsCuid: true, description: "Spell Id to assign" },
    isPrepared: {
      type: "boolean",
      default: false,
      description: "Prepared (true) vs spontaneous (false)",
    },
    preparedAtRank: {
      type: "integer",
      nullable: true,
      minimum: 0,
      maximum: 10,
      description: "Rank at which this spell is prepared (nullable)",
    },
  },
  required: ["spellId", "isPrepared", "preparedAtRank"],
  additionalProperties: false,
} as const;

export const characterSpellGetPostResponseSchema = {
  type: "object",
  properties: { ...commonCharacterSpellProperties },
  required: commonCharacterSpellRequired,
  additionalProperties: false,
} as const;

export const characterSpellListResponseSchema = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: { ...commonCharacterSpellProperties },
        required: commonCharacterSpellRequired,
        additionalProperties: false,
      },
    },
  },
  required: ["items"],
  additionalProperties: false,
} as const;
