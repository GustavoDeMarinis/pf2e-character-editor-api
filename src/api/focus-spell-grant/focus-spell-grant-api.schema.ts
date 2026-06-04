import { Rarity, SpellTradition } from "@prisma/client";
import {
  paginationRequestPropertySchema,
  paginationRequiredPropertiesSchema,
  paginationResponsePropertySchema,
} from "../../utils/pagination.types";

const commonFocusSpellGrantProperties = {
  id: { type: "string", description: "FocusSpellGrant Id" },
  createdAt: { type: "string", format: "date-time" },
  updatedAt: { type: "string", format: "date-time" },
  deletedAt: { type: "string", format: "date-time-nullable" },
  spell: {
    type: "object",
    description: "Spell summary",
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      rank: { type: "integer" },
      isFocus: { type: "boolean" },
      traditions: {
        type: "array",
        items: { type: "string", enum: Object.values(SpellTradition) },
      },
      rarity: { type: "string", enum: Object.values(Rarity) },
    },
    additionalProperties: false,
    required: ["id", "name", "rank", "isFocus", "traditions", "rarity"],
  },
  characterClass: {
    type: "object",
    nullable: true,
    description: "Class that grants this focus spell, if class-scoped",
    properties: {
      id: { type: "string" },
      className: { type: "string" },
    },
    additionalProperties: false,
    required: ["id", "className"],
  },
  domain: {
    type: "object",
    nullable: true,
    description: "Domain that grants this focus spell, if domain-scoped",
    properties: {
      id: { type: "string" },
      name: { type: "string" },
    },
    additionalProperties: false,
    required: ["id", "name"],
  },
} as const;

export const focusSpellGrantSearchRequestQuerySchema = {
  type: "object",
  properties: {
    spellId: { type: "string", description: "Filter by Spell Id" },
    characterClassId: {
      type: "string",
      description: "Filter by CharacterClass Id",
    },
    domainId: { type: "string", description: "Filter by Domain Id" },
    isActive: { type: "boolean", description: "Is grant Active?" },
    sort: {
      type: "string",
      description: "Columns To Build Prisma OrderBy Clause",
    },
    ...paginationRequestPropertySchema,
  },
  additionalProperties: false,
} as const;

export const focusSpellGrantSearchResponseSchema = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: { ...commonFocusSpellGrantProperties },
        required: [
          "id",
          "createdAt",
          "updatedAt",
          "deletedAt",
          "spell",
          "characterClass",
          "domain",
        ],
        additionalProperties: false,
      },
    },
    ...paginationResponsePropertySchema,
  },
  ...paginationRequiredPropertiesSchema,
} as const;

export const focusSpellGrantRequestParamsSchema = {
  type: "object",
  properties: {
    focusSpellGrantId: {
      type: "string",
      description: "FocusSpellGrant Id",
      checkIdIsCuid: true,
    },
  },
  required: ["focusSpellGrantId"],
  additionalProperties: false,
} as const;

export const focusSpellGrantGetPostResponseSchema = {
  type: "object",
  properties: { ...commonFocusSpellGrantProperties },
  required: [
    "id",
    "createdAt",
    "updatedAt",
    "deletedAt",
    "spell",
    "characterClass",
    "domain",
  ],
  additionalProperties: false,
} as const;

export const focusSpellGrantPostRequestBodySchema = {
  type: "object",
  properties: {
    spellId: {
      type: "string",
      description: "Spell Id (must reference a spell with isFocus = true)",
      checkIdIsCuid: true,
    },
    characterClassId: {
      type: "string",
      description: "CharacterClass Id (XOR with domainId)",
      checkIdIsCuid: true,
    },
    domainId: {
      type: "string",
      description: "Domain Id (XOR with characterClassId)",
      checkIdIsCuid: true,
    },
  },
  required: ["spellId"],
  additionalProperties: false,
  oneOf: [
    { required: ["characterClassId"], not: { required: ["domainId"] } },
    { required: ["domainId"], not: { required: ["characterClassId"] } },
  ],
} as const;

export const focusSpellGrantPatchRequestBodySchema = {
  type: "object",
  properties: {
    spellId: {
      type: "string",
      description: "Spell Id (must reference a spell with isFocus = true)",
      checkIdIsCuid: true,
    },
    characterClassId: {
      type: "string",
      description:
        "CharacterClass Id; send null to clear (service re-validates XOR against merged row)",
      checkIdIsCuid: true,
      nullable: true,
    },
    domainId: {
      type: "string",
      description:
        "Domain Id; send null to clear (service re-validates XOR against merged row)",
      checkIdIsCuid: true,
      nullable: true,
    },
  },
  additionalProperties: false,
  anyOf: [
    { required: ["spellId"] },
    { required: ["characterClassId"] },
    { required: ["domainId"] },
  ],
} as const;
