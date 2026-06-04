import {
  conditionGetPostResponseSchema,
  conditionPatchRequestBodySchema,
  conditionPostRequestBodySchema,
  conditionRequestParamsSchema,
  conditionSearchRequestQuerySchema,
  conditionSearchResponseSchema,
} from "../../api/condition/condition-api.schema";
import { commonErrorsResponseSchema } from "../error.swagger";
import { securitySchema } from "../security.swagger";

const searchConditions = {
  tags: ["Condition"],
  description:
    "## Search Conditions\n" +
    "Filter by `name` (partial, case-insensitive), `hasValue`, or active status.\n\n" +
    "Both `overrides` (conditions this condition overrides) and `overriddenBy` " +
    "(conditions that override this one) are included in each response item.",
  operationId: "searchConditions",
  security: [securitySchema],
  parameters: [
    { in: "query", name: "pageOffset", schema: conditionSearchRequestQuerySchema.properties.pageOffset, description: conditionSearchRequestQuerySchema.properties.pageOffset.description },
    { in: "query", name: "pageLimit",  schema: conditionSearchRequestQuerySchema.properties.pageLimit,  description: conditionSearchRequestQuerySchema.properties.pageLimit.description },
    { in: "query", name: "name",       schema: conditionSearchRequestQuerySchema.properties.name,       description: conditionSearchRequestQuerySchema.properties.name.description },
    { in: "query", name: "hasValue",   schema: conditionSearchRequestQuerySchema.properties.hasValue,   description: conditionSearchRequestQuerySchema.properties.hasValue.description },
    { in: "query", name: "isActive",   schema: conditionSearchRequestQuerySchema.properties.isActive,   description: conditionSearchRequestQuerySchema.properties.isActive.description },
    { in: "query", name: "sort",       schema: conditionSearchRequestQuerySchema.properties.sort,       description: conditionSearchRequestQuerySchema.properties.sort.description },
  ],
  responses: {
    "200": {
      description: "Successful Condition search",
      content: { "application/json": { schema: conditionSearchResponseSchema } },
    },
    ...commonErrorsResponseSchema,
  },
};

const getCondition = {
  tags: ["Condition"],
  description:
    "## Get Condition by Id\n" +
    "Returns the condition including both relation sides:\n" +
    "- `overrides` — conditions this condition suppresses (writable via `overrideIds` on POST/PATCH)\n" +
    "- `overriddenBy` — conditions that suppress this one (read-only; set from the other side)",
  operationId: "getCondition",
  security: [securitySchema],
  responses: {
    "200": {
      description: "Successful Condition retrieval",
      content: { "application/json": { schema: conditionGetPostResponseSchema } },
    },
    ...commonErrorsResponseSchema,
  },
};

const insertCondition = {
  tags: ["Condition"],
  description:
    "## Create a Condition record\n**Admin only.**\n\n" +
    "Supply `overrideIds` to declare which conditions this one overrides (e.g. Unconscious overrides Dying). " +
    "Each id in `overrideIds` must exist — a missing id returns **404**. " +
    "The `overriddenBy` side is automatically populated for the referenced conditions.\n\n" +
    "Returns **409** if an active condition with the same name already exists. " +
    "A soft-deleted match does not block creation.",
  operationId: "insertCondition",
  security: [securitySchema],
  requestBody: {
    required: true,
    content: { "application/json": { schema: conditionPostRequestBodySchema } },
  },
  responses: {
    "201": {
      description: "Successful Condition creation",
      content: { "application/json": { schema: conditionGetPostResponseSchema } },
    },
    ...commonErrorsResponseSchema,
  },
};

const updateCondition = {
  tags: ["Condition"],
  description:
    "## Update a Condition record\n**Admin only.**\n\n" +
    "Providing `overrideIds` **replaces** the entire `overrides` set (use `set` semantics). " +
    "Pass an empty array to remove all override edges.\n\n" +
    "Returns **400** if any id in `overrideIds` matches the condition's own id " +
    "(a condition cannot override itself). " +
    "Returns **404** if any id in `overrideIds` does not exist.",
  operationId: "updateCondition",
  security: [securitySchema],
  requestBody: {
    required: true,
    content: { "application/json": { schema: conditionPatchRequestBodySchema } },
  },
  responses: {
    "204": { description: "Successful Condition update" },
    ...commonErrorsResponseSchema,
  },
};

const deleteCondition = {
  tags: ["Condition"],
  description: "## Delete a Condition record\n**Admin only.** Soft delete.",
  operationId: "deleteCondition",
  security: [securitySchema],
  responses: {
    "204": { description: "Successful Condition delete" },
    ...commonErrorsResponseSchema,
  },
};

const parameterId = {
  parameters: [
    {
      in: "path",
      name: "conditionId",
      required: true,
      schema: conditionRequestParamsSchema.properties.conditionId,
      style: "simple",
    },
  ],
};

export const conditionPaths = {
  "/condition": {
    get: searchConditions,
    post: insertCondition,
  },
  "/condition/{conditionId}": {
    get: getCondition,
    patch: updateCondition,
    delete: deleteCondition,
    ...parameterId,
  },
};
