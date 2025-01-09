import {
  ancestryGetPostResponseSchema,
  ancestryPatchRequestBodySchema,
  ancestryPostRequestBodySchema,
  ancestryRequestParamsSchema,
  ancestrySearchRequestQuerySchema,
  ancestrySearchResponseSchema,
} from "../../api/ancestry/ancestry-api.schema";
import { commonErrorsResponseSchema } from "../error.swagger";
import { securitySchema } from "../security.swagger";

const searchAncestry = {
  tags: ["Ancestry"],
  description:
    "## Search Ancestry\n" +
    "**Postman:** [GET Search Ancestry](https://go.postman.co/workspace/cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-1fbf4c69-83bc-456a-a371-1eb1ca62f0ef)",
  operationId: "searchAncestry",
  security: [securitySchema],
  parameters: [
    {
      in: "query",
      name: "pageOffset",
      schema: ancestrySearchRequestQuerySchema.properties.pageOffset,
      description:
        ancestrySearchRequestQuerySchema.properties.pageOffset.description,
    },
    {
      in: "query",
      name: "pageLimit",
      schema: ancestrySearchRequestQuerySchema.properties.pageLimit,
      description:
        ancestrySearchRequestQuerySchema.properties.pageLimit.description,
    },
    {
      in: "query",
      name: "isActive",
      schema: ancestrySearchRequestQuerySchema.properties.isActive,
      description:
        ancestrySearchRequestQuerySchema.properties.isActive.description,
    },
    {
      in: "query",
      name: "sort",
      schema: ancestrySearchRequestQuerySchema.properties.sort,
      description: ancestrySearchRequestQuerySchema.properties.sort.description,
    },
  ],
  responses: {
    "200": {
      description: "Successful Ancestry search",
      content: {
        "application/json": {
          schema: ancestrySearchResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const getAncestry = {
  tags: ["Ancestry"],
  description:
    "## Get Ancestry\n" +
    "**Postman:** [GET Get Ancestry](https://go.postman.co/workspace/cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-b7fd83b7-bc7b-46d8-b480-523c8c6100df)",
  operationId: "getAncestry",
  security: [securitySchema],
  responses: {
    "200": {
      description: "Successful Ancestry retrieval",
      content: {
        "application/json": {
          schema: ancestryGetPostResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

export const insertAncestry = {
  tags: ["Ancestry"],
  description:
    "## Create a Ancestry record\n" +
    "**Postman:** [POST Create a Ancestry record](https://go.postman.co/workspace/cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-8218e467-ac5b-4b62-8943-6c67a6ea9c9e)",
  operationId: "insertAncestry",
  security: [securitySchema],
  requestBody: {
    content: {
      "application/json": {
        schema: ancestryPostRequestBodySchema,
      },
    },
  },
  responses: {
    "201": {
      description: "Successful Ancestry creation",
      content: {
        "application/json": {
          schema: ancestryGetPostResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const updateAncestry = {
  tags: ["Ancestry"],
  description:
    "## Update a Ancestry record\n" +
    "**Postman:** [PATCH Update a Ancestry record](https://go.postman.co/workspace/cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-f240d5e7-247b-4eaf-a6dd-f81bfe45ffe2)",
  operationId: "updateAncestry",
  security: [securitySchema],
  requestBody: {
    content: {
      "application/json": {
        schema: ancestryPatchRequestBodySchema,
      },
    },
  },
  responses: {
    "204": {
      description: "Successful Ancestry update",
    },
    ...commonErrorsResponseSchema,
  },
};

export const deleteAncestry = {
  tags: ["Ancestry"],
  description:
    "## Delete a Ancestry record\n" +
    "**Postman:** [DELETE Delete a Ancestry record](https://go.postman.co/workspace/cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-2dc14cef-2a89-4d4c-94e1-94debb42d799)",
  operationId: "deleteAncestry",
  security: [securitySchema],
  responses: {
    "204": {
      description: "Successful Ancestry delete",
    },
    ...commonErrorsResponseSchema,
  },
};

const parameterId = {
  parameters: [
    {
      in: "path",
      name: "ancestryId",
      required: true,
      schema: ancestryRequestParamsSchema.properties.ancestryId,
      style: "simple",
    },
  ],
};

export const ancestryPaths = {
  "/ancestry": {
    post: insertAncestry,
    get: searchAncestry,
  },
  "/ancestry/{ancestryId}": {
    get: getAncestry,
    patch: updateAncestry,
    delete: deleteAncestry,
    ...parameterId,
  },
};
