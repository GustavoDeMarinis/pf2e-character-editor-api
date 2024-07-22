import {
  characterGetResponseSchema,
  characterPostRequestBodySchema,
  characterPostResponseSchema,
  characterRequestParamsSchema,
  characterSearchRequestQuerySchema,
  characterSearchResponseSchema,
} from "../../api/character/character-api.schema";
import { commonErrorsResponseSchema } from "../error.swagger";
import { securitySchema } from "../security.swagger";

const searchCharacter = {
  tags: ["Character"],
  description:
    "## Search Character\n" +
    "**Postman:** [GET Search Character](https://web.postman.co/workspace/My-Workspace~cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-6cf417f2-4090-45c0-a3a1-084965653ea3)",
  operationId: "searchCharacter",
  security: [securitySchema],
  parameters: [
    {
      in: "query",
      name: "pageOffset",
      schema: characterSearchRequestQuerySchema.properties.pageOffset,
      description:
        characterSearchRequestQuerySchema.properties.pageOffset.description,
    },
    {
      in: "query",
      name: "pageLimit",
      schema: characterSearchRequestQuerySchema.properties.pageLimit,
      description:
        characterSearchRequestQuerySchema.properties.pageLimit.description,
    },
    {
      in: "query",
      name: "createdByUserId",
      schema: characterSearchRequestQuerySchema.properties.createdByUserId,
      description:
        characterSearchRequestQuerySchema.properties.createdByUserId
          .description,
    },
    {
      in: "query",
      name: "playerName",
      schema: characterSearchRequestQuerySchema.properties.assignedUserId,
      description:
        characterSearchRequestQuerySchema.properties.assignedUserId.description,
    },
    {
      in: "query",
      name: "isActive",
      schema: characterSearchRequestQuerySchema.properties.isActive,
      description:
        characterSearchRequestQuerySchema.properties.isActive.description,
    },
    {
      in: "query",
      name: "sort",
      schema: characterSearchRequestQuerySchema.properties.sort,
      description:
        characterSearchRequestQuerySchema.properties.sort.description,
    },
  ],
  responses: {
    "200": {
      description: "Successful Character search",
      content: {
        "application/json": {
          schema: characterSearchResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

export const getCharacter = {
  tags: ["Character"],
  description:
    "## Get a Character\n" +
    "**Postman:** [GET Get a Character record](https://web.postman.co/workspace/My-Workspace~cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-7a2585c4-a30d-401e-a77e-b76ee8e6ee0f)",
  operationId: "getCharacter",
  security: [securitySchema],
  responses: {
    "200": {
      description: "Successful Character retrieval",
      content: {
        "application/json": {
          schema: characterGetResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

export const insertCharacter = {
  tags: ["Character"],
  description:
    "## Create a Character record\n" +
    "**Postman:** [POST Create a Character record](https://lio-data.postman.co/workspace/LIO-IICE~15d79b5b-510b-4c5d-a774-c904574bdd65/request/22262514-c30420d8-43b8-49a6-bac9-c7e3055bae91)",
  operationId: "insertCharacter",
  security: [securitySchema],
  requestBody: {
    content: {
      "application/json": {
        schema: characterPostRequestBodySchema,
      },
    },
  },
  responses: {
    "201": {
      description: "Successful Character creation",
      content: {
        "application/json": {
          schema: characterPostResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const updateCharacter = {
  tags: ["Character"],
  description:
    "## Update a Character record\n" +
    "**Postman:** [PATCH Update a Character record](https://web.postman.co/workspace/My-Workspace~cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-22d3ead8-06ca-4be1-80bf-d588ea9c53cf)",
  operationId: "updateCharacter",
  security: [securitySchema],
  requestBody: {
    content: {
      "application/json": {
        schema: characterRequestParamsSchema,
      },
    },
  },
  responses: {
    "204": {
      description: "Successful Character update",
    },
    ...commonErrorsResponseSchema,
  },
};

export const deleteCharacter = {
  tags: ["Character"],
  description:
    "## Delete a Character record\n" +
    "**Postman:** [DELETE Delete a Character record](https://web.postman.co/workspace/My-Workspace~cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-0b991b64-4bca-4619-adfd-3f2d1e037e9e)",
  operationId: "deleteCharacter",
  security: [securitySchema],
  responses: {
    "204": {
      description: "Successful Character delete",
    },
    ...commonErrorsResponseSchema,
  },
};

const parameterId = {
  parameters: [
    {
      in: "path",
      name: "characterId",
      required: true,
      schema: characterRequestParamsSchema.properties.characterId,
      style: "simple",
    },
  ],
};

export const characterPaths = {
  "/character": {
    post: insertCharacter,
    get: searchCharacter,
  },
  "/character/{characterId}": {
    get: getCharacter,
    patch: updateCharacter,
    delete: deleteCharacter,
    ...parameterId,
  },
};
