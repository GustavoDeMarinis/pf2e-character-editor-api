import {
  armorBasePatchRequestBodySchema,
  armorBasePostGetResponseSchema,
  armorBasePostRequestBodySchema,
  armorBaseRequestParamsSchema,
  armorBaseSearchRequestQuerySchema,
  armorBaseSearchResponseSchema,
} from "../../api/armor-base/armor-base-api.schema";
import { commonErrorsResponseSchema } from "../error.swagger";
import { securitySchema } from "../security.swagger";

const searchArmorBase = {
  tags: ["Armor Base"],
  description:
    "## Search Armor Base\n" +
    "**Postman:** [GET Search Armor Base](https://go.postman.co/workspace/cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-1fbf4c69-83bc-456a-a371-1eb1ca62f0ef)",
  operationId: "searchArmorBase",
  security: [securitySchema],
  parameters: [
    {
      in: "query",
      name: "pageOffset",
      schema: armorBaseSearchRequestQuerySchema.properties.pageOffset,
      description:
        armorBaseSearchRequestQuerySchema.properties.pageOffset.description,
    },
    {
      in: "query",
      name: "pageLimit",
      schema: armorBaseSearchRequestQuerySchema.properties.pageLimit,
      description:
        armorBaseSearchRequestQuerySchema.properties.pageLimit.description,
    },
    {
      in: "query",
      name: "isActive",
      schema: armorBaseSearchRequestQuerySchema.properties.isActive,
      description:
        armorBaseSearchRequestQuerySchema.properties.isActive.description,
    },
    {
      in: "query",
      name: "sort",
      schema: armorBaseSearchRequestQuerySchema.properties.sort,
      description:
        armorBaseSearchRequestQuerySchema.properties.sort.description,
    },
  ],
  responses: {
    "200": {
      description: "Successful Armor Base search",
      content: {
        "application/json": {
          schema: armorBaseSearchResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const getArmorBase = {
  tags: ["Armor Base"],
  description:
    "## Get Armor Base\n" +
    "**Postman:** [GET Get Armor Base](https://go.postman.co/workspace/cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-b7fd83b7-bc7b-46d8-b480-523c8c6100df)",
  operationId: "getArmorBase",
  security: [securitySchema],
  responses: {
    "200": {
      description: "Successful ArmorBase retrieval",
      content: {
        "application/json": {
          schema: armorBasePostGetResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

export const insertArmorBase = {
  tags: ["Armor Base"],
  description:
    "## Create a Armor Base record\n" +
    "**Postman:** [POST Create a Armor Base record](https://go.postman.co/workspace/cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-8218e467-ac5b-4b62-8943-6c67a6ea9c9e)",
  operationId: "insertArmorBase",
  security: [securitySchema],
  requestBody: {
    content: {
      "application/json": {
        schema: armorBasePostRequestBodySchema,
      },
    },
  },
  responses: {
    "201": {
      description: "Successful Armor Base creation",
      content: {
        "application/json": {
          schema: armorBasePostGetResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const updateArmorBase = {
  tags: ["Armor Base"],
  description:
    "## Update a Armor Base record\n" +
    "**Postman:** [PATCH Update a Armor Base record](https://go.postman.co/workspace/cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-f240d5e7-247b-4eaf-a6dd-f81bfe45ffe2)",
  operationId: "updateArmorBase",
  security: [securitySchema],
  requestBody: {
    content: {
      "application/json": {
        schema: armorBasePatchRequestBodySchema,
      },
    },
  },
  responses: {
    "204": {
      description: "Successful Armor Base update",
    },
    ...commonErrorsResponseSchema,
  },
};

export const deleteArmorBase = {
  tags: ["Armor Base"],
  description:
    "## Delete a Armor Base record\n" +
    "**Postman:** [DELETE Delete a Armor Base record](https://go.postman.co/workspace/cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-2dc14cef-2a89-4d4c-94e1-94debb42d799)",
  operationId: "deleteArmorBase",
  security: [securitySchema],
  responses: {
    "204": {
      description: "Successful Armor Base delete",
    },
    ...commonErrorsResponseSchema,
  },
};

const parameterId = {
  parameters: [
    {
      in: "path",
      name: "armorBaseId",
      required: true,
      schema: armorBaseRequestParamsSchema.properties.armorBaseId,
      style: "simple",
    },
  ],
};

export const armorBasePaths = {
  "/armor-base": {
    post: insertArmorBase,
    get: searchArmorBase,
  },
  "/armor-base/{armorBaseId}": {
    get: getArmorBase,
    patch: updateArmorBase,
    delete: deleteArmorBase,
    ...parameterId,
  },
};
