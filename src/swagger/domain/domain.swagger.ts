import {
  domainGetPostResponseSchema,
  domainPatchRequestBodySchema,
  domainPostRequestBodySchema,
  domainRequestParamsSchema,
  domainSearchRequestQuerySchema,
  domainSearchResponseSchema,
} from "../../api/domain/domain-api.schema";
import { commonErrorsResponseSchema } from "../error.swagger";
import { securitySchema } from "../security.swagger";

const searchDomain = {
  tags: ["Domain"],
  description: "## Search Domains\nFilter by name, deityId, or active status.",
  operationId: "searchDomain",
  security: [securitySchema],
  parameters: [
    {
      in: "query",
      name: "pageOffset",
      schema: domainSearchRequestQuerySchema.properties.pageOffset,
      description: domainSearchRequestQuerySchema.properties.pageOffset.description,
    },
    {
      in: "query",
      name: "pageLimit",
      schema: domainSearchRequestQuerySchema.properties.pageLimit,
      description: domainSearchRequestQuerySchema.properties.pageLimit.description,
    },
    {
      in: "query",
      name: "name",
      schema: domainSearchRequestQuerySchema.properties.name,
      description: domainSearchRequestQuerySchema.properties.name.description,
    },
    {
      in: "query",
      name: "deityId",
      schema: domainSearchRequestQuerySchema.properties.deityId,
      description: domainSearchRequestQuerySchema.properties.deityId.description,
    },
    {
      in: "query",
      name: "isActive",
      schema: domainSearchRequestQuerySchema.properties.isActive,
      description: domainSearchRequestQuerySchema.properties.isActive.description,
    },
    {
      in: "query",
      name: "sort",
      schema: domainSearchRequestQuerySchema.properties.sort,
      description: domainSearchRequestQuerySchema.properties.sort.description,
    },
  ],
  responses: {
    "200": {
      description: "Successful Domain search",
      content: {
        "application/json": {
          schema: domainSearchResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const getDomain = {
  tags: ["Domain"],
  description: "## Get Domain",
  operationId: "getDomain",
  security: [securitySchema],
  responses: {
    "200": {
      description: "Successful Domain retrieval",
      content: {
        "application/json": {
          schema: domainGetPostResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const insertDomain = {
  tags: ["Domain"],
  description: "## Create a Domain record\n**Admin only.**",
  operationId: "insertDomain",
  security: [securitySchema],
  requestBody: {
    content: {
      "application/json": {
        schema: domainPostRequestBodySchema,
      },
    },
  },
  responses: {
    "201": {
      description: "Successful Domain creation",
      content: {
        "application/json": {
          schema: domainGetPostResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const updateDomain = {
  tags: ["Domain"],
  description: "## Update a Domain record\n**Admin only.**",
  operationId: "updateDomain",
  security: [securitySchema],
  requestBody: {
    content: {
      "application/json": {
        schema: domainPatchRequestBodySchema,
      },
    },
  },
  responses: {
    "204": {
      description: "Successful Domain update",
    },
    ...commonErrorsResponseSchema,
  },
};

const deleteDomain = {
  tags: ["Domain"],
  description: "## Delete a Domain record\n**Admin only.** Soft delete.",
  operationId: "deleteDomain",
  security: [securitySchema],
  responses: {
    "204": {
      description: "Successful Domain delete",
    },
    ...commonErrorsResponseSchema,
  },
};

const parameterId = {
  parameters: [
    {
      in: "path",
      name: "domainId",
      required: true,
      schema: domainRequestParamsSchema.properties.domainId,
      style: "simple",
    },
  ],
};

export const domainPaths = {
  "/domain": {
    post: insertDomain,
    get: searchDomain,
  },
  "/domain/{domainId}": {
    get: getDomain,
    patch: updateDomain,
    delete: deleteDomain,
    ...parameterId,
  },
};
