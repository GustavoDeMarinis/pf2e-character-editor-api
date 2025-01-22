import {
  languageGetPostResponseSchema,
  languagePatchRequestBodySchema,
  languagePostRequestBodySchema,
  languageRequestParamsSchema,
  languageSearchRequestQuerySchema,
  languageSearchResponseSchema,
} from "../../api/language/language-api.schema";
import { commonErrorsResponseSchema } from "../error.swagger";
import { securitySchema } from "../security.swagger";

const searchLanguage = {
  tags: ["Language"],
  description:
    "## Search Language\n" +
    "**Postman:** [GET Search Language](https://go.postman.co/workspace/cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-1fbf4c69-83bc-456a-a371-1eb1ca62f0ef)",
  operationId: "searchLanguage",
  security: [securitySchema],
  parameters: [
    {
      in: "query",
      name: "rarity",
      schema: languageSearchRequestQuerySchema.properties.rarity,
      description:
        languageSearchRequestQuerySchema.properties.rarity.description,
    },
    {
      in: "query",
      name: "pageOffset",
      schema: languageSearchRequestQuerySchema.properties.pageOffset,
      description:
        languageSearchRequestQuerySchema.properties.pageOffset.description,
    },
    {
      in: "query",
      name: "pageLimit",
      schema: languageSearchRequestQuerySchema.properties.pageLimit,
      description:
        languageSearchRequestQuerySchema.properties.pageLimit.description,
    },
    {
      in: "query",
      name: "isActive",
      schema: languageSearchRequestQuerySchema.properties.isActive,
      description:
        languageSearchRequestQuerySchema.properties.isActive.description,
    },
    {
      in: "query",
      name: "sort",
      schema: languageSearchRequestQuerySchema.properties.sort,
      description: languageSearchRequestQuerySchema.properties.sort.description,
    },
  ],
  responses: {
    "200": {
      description: "Successful Language search",
      content: {
        "application/json": {
          schema: languageSearchResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const getLanguage = {
  tags: ["Language"],
  description:
    "## Get Language\n" +
    "**Postman:** [GET Get Language](https://go.postman.co/workspace/cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-b7fd83b7-bc7b-46d8-b480-523c8c6100df)",
  operationId: "getLanguage",
  security: [securitySchema],
  responses: {
    "200": {
      description: "Successful Language retrieval",
      content: {
        "application/json": {
          schema: languageGetPostResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

export const insertLanguage = {
  tags: ["Language"],
  description:
    "## Create a Language record\n" +
    "**Postman:** [POST Create a Language record](https://go.postman.co/workspace/cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-8218e467-ac5b-4b62-8943-6c67a6ea9c9e)",
  operationId: "insertLanguage",
  security: [securitySchema],
  requestBody: {
    content: {
      "application/json": {
        schema: languagePostRequestBodySchema,
      },
    },
  },
  responses: {
    "201": {
      description: "Successful Language creation",
      content: {
        "application/json": {
          schema: languageGetPostResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const updateLanguage = {
  tags: ["Language"],
  description:
    "## Update a Language record\n" +
    "**Postman:** [PATCH Update a Language record](https://go.postman.co/workspace/cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-f240d5e7-247b-4eaf-a6dd-f81bfe45ffe2)",
  operationId: "updateLanguage",
  security: [securitySchema],
  requestBody: {
    content: {
      "application/json": {
        schema: languagePatchRequestBodySchema,
      },
    },
  },
  responses: {
    "204": {
      description: "Successful Language update",
    },
    ...commonErrorsResponseSchema,
  },
};

export const deleteLanguage = {
  tags: ["Language"],
  description:
    "## Delete a Language record\n" +
    "**Postman:** [DELETE Delete a Language record](https://go.postman.co/workspace/cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-2dc14cef-2a89-4d4c-94e1-94debb42d799)",
  operationId: "deleteLanguage",
  security: [securitySchema],
  responses: {
    "204": {
      description: "Successful Language delete",
    },
    ...commonErrorsResponseSchema,
  },
};

const parameterId = {
  parameters: [
    {
      in: "path",
      name: "languageId",
      required: true,
      schema: languageRequestParamsSchema.properties.languageId,
      style: "simple",
    },
  ],
};

export const languagePaths = {
  "/language": {
    post: insertLanguage,
    get: searchLanguage,
  },
  "/language/{languageId}": {
    get: getLanguage,
    patch: updateLanguage,
    delete: deleteLanguage,
    ...parameterId,
  },
};
