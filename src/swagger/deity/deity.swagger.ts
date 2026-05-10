import {
  deityGetPostResponseSchema,
  deityPatchRequestBodySchema,
  deityPostRequestBodySchema,
  deityRequestParamsSchema,
  deitySearchRequestQuerySchema,
  deitySearchResponseSchema,
} from "../../api/deity/deity-api.schema";
import { commonErrorsResponseSchema } from "../error.swagger";
import { securitySchema } from "../security.swagger";

const searchDeity = {
  tags: ["Deity"],
  description: "## Search Deities\nFilter by name, rarity, divineSkillId, favoredWeaponId, divineFont, sanctification, or active status.",
  operationId: "searchDeity",
  security: [securitySchema],
  parameters: [
    {
      in: "query",
      name: "pageOffset",
      schema: deitySearchRequestQuerySchema.properties.pageOffset,
      description: deitySearchRequestQuerySchema.properties.pageOffset.description,
    },
    {
      in: "query",
      name: "pageLimit",
      schema: deitySearchRequestQuerySchema.properties.pageLimit,
      description: deitySearchRequestQuerySchema.properties.pageLimit.description,
    },
    {
      in: "query",
      name: "name",
      schema: deitySearchRequestQuerySchema.properties.name,
      description: deitySearchRequestQuerySchema.properties.name.description,
    },
    {
      in: "query",
      name: "rarity",
      schema: deitySearchRequestQuerySchema.properties.rarity,
      description: deitySearchRequestQuerySchema.properties.rarity.description,
    },
    {
      in: "query",
      name: "divineSkillId",
      schema: deitySearchRequestQuerySchema.properties.divineSkillId,
      description: deitySearchRequestQuerySchema.properties.divineSkillId.description,
    },
    {
      in: "query",
      name: "favoredWeaponId",
      schema: deitySearchRequestQuerySchema.properties.favoredWeaponId,
      description: deitySearchRequestQuerySchema.properties.favoredWeaponId.description,
    },
    {
      in: "query",
      name: "divineFont",
      schema: deitySearchRequestQuerySchema.properties.divineFont,
      description: deitySearchRequestQuerySchema.properties.divineFont.description,
    },
    {
      in: "query",
      name: "sanctification",
      schema: deitySearchRequestQuerySchema.properties.sanctification,
      description: deitySearchRequestQuerySchema.properties.sanctification.description,
    },
    {
      in: "query",
      name: "isActive",
      schema: deitySearchRequestQuerySchema.properties.isActive,
      description: deitySearchRequestQuerySchema.properties.isActive.description,
    },
    {
      in: "query",
      name: "sort",
      schema: deitySearchRequestQuerySchema.properties.sort,
      description: deitySearchRequestQuerySchema.properties.sort.description,
    },
  ],
  responses: {
    "200": {
      description: "Successful Deity search",
      content: {
        "application/json": {
          schema: deitySearchResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const getDeity = {
  tags: ["Deity"],
  description: "## Get Deity\nReturns the full bundle: domains, alternate domains, divine skill, favored weapon, traits, and cleric spells.\n\n> **Note:** Cleric spells are returned as an empty array until ISSUE-02.05 lands.",
  operationId: "getDeity",
  security: [securitySchema],
  responses: {
    "200": {
      description: "Successful Deity retrieval",
      content: {
        "application/json": {
          schema: deityGetPostResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const insertDeity = {
  tags: ["Deity"],
  description: "## Create a Deity record\n**Admin only.**",
  operationId: "insertDeity",
  security: [securitySchema],
  requestBody: {
    content: {
      "application/json": {
        schema: deityPostRequestBodySchema,
      },
    },
  },
  responses: {
    "201": {
      description: "Successful Deity creation",
      content: {
        "application/json": {
          schema: deityGetPostResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const updateDeity = {
  tags: ["Deity"],
  description: "## Update a Deity record\n**Admin only.**",
  operationId: "updateDeity",
  security: [securitySchema],
  requestBody: {
    content: {
      "application/json": {
        schema: deityPatchRequestBodySchema,
      },
    },
  },
  responses: {
    "204": {
      description: "Successful Deity update",
    },
    ...commonErrorsResponseSchema,
  },
};

const deleteDeity = {
  tags: ["Deity"],
  description: "## Delete a Deity record\n**Admin only.** Soft delete.",
  operationId: "deleteDeity",
  security: [securitySchema],
  responses: {
    "204": {
      description: "Successful Deity delete",
    },
    ...commonErrorsResponseSchema,
  },
};

const parameterId = {
  parameters: [
    {
      in: "path",
      name: "deityId",
      required: true,
      schema: deityRequestParamsSchema.properties.deityId,
      style: "simple",
    },
  ],
};

export const deityPaths = {
  "/deity": {
    post: insertDeity,
    get: searchDeity,
  },
  "/deity/{deityId}": {
    get: getDeity,
    patch: updateDeity,
    delete: deleteDeity,
    ...parameterId,
  },
};
