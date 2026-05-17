import { Rarity } from "@prisma/client";
import {
  paginationRequestPropertySchema,
  paginationRequiredPropertiesSchema,
  paginationResponsePropertySchema,
} from "../../utils/pagination.types";

const heighteningResponseProperties = {
  id: { type: "string" },
  fixedRank: { type: "integer", minimum: 1, maximum: 10 },
  effect: { type: "string" },
} as const;

const heighteningInputSchema = {
  type: "object",
  properties: {
    fixedRank: {
      type: "integer",
      minimum: 1,
      maximum: 10,
      description: "Exact rank at which this heightening applies",
    },
    effect: { type: "string", minLength: 1, description: "Heightening effect text" },
  },
  additionalProperties: false,
  required: ["fixedRank", "effect"],
} as const;

const commonRitualProperties = {
  id: { type: "string", description: "Ritual Id" },
  createdAt: { type: "string", format: "date-time" },
  updatedAt: { type: "string", format: "date-time" },
  deletedAt: { type: "string", format: "date-time-nullable" },
  name: { type: "string", description: "Ritual Name" },
  description: { type: "string", description: "Ritual Description" },
  rank: {
    type: "integer",
    minimum: 1,
    maximum: 10,
    description: "Ritual Rank (1–10; no rank-0 rituals)",
  },
  rarity: {
    type: "string",
    enum: Object.values(Rarity),
    description: "Ritual Rarity",
  },
  castTime: { type: "string", description: "Cast time (e.g. '1 day', '10 minutes')" },
  cost: { type: "string", nullable: true, description: "Material / reagent cost" },
  primaryCheck: {
    type: "string",
    description: "Primary skill check required (e.g. 'Religion (master)')",
  },
  secondaryCasters: {
    type: "integer",
    minimum: 0,
    maximum: 20,
    description: "Number of secondary casters required",
  },
  range: { type: "string", nullable: true, description: "Range (free text)" },
  targets: { type: "string", nullable: true, description: "Targets (free text)" },
  duration: { type: "string", nullable: true, description: "Duration (free text)" },
  criticalSuccess: { type: "string", nullable: true, description: "Critical success effect" },
  success: { type: "string", nullable: true, description: "Success effect" },
  failure: { type: "string", nullable: true, description: "Failure effect" },
  criticalFailure: { type: "string", nullable: true, description: "Critical failure effect" },
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
  secondaryCheckSkills: {
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
    description: "Skills required for secondary casters",
  },
  heightenings: {
    type: "array",
    items: {
      type: "object",
      properties: { ...heighteningResponseProperties },
      additionalProperties: false,
      required: ["id", "fixedRank", "effect"],
    },
  },
} as const;

const commonRitualRequired = [
  "id",
  "createdAt",
  "updatedAt",
  "deletedAt",
  "name",
  "description",
  "rank",
  "rarity",
  "castTime",
  "cost",
  "primaryCheck",
  "secondaryCasters",
  "range",
  "targets",
  "duration",
  "criticalSuccess",
  "success",
  "failure",
  "criticalFailure",
  "traits",
  "secondaryCheckSkills",
  "heightenings",
] as const;

export const ritualSearchRequestQuerySchema = {
  type: "object",
  properties: {
    search: { type: "string", description: "Search rituals by name or description" },
    rank: { type: "integer", minimum: 1, maximum: 10, description: "Filter by exact rank" },
    minRank: { type: "integer", minimum: 1, maximum: 10, description: "Minimum rank (inclusive)" },
    maxRank: { type: "integer", minimum: 1, maximum: 10, description: "Maximum rank (inclusive)" },
    traitIds: {
      type: "array",
      items: { type: "string", checkIdIsCuid: true },
      description: "Filter by Trait Ids",
    },
    secondaryCheckSkillIds: {
      type: "array",
      items: { type: "string", checkIdIsCuid: true },
      description: "Filter by secondary check Skill Ids",
    },
    rarity: {
      type: "string",
      enum: Object.values(Rarity),
      description: "Filter by Rarity",
    },
    isActive: { type: "boolean", description: "Filter active/inactive rituals" },
    sort: { type: "string", description: "Columns to build Prisma orderBy clause" },
    ...paginationRequestPropertySchema,
  },
  additionalProperties: false,
} as const;

export const ritualSearchResponseSchema = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: { ...commonRitualProperties },
        required: commonRitualRequired,
        additionalProperties: false,
      },
    },
    ...paginationResponsePropertySchema,
  },
  ...paginationRequiredPropertiesSchema,
} as const;

export const ritualRequestParamsSchema = {
  type: "object",
  properties: {
    ritualId: { type: "string", description: "Ritual Id", checkIdIsCuid: true },
  },
  required: ["ritualId"],
  additionalProperties: false,
} as const;

export const ritualGetPostResponseSchema = {
  type: "object",
  properties: { ...commonRitualProperties },
  required: commonRitualRequired,
  additionalProperties: false,
} as const;

export const ritualPostRequestBodySchema = {
  type: "object",
  properties: {
    name: { type: "string", description: "Ritual Name" },
    description: { type: "string", description: "Ritual Description" },
    rank: { type: "integer", minimum: 1, maximum: 10, description: "Ritual Rank" },
    rarity: { type: "string", enum: Object.values(Rarity), description: "Ritual Rarity" },
    castTime: { type: "string", description: "Cast time" },
    cost: { type: "string", nullable: true, description: "Material cost" },
    primaryCheck: { type: "string", description: "Primary check (skill + proficiency)" },
    secondaryCasters: {
      type: "integer",
      minimum: 0,
      maximum: 20,
      default: 0,
      description: "Number of secondary casters",
    },
    range: { type: "string", nullable: true },
    targets: { type: "string", nullable: true },
    duration: { type: "string", nullable: true },
    criticalSuccess: { type: "string", nullable: true },
    success: { type: "string", nullable: true },
    failure: { type: "string", nullable: true },
    criticalFailure: { type: "string", nullable: true },
    traitIds: {
      type: "array",
      items: { type: "string", checkIdIsCuid: true },
      description: "Trait Ids",
    },
    secondaryCheckSkillIds: {
      type: "array",
      items: { type: "string", checkIdIsCuid: true },
      description: "Secondary check Skill Ids",
      default: [],
    },
    heightenings: {
      type: "array",
      items: heighteningInputSchema,
      description: "Fixed-rank heightenings (replaces XOR from spells — fixedRank only)",
      default: [],
    },
  },
  required: [
    "name",
    "description",
    "rank",
    "rarity",
    "castTime",
    "primaryCheck",
    "traitIds",
    "secondaryCheckSkillIds",
    "heightenings",
  ],
  additionalProperties: false,
} as const;

export const ritualPatchRequestBodySchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    description: { type: "string" },
    rank: { type: "integer", minimum: 1, maximum: 10 },
    rarity: { type: "string", enum: Object.values(Rarity) },
    castTime: { type: "string" },
    cost: { type: "string", nullable: true },
    primaryCheck: { type: "string" },
    secondaryCasters: { type: "integer", minimum: 0, maximum: 20 },
    range: { type: "string", nullable: true },
    targets: { type: "string", nullable: true },
    duration: { type: "string", nullable: true },
    criticalSuccess: { type: "string", nullable: true },
    success: { type: "string", nullable: true },
    failure: { type: "string", nullable: true },
    criticalFailure: { type: "string", nullable: true },
    traitIds: {
      type: "array",
      items: { type: "string", checkIdIsCuid: true },
    },
    secondaryCheckSkillIds: {
      type: "array",
      items: { type: "string", checkIdIsCuid: true },
    },
    heightenings: {
      type: "array",
      items: heighteningInputSchema,
      description: "When present, replaces all existing heightenings wholesale",
    },
  },
  additionalProperties: false,
  anyOf: [
    { required: ["name"] },
    { required: ["description"] },
    { required: ["rank"] },
    { required: ["rarity"] },
    { required: ["castTime"] },
    { required: ["cost"] },
    { required: ["primaryCheck"] },
    { required: ["secondaryCasters"] },
    { required: ["range"] },
    { required: ["targets"] },
    { required: ["duration"] },
    { required: ["criticalSuccess"] },
    { required: ["success"] },
    { required: ["failure"] },
    { required: ["criticalFailure"] },
    { required: ["traitIds"] },
    { required: ["secondaryCheckSkillIds"] },
    { required: ["heightenings"] },
  ],
} as const;
