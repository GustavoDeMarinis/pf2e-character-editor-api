import {
  characterClassGetResponseSchema,
  characterClassPostRequestBodySchema,
  characterClassPostResponseSchema,
  characterClassRequestParamsSchema,
  characterClassSearchRequestQuerySchema,
  characterClassSearchResponseSchema,
} from "../../api/characterClass/characterClass.schema";
import { commonErrorsResponseSchema } from "../error.swagger";
import { securitySchema } from "../security.swagger";

const searchCharacterClass = {
  tags: ["Character Class"],
  description:
    "## Search Character\n" +
    "**Postman:** [GET Search Character Class](https://web.postman.co/workspace/My-Workspace~cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-33effc6c-17ac-4f61-8eb1-af846a63c660)",
  operationId: "searchCharacterClass",
  security: [securitySchema],
  parameters: [
    {
      in: "query",
      name: "pageOffset",
      schema: characterClassSearchRequestQuerySchema.properties.pageOffset,
      description:
        characterClassSearchRequestQuerySchema.properties.pageOffset
          .description,
    },
    {
      in: "query",
      name: "pageLimit",
      schema: characterClassSearchRequestQuerySchema.properties.pageLimit,
      description:
        characterClassSearchRequestQuerySchema.properties.pageLimit.description,
    },
    {
      in: "query",
      name: "className",
      schema: characterClassSearchRequestQuerySchema.properties.className,
      description:
        characterClassSearchRequestQuerySchema.properties.className.description,
    },
    {
      in: "query",
      name: "playerName",
      schema: characterClassSearchRequestQuerySchema.properties.hitPoints,
      description:
        characterClassSearchRequestQuerySchema.properties.hitPoints.description,
    },
    {
      in: "query",
      name: "isActive",
      schema: characterClassSearchRequestQuerySchema.properties.isActive,
      description:
        characterClassSearchRequestQuerySchema.properties.isActive.description,
    },
    {
      in: "query",
      name: "sort",
      schema: characterClassSearchRequestQuerySchema.properties.sort,
      description:
        characterClassSearchRequestQuerySchema.properties.sort.description,
    },
  ],
  responses: {
    "200": {
      description: "Successful Character Class search",
      content: {
        "application/json": {
          schema: characterClassSearchResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

export const getCharacterClass = {
  tags: ["Character Class"],
  description:
    "## Get a Character Class\n" +
    "**Postman:** [GET Get a Character Class record](https://web.postman.co/workspace/My-Workspace~cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-e22f2f5d-9719-40d8-98c8-e0a3058385f7)",
  operationId: "getCharacterClass",
  security: [securitySchema],
  responses: {
    "200": {
      description: "Successful Character Class retrieval",
      content: {
        "application/json": {
          schema: characterClassGetResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

export const insertCharacterClass = {
  tags: ["Character Class"],
  description:
    "## Create a Character Class record\n" +
    "**Postman:** [POST Create a Character Class record](https://web.postman.co/workspace/My-Workspace~cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-474a9614-c2f7-4085-8613-cf6fcaf90586)",
  operationId: "insertCharacterClass",
  security: [securitySchema],
  requestBody: {
    content: {
      "application/json": {
        schema: characterClassPostRequestBodySchema,
      },
    },
  },
  responses: {
    "201": {
      description: "Successful Character creation",
      content: {
        "application/json": {
          schema: characterClassPostResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const updateCharacterClass = {
  tags: ["Character"],
  description:
    "## Update a Character record\n" +
    "**Postman:** [PATCH Update a Character record](https://web.postman.co/workspace/My-Workspace~cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-ac57516d-37d3-4f12-892f-d01296d09e03)",
  operationId: "updateCharacter",
  security: [securitySchema],
  requestBody: {
    content: {
      "application/json": {
        schema: characterClassRequestParamsSchema,
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

export const deleteCharacterClass = {
  tags: ["Character"],
  description:
    "## Delete a Character record\n" +
    "**Postman:** [DELETE Delete a Character record](https://web.postman.co/workspace/My-Workspace~cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-ac1df5eb-731d-4ef1-94df-76d1dce43556)",
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
      name: "characterClassId",
      required: true,
      schema: characterClassRequestParamsSchema.properties.characterClassId,
      style: "simple",
    },
  ],
};

export const characterPaths = {
  "/characterClass": {
    post: insertCharacterClass,
    get: searchCharacterClass,
  },
  "/characterClass/{characterClassId}": {
    get: getCharacterClass,
    patch: updateCharacterClass,
    delete: deleteCharacterClass,
    ...parameterId,
  },
};
