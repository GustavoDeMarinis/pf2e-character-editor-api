import {
  authPatchPasswordRequestBodySchema,
  authSignInPostRequestBodySchema,
  authSignInResponseSchema,
  authSignUpPostRequestBodySchema,
  authSignUpResponseSchema,
} from "../../api/auth/auth-api.schema";
import { userRequestParamsSchema } from "../../api/user/user-api.schema";
import { commonErrorsResponseSchema } from "../error.swagger";
import { securitySchema } from "../security.swagger";

export const AuthSignUp = {
  tags: ["Auth"],
  description:
    "## Create a User record\n" +
    "**Postman:** [POST Create a User record](https://lio-data.postman.co/workspace/LIO-IICE~15d79b5b-510b-4c5d-a774-c904574bdd65/request/22262514-c30420d8-43b8-49a6-bac9-c7e3055bae91)",
  operationId: "signUp",
  security: [],
  requestBody: {
    content: {
      "application/json": {
        schema: authSignUpPostRequestBodySchema,
      },
    },
  },
  responses: {
    "201": {
      description: "Successful User Sign Up",
      content: {
        "application/json": {
          schema: authSignUpResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

export const AuthSignIn = {
  tags: ["Auth"],
  description:
    "## SignIn a User\n" +
    "**Postman:** [POST SignIn a User](https://lio-data.postman.co/workspace/LIO-IICE~15d79b5b-510b-4c5d-a774-c904574bdd65/request/22262514-c30420d8-43b8-49a6-bac9-c7e3055bae91)",
  operationId: "signIn",
  security: [],
  requestBody: {
    content: {
      "application/json": {
        schema: authSignInPostRequestBodySchema,
      },
    },
  },
  responses: {
    "201": {
      description: "Successful User Sign In",
      content: {
        "application/json": {
          schema: authSignInResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const updatePassword = {
  tags: ["Auth"],
  description:
    "## Update a User password\n" +
    "**Postman:** [PATCH Update a User password](https://web.postman.co/workspace/My-Workspace~cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-22d3ead8-06ca-4be1-80bf-d588ea9c53cf)",
  operationId: "updatePassword",
  security: [securitySchema],
  requestBody: {
    content: {
      "application/json": {
        schema: authPatchPasswordRequestBodySchema,
      },
    },
  },
  responses: {
    "204": {
      description: "Successful User password update",
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

export const authPaths = {
  "/auth/signIn": {
    post: AuthSignIn,
  },
  "/auth/signUp": {
    post: AuthSignUp,
  },
  "/auth/password/{userId}": {
    patch: updatePassword,
    ...parameterId,
  },
};
