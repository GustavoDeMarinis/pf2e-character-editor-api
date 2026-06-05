import {
  characterConditionCharacterParamsSchema,
  characterConditionGetPostResponseSchema,
  characterConditionListRequestQuerySchema,
  characterConditionListResponseSchema,
  characterConditionParamsSchema,
  characterConditionPatchRequestBodySchema,
  characterConditionPostRequestBodySchema,
} from "../../api/character-condition/character-condition-api.schema";
import { commonErrorsResponseSchema } from "../error.swagger";
import { securitySchema } from "../security.swagger";

const listCharacterConditions = {
  tags: ["CharacterCondition"],
  description:
    "## List active condition assignments for a character\n" +
    "**Admin + Player (owner-scoped).** Players can only list conditions for characters they " +
    "created or are assigned to.\n\n" +
    "By default returns all non-deleted assignments (including expired ones for audit history). " +
    "Pass `?currentlyActive=true` to filter to only assignments where `expiresAt` is null " +
    "or in the future relative to the server clock.",
  operationId: "listCharacterConditions",
  security: [securitySchema],
  parameters: [
    {
      in: "query",
      name: "currentlyActive",
      schema: characterConditionListRequestQuerySchema.properties.currentlyActive,
      description: characterConditionListRequestQuerySchema.properties.currentlyActive.description,
    },
  ],
  responses: {
    "200": {
      description: "Successful character condition list",
      content: { "application/json": { schema: characterConditionListResponseSchema } },
    },
    ...commonErrorsResponseSchema,
  },
};

const applyConditionToCharacter = {
  tags: ["CharacterCondition"],
  description:
    "## Apply a condition to a character\n" +
    "**Admin + Player (owner-scoped).** Players can only apply conditions to characters they own.\n\n" +
    "**Stacking:** Multiple assignments of the same condition are allowed " +
    "(e.g. two Persistent Damage instances from different sources). No uniqueness constraint on `(characterId, conditionId)`.\n\n" +
    "**`value` validation (defence-in-depth on top of AJV):**\n" +
    "- If the condition has `hasValue: false` and `value` is provided → **400**\n" +
    "- If the condition has `hasValue: true` and `value` is omitted or null → **400**\n\n" +
    "Returns **404** when the character or condition does not exist. " +
    "Returns **403** when a Player targets a character they do not own.",
  operationId: "applyConditionToCharacter",
  security: [securitySchema],
  requestBody: {
    required: true,
    content: { "application/json": { schema: characterConditionPostRequestBodySchema } },
  },
  responses: {
    "201": {
      description: "Successful condition application",
      content: { "application/json": { schema: characterConditionGetPostResponseSchema } },
    },
    ...commonErrorsResponseSchema,
  },
};

const updateCharacterCondition = {
  tags: ["CharacterCondition"],
  description:
    "## Adjust a character condition assignment\n" +
    "**Admin + Player (owner-scoped).**\n\n" +
    "Use this to bump a valued condition (e.g. Frightened 2 → 1), clear its expiry " +
    "(`expiresAt: null`), or update the source string.\n\n" +
    "**`value` validation:** same rules as POST apply — providing a value for a `hasValue: false` " +
    "condition or clearing it (`null`) for a `hasValue: true` condition returns **400**.\n\n" +
    "Returns **404** when the assignment does not exist, is already soft-deleted, " +
    "or belongs to a different character than the path param.",
  operationId: "updateCharacterCondition",
  security: [securitySchema],
  requestBody: {
    required: true,
    content: { "application/json": { schema: characterConditionPatchRequestBodySchema } },
  },
  responses: {
    "204": { description: "Successful condition assignment update" },
    ...commonErrorsResponseSchema,
  },
};

const removeConditionFromCharacter = {
  tags: ["CharacterCondition"],
  description:
    "## Remove a condition assignment from a character\n" +
    "**Admin + Player (owner-scoped).** Soft delete — the assignment row is retained for history.\n\n" +
    "Returns **404** when the assignment does not exist, is already soft-deleted, " +
    "or `characterConditionId` belongs to a different character than the path param. " +
    "Returns **403** when a Player targets a character they do not own.",
  operationId: "removeConditionFromCharacter",
  security: [securitySchema],
  responses: {
    "204": { description: "Successful condition assignment removal" },
    ...commonErrorsResponseSchema,
  },
};

const characterIdParameter = {
  in: "path",
  name: "characterId",
  required: true,
  schema: characterConditionCharacterParamsSchema.properties.characterId,
  style: "simple",
};

const characterConditionIdParameter = {
  in: "path",
  name: "characterConditionId",
  required: true,
  schema: characterConditionParamsSchema.properties.characterConditionId,
  style: "simple",
};

export const characterConditionPaths = {
  "/character/{characterId}/conditions": {
    get: listCharacterConditions,
    post: applyConditionToCharacter,
    parameters: [characterIdParameter],
  },
  "/character/{characterId}/conditions/{characterConditionId}": {
    patch: updateCharacterCondition,
    delete: removeConditionFromCharacter,
    parameters: [characterIdParameter, characterConditionIdParameter],
  },
};
