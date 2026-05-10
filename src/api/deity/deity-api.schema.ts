import { Attribute, DeitySanctification, DivineFont, Rarity } from "@prisma/client";
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

const nestedDomainItem = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
  },
  additionalProperties: false,
  required: ["id", "name"],
} as const;

const commonDeityProperties = {
  id: { type: "string", description: "Deity Id" },
  createdAt: { type: "string", format: "date-time" },
  updatedAt: { type: "string", format: "date-time" },
  deletedAt: { type: "string", format: "date-time-nullable" },
  name: { type: "string", description: "Deity Name" },
  description: { type: "string", description: "Deity Description", nullable: true },
  rarity: { type: "string", description: "Deity Rarity", enum: Object.values(Rarity) },
  edicts: {
    type: "array",
    items: { type: "string" },
  },
  anathema: {
    type: "array",
    items: { type: "string" },
  },
  divineAttributes: {
    type: "array",
    items: { type: "string", enum: nonFreeAttributes },
  },
  sanctification: {
    type: "string",
    enum: Object.values(DeitySanctification),
  },
  divineFont: {
    type: "string",
    enum: Object.values(DivineFont),
  },
  divineSkill: {
    type: "object",
    properties: {
      id: { type: "string" },
      name: { type: "string" },
    },
    additionalProperties: false,
    required: ["id", "name"],
    nullable: true,
  },
  favoredWeapon: {
    type: "object",
    properties: {
      id: { type: "string" },
      name: { type: "string" },
    },
    additionalProperties: false,
    required: ["id", "name"],
    nullable: true,
  },
  domains: {
    type: "array",
    items: nestedDomainItem,
  },
  alternateDomains: {
    type: "array",
    items: nestedDomainItem,
  },
  clericSpells: {
    type: "array",
    items: {
      type: "object",
      properties: {
        id: { type: "string" },
        rank: { type: "number" },
        spellId: { type: "string" },
      },
      additionalProperties: false,
      required: ["id", "rank", "spellId"],
    },
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
} as const;

export const deitySearchRequestQuerySchema = {
  type: "object",
  properties: {
    name: { type: "string", description: "Deity Name" },
    rarity: { type: "string", enum: Object.values(Rarity), description: "Deity Rarity" },
    divineSkillId: { type: "string", description: "Filter by Divine Skill Id", checkIdIsCuid: true },
    favoredWeaponId: { type: "string", description: "Filter by Favored Weapon Id", checkIdIsCuid: true },
    divineFont: { type: "string", enum: Object.values(DivineFont), description: "Divine Font" },
    sanctification: {
      type: "string",
      enum: Object.values(DeitySanctification),
      description: "Deity Sanctification",
    },
    isActive: { type: "boolean", description: "Is Deity Active?" },
    sort: { type: "string", description: "Columns To Build Prisma OrderBy Clause" },
    ...paginationRequestPropertySchema,
  },
  additionalProperties: false,
} as const;

export const deitySearchResponseSchema = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: { ...commonDeityProperties },
        required: [
          "id",
          "createdAt",
          "updatedAt",
          "deletedAt",
          "name",
          "description",
          "rarity",
          "edicts",
          "anathema",
          "divineAttributes",
          "sanctification",
          "divineFont",
          "divineSkill",
          "favoredWeapon",
          "domains",
          "alternateDomains",
          "clericSpells",
          "traits",
        ],
        additionalProperties: false,
      },
    },
    ...paginationResponsePropertySchema,
  },
  ...paginationRequiredPropertiesSchema,
} as const;

export const deityRequestParamsSchema = {
  type: "object",
  properties: {
    deityId: {
      type: "string",
      description: "Deity Id",
      checkIdIsCuid: true,
    },
  },
  required: ["deityId"],
  additionalProperties: false,
} as const;

export const deityGetPostResponseSchema = {
  type: "object",
  properties: { ...commonDeityProperties },
  required: [
    "id",
    "createdAt",
    "updatedAt",
    "deletedAt",
    "name",
    "description",
    "rarity",
    "edicts",
    "anathema",
    "divineAttributes",
    "sanctification",
    "divineFont",
    "divineSkill",
    "favoredWeapon",
    "domains",
    "alternateDomains",
    "clericSpells",
    "traits",
  ],
  additionalProperties: false,
} as const;

export const deityPostRequestBodySchema = {
  type: "object",
  properties: {
    name: { type: "string", description: "Deity Name" },
    description: { type: "string", description: "Deity Description" },
    rarity: { type: "string", enum: Object.values(Rarity), description: "Deity Rarity" },
    edicts: {
      type: "array",
      maxItems: 20,
      items: { type: "string", minLength: 1, maxLength: 500 },
    },
    anathema: {
      type: "array",
      maxItems: 20,
      items: { type: "string", minLength: 1, maxLength: 500 },
    },
    divineAttributes: {
      type: "array",
      minItems: 1,
      maxItems: 2,
      uniqueItems: true,
      items: { type: "string", enum: nonFreeAttributes },
    },
    sanctification: {
      type: "string",
      enum: Object.values(DeitySanctification),
      description: "Deity Sanctification",
    },
    divineFont: {
      type: "string",
      enum: Object.values(DivineFont),
      description: "Divine Font",
    },
    divineSkillId: {
      type: "string",
      description: "Divine Skill Id",
      checkIdIsCuid: true,
    },
    favoredWeaponId: {
      type: "string",
      description: "Favored Weapon Id",
      checkIdIsCuid: true,
    },
    domainIds: {
      type: "array",
      description: "Domain Ids",
      items: { type: "string", checkIdIsCuid: true },
      default: [],
    },
    alternateDomainIds: {
      type: "array",
      description: "Alternate Domain Ids",
      items: { type: "string", checkIdIsCuid: true },
      default: [],
    },
    traitIds: {
      type: "array",
      description: "Deity Trait Ids",
      items: { type: "string", checkIdIsCuid: true },
      default: [],
    },
  },
  required: ["name", "rarity", "edicts", "anathema", "divineAttributes", "sanctification", "divineFont"],
  additionalProperties: false,
} as const;

export const deityPatchRequestBodySchema = {
  type: "object",
  properties: {
    name: { type: "string", description: "Deity Name" },
    description: { type: "string", description: "Deity Description" },
    rarity: { type: "string", enum: Object.values(Rarity), description: "Deity Rarity" },
    edicts: {
      type: "array",
      maxItems: 20,
      items: { type: "string", minLength: 1, maxLength: 500 },
    },
    anathema: {
      type: "array",
      maxItems: 20,
      items: { type: "string", minLength: 1, maxLength: 500 },
    },
    divineAttributes: {
      type: "array",
      minItems: 1,
      maxItems: 2,
      uniqueItems: true,
      items: { type: "string", enum: nonFreeAttributes },
    },
    sanctification: {
      type: "string",
      enum: Object.values(DeitySanctification),
      description: "Deity Sanctification",
    },
    divineFont: {
      type: "string",
      enum: Object.values(DivineFont),
      description: "Divine Font",
    },
    divineSkillId: {
      type: "string",
      description: "Divine Skill Id",
      checkIdIsCuid: true,
    },
    favoredWeaponId: {
      type: "string",
      description: "Favored Weapon Id",
      checkIdIsCuid: true,
    },
    domainIds: {
      type: "array",
      description: "Domain Ids",
      items: { type: "string", checkIdIsCuid: true },
    },
    alternateDomainIds: {
      type: "array",
      description: "Alternate Domain Ids",
      items: { type: "string", checkIdIsCuid: true },
    },
    traitIds: {
      type: "array",
      description: "Deity Trait Ids",
      items: { type: "string", checkIdIsCuid: true },
    },
  },
  additionalProperties: false,
  anyOf: [
    { required: ["name"] },
    { required: ["description"] },
    { required: ["rarity"] },
    { required: ["edicts"] },
    { required: ["anathema"] },
    { required: ["divineAttributes"] },
    { required: ["sanctification"] },
    { required: ["divineFont"] },
    { required: ["divineSkillId"] },
    { required: ["favoredWeaponId"] },
    { required: ["domainIds"] },
    { required: ["alternateDomainIds"] },
    { required: ["traitIds"] },
  ],
} as const;
