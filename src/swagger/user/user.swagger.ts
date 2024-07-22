import {
  userGetResponseSchema,
  userPatchRequestBodySchema,
  userRequestParamsSchema,
  userSearchRequestQueryParamsSchema,
  userSearchResponseSchema,
} from "../../api/user/user-api.schema";
import { commonErrorsResponseSchema } from "../error.swagger";
import { securitySchema } from "../security.swagger";

const searchUser = {
  tags: ["User"],
  description:
    "## Search User\n" +
    "**Postman:** [GET Search User](https://web.postman.co/workspace/My-Workspace~cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-6cf417f2-4090-45c0-a3a1-084965653ea3)",
  operationId: "searchUser",
  security: [securitySchema],
  parameters: [
    {
      in: "query",
      name: "pageOffset",
      schema: userSearchRequestQueryParamsSchema.properties.pageOffset,
      description:
        userSearchRequestQueryParamsSchema.properties.pageOffset.description,
    },
    {
      in: "query",
      name: "pageLimit",
      schema: userSearchRequestQueryParamsSchema.properties.pageLimit,
      description:
        userSearchRequestQueryParamsSchema.properties.pageLimit.description,
    },
    {
      in: "query",
      name: "userName",
      schema: userSearchRequestQueryParamsSchema.properties.userName,
      description:
        userSearchRequestQueryParamsSchema.properties.userName.description,
    },
    {
      in: "query",
      name: "userEmail",
      schema: userSearchRequestQueryParamsSchema.properties.userEmail,
      description:
        userSearchRequestQueryParamsSchema.properties.userEmail.description,
    },
    {
      in: "query",
      name: "isActive",
      schema: userSearchRequestQueryParamsSchema.properties.isActive,
      description:
        userSearchRequestQueryParamsSchema.properties.isActive.description,
    },
    {
      in: "query",
      name: "sort",
      schema: userSearchRequestQueryParamsSchema.properties.sort,
      description:
        userSearchRequestQueryParamsSchema.properties.sort.description,
    },
  ],
  responses: {
    "200": {
      description: "Successful Character search",
      content: {
        "application/json": {
          schema: userSearchResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

export const getUser = {
  tags: ["User"],
  description:
    "## Get a User\n" +
    "**Postman:** [GET Get a User record](https://web.postman.co/workspace/My-Workspace~cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-7a2585c4-a30d-401e-a77e-b76ee8e6ee0f)",
  operationId: "getUser",
  security: [securitySchema],
  responses: {
    "200": {
      description: "Successful User retrieval",
      content: {
        "application/json": {
          schema: userGetResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const updateUser = {
  tags: ["User"],
  description:
    "## Update a User record\n" +
    "**Postman:** [PATCH Update a User record](https://web.postman.co/workspace/My-Workspace~cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-22d3ead8-06ca-4be1-80bf-d588ea9c53cf)",
  operationId: "updateUser",
  security: [securitySchema],
  requestBody: {
    content: {
      "application/json": {
        schema: userPatchRequestBodySchema,
      },
    },
  },
  responses: {
    "204": {
      description: "Successful User update",
    },
    ...commonErrorsResponseSchema,
  },
};

export const deleteUser = {
  tags: ["User"],
  description:
    "## Delete a User record\n" +
    "**Postman:** [DELETE Delete a User record](https://web.postman.co/workspace/My-Workspace~cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-0b991b64-4bca-4619-adfd-3f2d1e037e9e)",
  operationId: "deleteUser",
  security: [securitySchema],
  responses: {
    "204": {
      description: "Successful User delete",
    },
    ...commonErrorsResponseSchema,
  },
};

const parameterId = {
  parameters: [
    {
      in: "path",
      name: "userId",
      required: true,
      schema: userRequestParamsSchema.properties.userId,
      style: "simple",
    },
  ],
};

export const userPaths = {
  "/user": {
    get: searchUser,
  },
  "/user/{userId}": {
    get: getUser,
    patch: updateUser,
    delete: deleteUser,
    ...parameterId,
  },
};
