import {
  equipmentGetPostResponseSchema,
  equipmentPatchRequestBodySchema,
  equipmentPostRequestBodySchema,
  equipmentRequestParamsSchema,
  equipmentSearchRequestQuerySchema,
  equipmentSearchResponseSchema,
} from "../../api/equipment/equipment-api.schema";
import { commonErrorsResponseSchema } from "../error.swagger";
import { securitySchema } from "../security.swagger";

const searchEquipment = {
  tags: ["Equipment"],
  description:
    "## Search Equipment\nFilter by name, usage, rarity, level, traitIds, or active status.\n\n> **Note:** `price` is stored in copper pieces (cp): 1 gp = 10 sp = 100 cp. `bulk` is a free-form string (`\"—\"`, `\"L\"`, `\"1\"`, `\"2\"`, ...).",
  operationId: "searchEquipment",
  security: [securitySchema],
  parameters: [
    {
      in: "query",
      name: "pageOffset",
      schema: equipmentSearchRequestQuerySchema.properties.pageOffset,
      description: equipmentSearchRequestQuerySchema.properties.pageOffset.description,
    },
    {
      in: "query",
      name: "pageLimit",
      schema: equipmentSearchRequestQuerySchema.properties.pageLimit,
      description: equipmentSearchRequestQuerySchema.properties.pageLimit.description,
    },
    {
      in: "query",
      name: "name",
      schema: equipmentSearchRequestQuerySchema.properties.name,
      description: equipmentSearchRequestQuerySchema.properties.name.description,
    },
    {
      in: "query",
      name: "usage",
      schema: equipmentSearchRequestQuerySchema.properties.usage,
      description: equipmentSearchRequestQuerySchema.properties.usage.description,
    },
    {
      in: "query",
      name: "rarity",
      schema: equipmentSearchRequestQuerySchema.properties.rarity,
      description: equipmentSearchRequestQuerySchema.properties.rarity.description,
    },
    {
      in: "query",
      name: "level",
      schema: equipmentSearchRequestQuerySchema.properties.level,
      description: equipmentSearchRequestQuerySchema.properties.level.description,
    },
    {
      in: "query",
      name: "traitIds",
      schema: equipmentSearchRequestQuerySchema.properties.traitIds,
      description: equipmentSearchRequestQuerySchema.properties.traitIds.description,
    },
    {
      in: "query",
      name: "isActive",
      schema: equipmentSearchRequestQuerySchema.properties.isActive,
      description: equipmentSearchRequestQuerySchema.properties.isActive.description,
    },
    {
      in: "query",
      name: "sort",
      schema: equipmentSearchRequestQuerySchema.properties.sort,
      description: equipmentSearchRequestQuerySchema.properties.sort.description,
    },
  ],
  responses: {
    "200": {
      description: "Successful Equipment search",
      content: {
        "application/json": {
          schema: equipmentSearchResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const getEquipment = {
  tags: ["Equipment"],
  description: "## Get Equipment\nReachable by id even when soft-deleted.",
  operationId: "getEquipment",
  security: [securitySchema],
  responses: {
    "200": {
      description: "Successful Equipment retrieval",
      content: {
        "application/json": {
          schema: equipmentGetPostResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const insertEquipment = {
  tags: ["Equipment"],
  description:
    "## Create an Equipment record\n**Admin only.**\n\n- `price` is in copper pieces (cp).\n- `traitIds` connects M:N Trait relations; any unknown id returns **404** (`Trait not found in traitIds`).\n- A duplicate active name returns **409** (`An equipment item with that name already exists`); soft-deleted matches do not block creation.",
  operationId: "insertEquipment",
  security: [securitySchema],
  requestBody: {
    content: {
      "application/json": {
        schema: equipmentPostRequestBodySchema,
      },
    },
  },
  responses: {
    "201": {
      description: "Successful Equipment creation",
      content: {
        "application/json": {
          schema: equipmentGetPostResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const updateEquipment = {
  tags: ["Equipment"],
  description:
    "## Update an Equipment record\n**Admin only.**\n\n- `traitIds` replaces the trait set (`set` semantics); any unknown id returns **404**.",
  operationId: "updateEquipment",
  security: [securitySchema],
  requestBody: {
    content: {
      "application/json": {
        schema: equipmentPatchRequestBodySchema,
      },
    },
  },
  responses: {
    "204": {
      description: "Successful Equipment update",
    },
    ...commonErrorsResponseSchema,
  },
};

const deleteEquipment = {
  tags: ["Equipment"],
  description: "## Delete an Equipment record\n**Admin only.** Soft delete.",
  operationId: "deleteEquipment",
  security: [securitySchema],
  responses: {
    "204": {
      description: "Successful Equipment delete",
    },
    ...commonErrorsResponseSchema,
  },
};

const parameterId = {
  parameters: [
    {
      in: "path",
      name: "equipmentId",
      required: true,
      schema: equipmentRequestParamsSchema.properties.equipmentId,
      style: "simple",
    },
  ],
};

export const equipmentPaths = {
  "/equipment": {
    post: insertEquipment,
    get: searchEquipment,
  },
  "/equipment/{equipmentId}": {
    get: getEquipment,
    patch: updateEquipment,
    delete: deleteEquipment,
    ...parameterId,
  },
};
