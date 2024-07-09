export const userPostRequestBodySchema = {
  type: "object",
  properties: {
    userName: {
      description: "User UserName",
      type: "string",
    },
    userEmail: {
      description: "User Email",
      type: "string",
    },
    password: {
      description: "User Password",
      type: "string",
    },
  },
  additionalProperties: false,
  required: ["userName", "userEmail", "password"],
} as const;

export const userPostResponseSchema = {
  type: "object",
  properties: {
    id: {
      description: "User Id",
      type: "string",
    },
    createdAt: {
      type: "string",
      format: "date-time",
    },
    updatedAt: {
      type: "string",
      format: "date-time",
    },
    deletedAt: {
      type: "string",
      format: "date-time-nullable",
    },
    userName: {
      description: "User UserName",
      type: "string",
    },
    userEmail: {
      description: "User Email",
      type: "string",
    },
  },
  additionalProperties: false,
  required: [
    "id",
    "createdAt",
    "updatedAt",
    "deletedAt",
    "userEmail",
    "userName",
  ],
} as const;
