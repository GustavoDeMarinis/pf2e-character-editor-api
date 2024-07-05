export const paginationRequestPropertySchema = {
  pageOffset: {
    description: "Paging offset",
    type: "number",
    default: 0,
  },
  pageLimit: {
    description: "Paging limit",
    type: "number",
    default: 10,
  },
} as const;

export const paginationResponsePropertySchema = {
  pagination: {
    type: "object",
    properties: {
      pageOffset: {
        description: "Paging offset",
        type: "number",
      },
      pageLimit: {
        description: "Paging limit",
        type: "number",
      },
      total: {
        description: "Total of all items",
        type: "number",
      },
    },
    additionalProperties: false,
    required: ["pageOffset", "pageLimit", "total"],
  },
} as const;

export const paginationResponseSchema = {
  type: "object",
  required: ["items", "pagination"],
  additionalProperties: false,
} as const;

export const paginationRequiredPropertiesSchema = {
  required: ["items", "pagination"],
  additionalProperties: false,
} as const;
