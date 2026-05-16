import {
  ActionCost,
  HeighteningKind,
  Rarity,
  SpellArea,
  SpellComponent,
  SpellSaveType,
  SpellTargetType,
  SpellTradition,
} from "@prisma/client";
import {
  paginationRequestPropertySchema,
  paginationRequiredPropertiesSchema,
  paginationResponsePropertySchema,
} from "../../utils/pagination.types";

const commonSpellProperties = {
  id: { type: "string", description: "Spell Id" },
  createdAt: { type: "string", format: "date-time" },
  updatedAt: { type: "string", format: "date-time" },
  deletedAt: { type: "string", format: "date-time-nullable" },
  name: { type: "string", description: "Spell Name" },
  description: { type: "string", description: "Spell Description" },
  rank: {
    type: "integer",
    minimum: 0,
    maximum: 10,
    description: "Spell Rank (0 = cantrip)",
  },
  isCantrip: {
    type: "boolean",
    description: "Derived from rank === 0",
  },
  isFocus: { type: "boolean", description: "Is Focus Spell?" },
  traditions: {
    type: "array",
    items: { type: "string", enum: Object.values(SpellTradition) },
    description: "Spell Traditions",
  },
  rarity: {
    type: "string",
    enum: Object.values(Rarity),
    description: "Spell Rarity",
  },
  components: {
    type: "array",
    items: { type: "string", enum: Object.values(SpellComponent) },
    description: "Spell Components",
  },
  actionCost: {
    type: "string",
    enum: Object.values(ActionCost),
    description: "Action Cost",
  },
  castTimeText: { type: "string", nullable: true, description: "Non-standard cast time" },
  range: { type: "string", nullable: true, description: "Range (free text)" },
  targets: { type: "string", nullable: true, description: "Targets (free text)" },
  targetType: {
    type: "string",
    enum: Object.values(SpellTargetType),
    description: "Target Type",
  },
  areaType: {
    type: "string",
    enum: Object.values(SpellArea),
    description: "Area Type",
  },
  areaSize: { type: "integer", nullable: true, description: "Area Size (feet)" },
  duration: { type: "string", nullable: true, description: "Duration (free text)" },
  savingThrow: {
    type: "string",
    enum: Object.values(SpellSaveType),
    description: "Saving Throw",
  },
  basicSave: { type: "boolean", description: "Is the save a basic save?" },
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
  heightenings: {
    type: "array",
    items: {
      type: "object",
      properties: {
        id: { type: "string" },
        kind: { type: "string", enum: Object.values(HeighteningKind) },
        bump: { type: "integer" },
        effect: { type: "string" },
      },
      additionalProperties: false,
      required: ["id", "kind", "bump", "effect"],
    },
  },
} as const;

const commonSpellRequired = [
  "id",
  "createdAt",
  "updatedAt",
  "deletedAt",
  "name",
  "description",
  "rank",
  "isCantrip",
  "isFocus",
  "traditions",
  "rarity",
  "components",
  "actionCost",
  "castTimeText",
  "range",
  "targets",
  "targetType",
  "areaType",
  "areaSize",
  "duration",
  "savingThrow",
  "basicSave",
  "traits",
  "heightenings",
] as const;

const heighteningInputSchema = {
  type: "object",
  properties: {
    kind: {
      type: "string",
      enum: Object.values(HeighteningKind),
      description: "Interval = 'Heightened (+N)' (effect repeats every N ranks); FixedRank = 'Heightened (Nth)' (effect applies at one rank).",
    },
    bump: {
      type: "integer",
      minimum: 1,
      maximum: 10,
      description: "Interpreted by `kind`: for Interval, the +N step; for FixedRank, the absolute rank.",
    },
    effect: { type: "string", description: "Heightening effect text" },
  },
  additionalProperties: false,
  required: ["kind", "bump", "effect"],
} as const;

export const spellSearchRequestQuerySchema = {
  type: "object",
  properties: {
    search: { type: "string", description: "Search spells by name or description" },
    tradition: {
      type: "string",
      enum: Object.values(SpellTradition),
      description: "Filter by Tradition",
    },
    rank: { type: "integer", minimum: 0, maximum: 10, description: "Filter by exact rank" },
    minRank: { type: "integer", minimum: 0, maximum: 10, description: "Minimum rank (inclusive)" },
    maxRank: { type: "integer", minimum: 0, maximum: 10, description: "Maximum rank (inclusive)" },
    isCantrip: { type: "boolean", description: "Filter cantrips (rank === 0)" },
    isFocus: { type: "boolean", description: "Filter focus spells" },
    savingThrow: {
      type: "string",
      enum: Object.values(SpellSaveType),
      description: "Filter by Saving Throw",
    },
    traitIds: {
      type: "array",
      items: { type: "string", checkIdIsCuid: true },
      description: "Filter by Trait Ids",
    },
    rarity: {
      type: "string",
      enum: Object.values(Rarity),
      description: "Filter by Rarity",
    },
    isActive: { type: "boolean", description: "Filter active/inactive spells" },
    sort: { type: "string", description: "Columns to build Prisma orderBy clause" },
    ...paginationRequestPropertySchema,
  },
  additionalProperties: false,
} as const;

export const spellSearchResponseSchema = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: { ...commonSpellProperties },
        required: commonSpellRequired,
        additionalProperties: false,
      },
    },
    ...paginationResponsePropertySchema,
  },
  ...paginationRequiredPropertiesSchema,
} as const;

export const spellRequestParamsSchema = {
  type: "object",
  properties: {
    spellId: { type: "string", description: "Spell Id", checkIdIsCuid: true },
  },
  required: ["spellId"],
  additionalProperties: false,
} as const;

export const spellGetPostResponseSchema = {
  type: "object",
  properties: { ...commonSpellProperties },
  required: commonSpellRequired,
  additionalProperties: false,
} as const;

export const spellPostRequestBodySchema = {
  type: "object",
  properties: {
    name: { type: "string", description: "Spell Name" },
    description: { type: "string", description: "Spell Description" },
    rank: { type: "integer", minimum: 0, maximum: 10, description: "Spell Rank (0 = cantrip)" },
    isFocus: { type: "boolean", description: "Is Focus Spell?", default: false },
    traditions: {
      type: "array",
      items: { type: "string", enum: Object.values(SpellTradition) },
      description: "Spell Traditions",
    },
    rarity: {
      type: "string",
      enum: Object.values(Rarity),
      description: "Spell Rarity",
    },
    components: {
      type: "array",
      items: { type: "string", enum: Object.values(SpellComponent) },
      description: "Spell Components",
    },
    actionCost: {
      type: "string",
      enum: Object.values(ActionCost),
      description: "Action Cost",
    },
    castTimeText: { type: "string", nullable: true, maxLength: 200 },
    range: { type: "string", nullable: true, maxLength: 200 },
    targets: { type: "string", nullable: true, maxLength: 200 },
    targetType: {
      type: "string",
      enum: Object.values(SpellTargetType),
      description: "Target Type",
    },
    areaType: {
      type: "string",
      enum: Object.values(SpellArea),
      description: "Area Type",
    },
    areaSize: { type: "integer", nullable: true, minimum: 0 },
    duration: { type: "string", nullable: true, maxLength: 200 },
    savingThrow: {
      type: "string",
      enum: Object.values(SpellSaveType),
      description: "Saving Throw",
    },
    basicSave: { type: "boolean", description: "Basic Save?", default: false },
    traitIds: {
      type: "array",
      items: { type: "string", checkIdIsCuid: true },
      description: "Trait Ids",
    },
    heightenings: {
      type: "array",
      items: heighteningInputSchema,
      description: "Spell Heightenings",
    },
  },
  required: [
    "name",
    "description",
    "rank",
    "traditions",
    "rarity",
    "components",
    "actionCost",
    "targetType",
    "areaType",
    "savingThrow",
    "traitIds",
    "heightenings",
  ],
  additionalProperties: false,
} as const;

export const spellPatchRequestBodySchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    description: { type: "string" },
    rank: { type: "integer", minimum: 0, maximum: 10 },
    isFocus: { type: "boolean" },
    traditions: {
      type: "array",
      items: { type: "string", enum: Object.values(SpellTradition) },
    },
    rarity: { type: "string", enum: Object.values(Rarity) },
    components: {
      type: "array",
      items: { type: "string", enum: Object.values(SpellComponent) },
    },
    actionCost: { type: "string", enum: Object.values(ActionCost) },
    castTimeText: { type: "string", nullable: true, maxLength: 200 },
    range: { type: "string", nullable: true, maxLength: 200 },
    targets: { type: "string", nullable: true, maxLength: 200 },
    targetType: { type: "string", enum: Object.values(SpellTargetType) },
    areaType: { type: "string", enum: Object.values(SpellArea) },
    areaSize: { type: "integer", nullable: true, minimum: 0 },
    duration: { type: "string", nullable: true, maxLength: 200 },
    savingThrow: { type: "string", enum: Object.values(SpellSaveType) },
    basicSave: { type: "boolean" },
    traitIds: {
      type: "array",
      items: { type: "string", checkIdIsCuid: true },
    },
    heightenings: {
      type: "array",
      items: heighteningInputSchema,
    },
  },
  additionalProperties: false,
  anyOf: [
    { required: ["name"] },
    { required: ["description"] },
    { required: ["rank"] },
    { required: ["isFocus"] },
    { required: ["traditions"] },
    { required: ["rarity"] },
    { required: ["components"] },
    { required: ["actionCost"] },
    { required: ["castTimeText"] },
    { required: ["range"] },
    { required: ["targets"] },
    { required: ["targetType"] },
    { required: ["areaType"] },
    { required: ["areaSize"] },
    { required: ["duration"] },
    { required: ["savingThrow"] },
    { required: ["basicSave"] },
    { required: ["traitIds"] },
    { required: ["heightenings"] },
  ],
} as const;
