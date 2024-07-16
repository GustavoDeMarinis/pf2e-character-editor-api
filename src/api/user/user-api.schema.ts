import { UserRole } from "@prisma/client";
import {
  paginationRequestPropertySchema,
  paginationRequiredPropertiesSchema,
  paginationResponsePropertySchema,
} from "../../utils/pagination.types";

export const userSearchRequestQueryParamsSchema = {
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
    isActive: {
      type: "boolean",
      description: "Is The User Active?",
    },
    sort: {
      type: "string",
      description: "Columns To Build Prisma OrderBy Clause",
    },
    ...paginationRequestPropertySchema,
  },
  additionalProperties: false,
} as const;

export const commonGetSearchUserProperties = {
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
  userEmail: {
    description: "User Email",
    type: "string",
  },
  userName: {
    description: "User Name",
    type: "string",
  },
  role: {
    description: "User Role",
    type: "string",
    enum: Object.values(UserRole),
  },
} as const;

export const userSearchResponseSchema = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          ...commonGetSearchUserProperties,
        },
        required: [
          "id",
          "createdAt",
          "updatedAt",
          "deletedAt",
          "userEmail",
          "userName",
          "role",
        ],
        additionalProperties: false,
      },
    },
    ...paginationResponsePropertySchema,
  },
  ...paginationRequiredPropertiesSchema,
} as const;

export const userGetResponseSchema = {
  type: "object",
  properties: {
    ...commonGetSearchUserProperties,
  },
  required: [
    "id",
    "createdAt",
    "updatedAt",
    "deletedAt",
    "userEmail",
    "userName",
    "role",
  ],
  additionalProperties: false,
} as const;

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
