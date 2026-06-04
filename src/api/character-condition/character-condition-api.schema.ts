const commonCharacterConditionProperties = {
  id: { type: "string", description: "CharacterCondition Id" },
  createdAt: { type: "string", format: "date-time" },
  updatedAt: { type: "string", format: "date-time" },
  deletedAt: { type: "string", format: "date-time-nullable" },
  characterId: { type: "string", description: "Character Id" },
  conditionId: { type: "string", description: "Condition Id" },
  value: {
    type: "integer",
    minimum: 1,
    nullable: true,
    description: "Condition value (for valued conditions)",
  },
  source: { type: "string", nullable: true, description: "Source of the condition" },
  appliedAt: { type: "string", format: "date-time", description: "When the condition was applied" },
  expiresAt: { type: "string", format: "date-time-nullable", description: "When the condition expires" },
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
} as const;

const commonCharacterConditionRequired = [
  "id",
  "createdAt",
  "updatedAt",
  "deletedAt",
  "characterId",
  "conditionId",
  "value",
  "source",
  "appliedAt",
  "expiresAt",
  "condition",
] as const;

export const characterConditionCharacterParamsSchema = {
  type: "object",
  properties: {
    characterId: { type: "string", description: "Character Id", checkIdIsCuid: true },
  },
  required: ["characterId"],
  additionalProperties: false,
} as const;

export const characterConditionParamsSchema = {
  type: "object",
  properties: {
    characterId: { type: "string", description: "Character Id", checkIdIsCuid: true },
    characterConditionId: {
      type: "string",
      description: "CharacterCondition Id",
      checkIdIsCuid: true,
    },
  },
  required: ["characterId", "characterConditionId"],
  additionalProperties: false,
} as const;

export const characterConditionListRequestQuerySchema = {
  type: "object",
  properties: {
    currentlyActive: {
      type: "boolean",
      description: "Filter to only unexpired (expiresAt null or in the future) assignments",
    },
  },
  additionalProperties: false,
} as const;

export const characterConditionPostRequestBodySchema = {
  type: "object",
  properties: {
    conditionId: { type: "string", checkIdIsCuid: true, description: "Condition Id to apply" },
    value: {
      type: "integer",
      minimum: 1,
      nullable: true,
      description: "Condition value (required for valued conditions)",
    },
    source: { type: "string", description: "Source of the condition" },
    expiresAt: {
      type: "string",
      format: "date-time-nullable",
      description: "When the condition expires",
    },
  },
  required: ["conditionId"],
  additionalProperties: false,
} as const;

export const characterConditionPatchRequestBodySchema = {
  type: "object",
  properties: {
    value: {
      type: "integer",
      minimum: 1,
      nullable: true,
      description: "Condition value",
    },
    source: { type: "string", nullable: true, description: "Source of the condition" },
    expiresAt: {
      type: "string",
      format: "date-time-nullable",
      description: "When the condition expires",
    },
  },
  additionalProperties: false,
  anyOf: [
    { required: ["value"] },
    { required: ["source"] },
    { required: ["expiresAt"] },
  ],
} as const;

export const characterConditionGetPostResponseSchema = {
  type: "object",
  properties: { ...commonCharacterConditionProperties },
  required: commonCharacterConditionRequired,
  additionalProperties: false,
} as const;

export const characterConditionListResponseSchema = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: { ...commonCharacterConditionProperties },
        required: commonCharacterConditionRequired,
        additionalProperties: false,
      },
    },
  },
  required: ["items"],
  additionalProperties: false,
} as const;
