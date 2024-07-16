import { UserRole } from "@prisma/client";

export const authSignUpPostRequestBodySchema = {
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
    role: {
      description: "User Role",
      type: "string",
      enum: Object.values(UserRole),
    },
  },
  additionalProperties: false,
  required: ["userName", "userEmail", "password", "role"],
} as const;

export const authSignInPostRequestBodySchema = {
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
  oneOf: [{ required: ["userName"] }, { required: ["userEmail"] }],
  required: ["password"],
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
  },
  additionalProperties: false,
  required: ["id", "createdAt", "updatedAt", "deletedAt", "userName"],
} as const;

export const authPatchPasswordRequestBodySchema = {
  type: "object",
  properties: {
    currentPassword: {
      description: "User Current Password",
      type: "string",
    },
    newPassword: {
      description: "User New Password",
      type: "string",
    },
  },
  additionalProperties: false,
  required: ["newPassword"],
} as const;
