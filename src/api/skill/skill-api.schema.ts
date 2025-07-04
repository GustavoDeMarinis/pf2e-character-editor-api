import { Attribute } from "@prisma/client";
import {
  paginationRequestPropertySchema,
  paginationRequiredPropertiesSchema,
  paginationResponsePropertySchema,
} from "../../utils/pagination.types";

export const skillSearchRequestQuerySchema = {
  type: "object",
  properties: {
    associatedAttribute: {
      description: "Associated Attribute",
      type: "string",
      enum: Object.values(Attribute),
    },
    isActive: {
      type: "boolean",
      description: "Is The Skill Active?",
    },
    sort: {
      type: "string",
      description: "Columns To Build Prisma OrderBy Clause",
    },
    ...paginationRequestPropertySchema,
  },
  additionalProperties: false,
} as const;

const commonSkillProperties = {
  name: {
    description: "Skill Name",
    type: "string",
  },
  description: {
    description: "Skill Description",
    type: "string",
  },
  associatedAttribute: {
    description: "Associated Attribute",
    type: "string",
    enum: Object.values(Attribute),
  },
  actions: {
    description: "Actions Associated With Skill",
    type: "array",
    items: {
      type: "object",
      properties: {
        name: {
          description: "Action Name",
          type: "string",
        },
        description: {
          description: "Action Description",
          type: "string",
        },
        traits: {
          description: "Action Traits",
          type: "array",
          items: {
            type: "object",
            properties: {
              name: {
                description: "Trait Name",
                type: "string",
              },
            },
            required: ["name"],
            additionalProperties: false,
          },
        },
      },
      required: ["name", "description", "traits"],
      additionalProperties: false,
    },
  },
} as const;

export const skillSearchResponseSchema = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: {
            description: "Character Id",
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
          ...commonSkillProperties,
        },
        required: [
          "id",
          "createdAt",
          "updatedAt",
          "deletedAt",
          "name",
          "description",
          "associatedAttribute",
          "actions",
        ],
        additionalProperties: false,
      },
    },
    ...paginationResponsePropertySchema,
  },
  ...paginationRequiredPropertiesSchema,
} as const;

export const skillGetResponseSchema = {
  type: "object",
  properties: {
    result: {
      type: "object",
      properties: {
        id: {
          description: "Character Id",
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
        ...commonSkillProperties,
      },
      required: [
        "id",
        "createdAt",
        "updatedAt",
        "deletedAt",
        "name",
        "description",
        "associatedAttribute",
        "actions",
      ],
      additionalProperties: false,
    },
  },
} as const;

export const skillRequestParamsSchema = {
  type: "object",
  properties: {
    skillId: {
      description: "Skill Id",
      type: "string",
    },
  },
  required: ["skillId"],
  additionalProperties: false,
} as const;

export const skillPostRequestBodySchema = {
  type: "object",
  properties: {
    ...commonSkillProperties,
  },
  required: ["name", "description", "associatedAttribute", "actions"],
  additionalProperties: false,
} as const;

export const skillPostResponseSchema = {
  type: "object",
  properties: {
    result: {
      type: "object",
      properties: {
        id: {
          description: "Character Id",
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
        ...commonSkillProperties,
      },
      required: [
        "id",
        "createdAt",
        "updatedAt",
        "deletedAt",
        "name",
        "description",
        "associatedAttribute",
        "actions",
      ],
      additionalProperties: false,
    },
  },
} as const;

export const skillPatchRequestBodySchema = {
  type: "object",
  properties: {
    ...commonSkillProperties,
  },
  additionalProperties: false,
} as const;
