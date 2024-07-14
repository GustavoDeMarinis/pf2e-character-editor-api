import { UserRole } from "@prisma/client";

export const userPatchRequestBodySchema = {
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
    role: {
      description: "User Role",
      type: "string",
      enum: Object.values(UserRole),
    },
  },
  additionalProperties: false,
  anyOf: [
    { required: ["userName"] },
    { required: ["userEmail"] },
    { required: ["role"] },
  ],
} as const;

export const userPostPatchResponseSchema = {
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
    role: {
      description: "User Role",
      type: "string",
      enum: Object.values(UserRole),
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
    "role",
  ],
} as const;

export const userRequestParamsSchema = {
  type: "object",
  properties: {
    userId: {
      type: "string",
      description: "character Id",
      checkIdIsCuid: true,
    },
  },
  additionalProperties: false,
  required: ["userId"],
} as const;