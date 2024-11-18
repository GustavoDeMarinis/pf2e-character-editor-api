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
    "**Postman:** [POST Create a User record](https://web.postman.co/workspace/My-Workspace~cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-90953e40-85ef-43ed-9407-4c9f8742ce6c)",
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
    "**Postman:** [POST SignIn a User](https://web.postman.co/workspace/My-Workspace~cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-5011763f-06a4-43a4-9088-ef978a1a5c95)",
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
export const AuthSignOut = {
  tags: ["Auth"],
  description:
    "## SignOut a User\n" +
    "**Postman:** [POST SignOut a User](https://web.postman.co/workspace/My-Workspace~cb7fd58f-a222-423d-805a-4c564f9d828a/request/16791664-5011763f-06a4-43a4-9088-ef978a1a5c95)",
  operationId: "signOut",
  security: [],
  responses: {
    "201": {
      description: "Successful User Sign Out",
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
  "/auth/signOut": {
    post: AuthSignOut,
  },
  "/auth/password/{userId}": {
    patch: updatePassword,
    ...parameterId,
  },
};
