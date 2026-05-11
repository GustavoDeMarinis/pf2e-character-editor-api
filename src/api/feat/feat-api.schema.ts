import { ActionCost, FeatType, Rarity } from "@prisma/client";
import {
  paginationRequestPropertySchema,
  paginationRequiredPropertiesSchema,
  paginationResponsePropertySchema,
} from "../../utils/pagination.types";

const commonFeatProperties = {
  id: { type: "string", description: "Feat Id" },
  createdAt: { type: "string", format: "date-time" },
  updatedAt: { type: "string", format: "date-time" },
  deletedAt: { type: "string", format: "date-time-nullable" },
  name: { type: "string", description: "Feat Name" },
  description: { type: "string", description: "Feat Description" },
  featType: { type: "string", enum: Object.values(FeatType), description: "Feat Type" },
  level: { type: "integer", description: "Feat Level" },
  actionCost: {
    type: "string",
    enum: Object.values(ActionCost),
    nullable: true,
    description: "Action Cost",
  },
  rarity: { type: "string", enum: Object.values(Rarity), description: "Feat Rarity" },
  prerequisites: { type: "string", nullable: true, description: "Prerequisites (free text)" },
  frequency: { type: "string", nullable: true, description: "Frequency" },
  trigger: { type: "string", nullable: true, description: "Trigger" },
  requirements: { type: "string", nullable: true, description: "Requirements" },
  traits: {
    type: "array",
    items: {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
      },
      additionalProperties: false,
      required: ["id", "name"],
    },
  },
  ancestry: {
    type: "object",
    properties: {
      id: { type: "string" },
      name: { type: "string" },
    },
    additionalProperties: false,
    required: ["id", "name"],
    nullable: true,
  },
  ancestryId: { type: "string", nullable: true, description: "Ancestry Id" },
  characterClass: {
    type: "object",
    properties: {
      id: { type: "string" },
      className: { type: "string" },
    },
    additionalProperties: false,
    required: ["id", "className"],
    nullable: true,
  },
  characterClassId: { type: "string", nullable: true, description: "Character Class Id" },
  skill: {
    type: "object",
    properties: {
      id: { type: "string" },
      name: { type: "string" },
    },
    additionalProperties: false,
    required: ["id", "name"],
    nullable: true,
  },
  skillId: { type: "string", nullable: true, description: "Skill Id" },
} as const;

const commonFeatRequired = [
  "id",
  "createdAt",
  "updatedAt",
  "deletedAt",
  "name",
  "description",
  "featType",
  "level",
  "actionCost",
  "rarity",
  "prerequisites",
  "frequency",
  "trigger",
  "requirements",
  "traits",
  "ancestry",
  "ancestryId",
  "characterClass",
  "characterClassId",
  "skill",
  "skillId",
] as const;

export const featSearchRequestQuerySchema = {
  type: "object",
  properties: {
    search: { type: "string", description: "Search feats by name or description" },
    featType: {
      type: "string",
      enum: Object.values(FeatType),
      description: "Filter by Feat Type",
    },
    level: { type: "number", description: "Filter by exact level" },
    maxLevel: { type: "number", description: "Filter by maximum level (inclusive)" },
    ancestryId: { type: "string", description: "Filter by Ancestry Id" },
    characterClassId: { type: "string", description: "Filter by Character Class Id" },
    skillId: { type: "string", description: "Filter by Skill Id" },
    rarity: { type: "string", enum: Object.values(Rarity), description: "Filter by Rarity" },
    isActive: { type: "boolean", description: "Filter active/inactive feats" },
    sort: { type: "string", description: "Columns to build Prisma orderBy clause" },
    ...paginationRequestPropertySchema,
  },
  additionalProperties: false,
} as const;

export const featSearchResponseSchema = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: { ...commonFeatProperties },
        required: commonFeatRequired,
        additionalProperties: false,
      },
    },
    ...paginationResponsePropertySchema,
  },
  ...paginationRequiredPropertiesSchema,
} as const;

export const featRequestParamsSchema = {
  type: "object",
  properties: {
    featId: { type: "string", description: "Feat Id", checkIdIsCuid: true },
  },
  required: ["featId"],
  additionalProperties: false,
} as const;

export const featGetPostResponseSchema = {
  type: "object",
  properties: { ...commonFeatProperties },
  required: commonFeatRequired,
  additionalProperties: false,
} as const;

export const featPostRequestBodySchema = {
  type: "object",
  properties: {
    name: { type: "string", description: "Feat Name" },
    description: { type: "string", description: "Feat Description" },
    featType: {
      type: "string",
      enum: Object.values(FeatType).filter((t) => t !== FeatType.Archetype),
      description: "Feat Type (Archetype is not yet supported — see ISSUE-02.13)",
    },
    level: { type: "integer", minimum: 1, maximum: 20, description: "Feat Level" },
    actionCost: {
      type: "string",
      enum: Object.values(ActionCost),
      nullable: true,
      description: "Action Cost",
    },
    rarity: { type: "string", enum: Object.values(Rarity), description: "Feat Rarity" },
    prerequisites: { type: "string", maxLength: 1000, description: "Prerequisites (free text)" },
    frequency: { type: "string", maxLength: 1000, description: "Frequency" },
    trigger: { type: "string", maxLength: 1000, description: "Trigger" },
    requirements: { type: "string", maxLength: 1000, description: "Requirements" },
    traitIds: {
      type: "array",
      items: { type: "string", checkIdIsCuid: true },
      description: "Trait Ids",
    },
    ancestryId: {
      type: "string",
      checkIdIsCuid: true,
      description: "Ancestry Id (required when featType is Ancestry)",
    },
    characterClassId: {
      type: "string",
      checkIdIsCuid: true,
      description: "Character Class Id (required when featType is Class)",
    },
    skillId: {
      type: "string",
      checkIdIsCuid: true,
      description: "Skill Id (required when featType is Skill)",
    },
  },
  required: ["name", "description", "featType", "level", "rarity", "traitIds"],
  additionalProperties: false,
  oneOf: [
    {
      properties: { featType: { const: "Ancestry" } },
      required: ["ancestryId"],
      allOf: [
        { not: { required: ["characterClassId"] } },
        { not: { required: ["skillId"] } },
      ],
    },
    {
      properties: { featType: { const: "Class" } },
      required: ["characterClassId"],
      allOf: [
        { not: { required: ["ancestryId"] } },
        { not: { required: ["skillId"] } },
      ],
    },
    {
      properties: { featType: { const: "Skill" } },
      required: ["skillId"],
      allOf: [
        { not: { required: ["ancestryId"] } },
        { not: { required: ["characterClassId"] } },
      ],
    },
    {
      properties: { featType: { const: "General" } },
      allOf: [
        { not: { required: ["ancestryId"] } },
        { not: { required: ["characterClassId"] } },
        { not: { required: ["skillId"] } },
      ],
    },
    {
      properties: { featType: { const: "Bonus" } },
      allOf: [
        { not: { required: ["ancestryId"] } },
        { not: { required: ["characterClassId"] } },
        { not: { required: ["skillId"] } },
      ],
    },
  ],
} as const;

export const featPatchRequestBodySchema = {
  type: "object",
  properties: {
    name: { type: "string", description: "Feat Name" },
    description: { type: "string", description: "Feat Description" },
    featType: {
      type: "string",
      enum: Object.values(FeatType).filter((t) => t !== FeatType.Archetype),
      description: "Feat Type",
    },
    level: { type: "integer", minimum: 1, maximum: 20, description: "Feat Level" },
    actionCost: {
      type: "string",
      enum: Object.values(ActionCost),
      nullable: true,
      description: "Action Cost",
    },
    rarity: { type: "string", enum: Object.values(Rarity), description: "Feat Rarity" },
    prerequisites: { type: "string", maxLength: 1000, nullable: true, description: "Prerequisites" },
    frequency: { type: "string", maxLength: 1000, nullable: true, description: "Frequency" },
    trigger: { type: "string", maxLength: 1000, nullable: true, description: "Trigger" },
    requirements: { type: "string", maxLength: 1000, nullable: true, description: "Requirements" },
    traitIds: {
      type: "array",
      items: { type: "string", checkIdIsCuid: true },
      description: "Trait Ids",
    },
    ancestryId: { type: "string", checkIdIsCuid: true, nullable: true, description: "Ancestry Id" },
    characterClassId: {
      type: "string",
      checkIdIsCuid: true,
      nullable: true,
      description: "Character Class Id",
    },
    skillId: { type: "string", checkIdIsCuid: true, nullable: true, description: "Skill Id" },
  },
  additionalProperties: false,
  anyOf: [
    { required: ["name"] },
    { required: ["description"] },
    { required: ["featType"] },
    { required: ["level"] },
    { required: ["actionCost"] },
    { required: ["rarity"] },
    { required: ["prerequisites"] },
    { required: ["frequency"] },
    { required: ["trigger"] },
    { required: ["requirements"] },
    { required: ["traitIds"] },
    { required: ["ancestryId"] },
    { required: ["characterClassId"] },
    { required: ["skillId"] },
  ],
} as const;
