export const errorBodyResponseSchema = {
  type: "object",
  properties: {
    error: {
      type: "object",
      properties: {
        code: {
          type: "integer",
        },
        message: {
          type: "string",
        },
      },
    },
  },
} as const;

export const commonErrorsResponseSchema = {
  400: {
    description: "Unknown client error",
    content: {
      "application/json": {
        schema: errorBodyResponseSchema,
      },
    },
  },
  401: {
    description: "Missing authorization",
    content: {
      "application/json": {
        schema: errorBodyResponseSchema,
      },
    },
  },
  403: {
    description: "Forbidden",
    content: {
      "application/json": {
        schema: errorBodyResponseSchema,
      },
    },
  },
  404: {
    description: "Not Found",
    content: {
      "application/json": {
        schema: errorBodyResponseSchema,
      },
    },
  },
  500: {
    description: "Unknown Error",
    content: {
      "application/json": {
        schema: errorBodyResponseSchema,
      },
    },
  },
};
