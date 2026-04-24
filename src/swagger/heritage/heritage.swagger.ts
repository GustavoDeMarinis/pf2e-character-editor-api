import {
  heritageGetPostResponseSchema,
  heritagePatchRequestBodySchema,
  heritagePostRequestBodySchema,
  heritageRequestParamsSchema,
  heritageSearchRequestQuerySchema,
  heritageSearchResponseSchema,
} from "../../api/heritage/heritage-api.schema";
import { commonErrorsResponseSchema } from "../error.swagger";
import { securitySchema } from "../security.swagger";

const searchHeritage = {
  tags: ["Heritage"],
  description: "## Search Heritage\nFilter by ancestryId, rarity, name, or active status.\n\n> **Note:** Versatile Heritages (multi-ancestry) are not yet supported; each Heritage belongs to exactly one Ancestry.",
  operationId: "searchHeritage",
  security: [securitySchema],
  parameters: [
    {
      in: "query",
      name: "pageOffset",
      schema: heritageSearchRequestQuerySchema.properties.pageOffset,
      description: heritageSearchRequestQuerySchema.properties.pageOffset.description,
    },
    {
      in: "query",
      name: "pageLimit",
      schema: heritageSearchRequestQuerySchema.properties.pageLimit,
      description: heritageSearchRequestQuerySchema.properties.pageLimit.description,
    },
    {
      in: "query",
      name: "ancestryId",
      schema: heritageSearchRequestQuerySchema.properties.ancestryId,
      description: heritageSearchRequestQuerySchema.properties.ancestryId.description,
    },
    {
      in: "query",
      name: "rarity",
      schema: heritageSearchRequestQuerySchema.properties.rarity,
      description: heritageSearchRequestQuerySchema.properties.rarity.description,
    },
    {
      in: "query",
      name: "name",
      schema: heritageSearchRequestQuerySchema.properties.name,
      description: heritageSearchRequestQuerySchema.properties.name.description,
    },
    {
      in: "query",
      name: "isActive",
      schema: heritageSearchRequestQuerySchema.properties.isActive,
      description: heritageSearchRequestQuerySchema.properties.isActive.description,
    },
    {
      in: "query",
      name: "sort",
      schema: heritageSearchRequestQuerySchema.properties.sort,
      description: heritageSearchRequestQuerySchema.properties.sort.description,
    },
  ],
  responses: {
    "200": {
      description: "Successful Heritage search",
      content: {
        "application/json": {
          schema: heritageSearchResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const getHeritage = {
  tags: ["Heritage"],
  description: "## Get Heritage",
  operationId: "getHeritage",
  security: [securitySchema],
  responses: {
    "200": {
      description: "Successful Heritage retrieval",
      content: {
        "application/json": {
          schema: heritageGetPostResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const insertHeritage = {
  tags: ["Heritage"],
  description: "## Create a Heritage record\n**Admin only.**",
  operationId: "insertHeritage",
  security: [securitySchema],
  requestBody: {
    content: {
      "application/json": {
        schema: heritagePostRequestBodySchema,
      },
    },
  },
  responses: {
    "201": {
      description: "Successful Heritage creation",
      content: {
        "application/json": {
          schema: heritageGetPostResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const updateHeritage = {
  tags: ["Heritage"],
  description: "## Update a Heritage record\n**Admin only.**",
  operationId: "updateHeritage",
  security: [securitySchema],
  requestBody: {
    content: {
      "application/json": {
        schema: heritagePatchRequestBodySchema,
      },
    },
  },
  responses: {
    "204": {
      description: "Successful Heritage update",
    },
    ...commonErrorsResponseSchema,
  },
};

const deleteHeritage = {
  tags: ["Heritage"],
  description: "## Delete a Heritage record\n**Admin only.** Soft delete.",
  operationId: "deleteHeritage",
  security: [securitySchema],
  responses: {
    "204": {
      description: "Successful Heritage delete",
    },
    ...commonErrorsResponseSchema,
  },
};

const parameterId = {
  parameters: [
    {
      in: "path",
      name: "heritageId",
      required: true,
      schema: heritageRequestParamsSchema.properties.heritageId,
      style: "simple",
    },
  ],
};

export const heritagePaths = {
  "/heritage": {
    post: insertHeritage,
    get: searchHeritage,
  },
  "/heritage/{heritageId}": {
    get: getHeritage,
    patch: updateHeritage,
    delete: deleteHeritage,
    ...parameterId,
  },
};
