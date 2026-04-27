import {
  skillGetResponseSchema,
  skillPatchRequestBodySchema,
  skillPostRequestBodySchema,
  skillRequestParamsSchema,
  skillSearchRequestQuerySchema,
  skillSearchResponseSchema,
} from "../../api/skill/skill-api.schema";
import { commonErrorsResponseSchema } from "../error.swagger";
import { securitySchema } from "../security.swagger";

const searchSkill = {
  tags: ["Skill"],
  description: "## Search Skill\nFilter by associatedAttribute or active status.",
  operationId: "searchSkill",
  security: [securitySchema],
  parameters: [
    {
      in: "query",
      name: "pageOffset",
      schema: skillSearchRequestQuerySchema.properties.pageOffset,
      description: skillSearchRequestQuerySchema.properties.pageOffset.description,
    },
    {
      in: "query",
      name: "pageLimit",
      schema: skillSearchRequestQuerySchema.properties.pageLimit,
      description: skillSearchRequestQuerySchema.properties.pageLimit.description,
    },
    {
      in: "query",
      name: "associatedAttribute",
      schema: skillSearchRequestQuerySchema.properties.associatedAttribute,
      description: skillSearchRequestQuerySchema.properties.associatedAttribute.description,
    },
    {
      in: "query",
      name: "isActive",
      schema: skillSearchRequestQuerySchema.properties.isActive,
      description: skillSearchRequestQuerySchema.properties.isActive.description,
    },
    {
      in: "query",
      name: "sort",
      schema: skillSearchRequestQuerySchema.properties.sort,
      description: skillSearchRequestQuerySchema.properties.sort.description,
    },
  ],
  responses: {
    "200": {
      description: "Successful Skill search",
      content: {
        "application/json": {
          schema: skillSearchResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const getSkill = {
  tags: ["Skill"],
  description: "## Get Skill",
  operationId: "getSkill",
  security: [securitySchema],
  responses: {
    "200": {
      description: "Successful Skill retrieval",
      content: {
        "application/json": {
          schema: skillGetResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const insertSkill = {
  tags: ["Skill"],
  description: "## Create a Skill record\n**Admin + Player.**",
  operationId: "insertSkill",
  security: [securitySchema],
  requestBody: {
    content: {
      "application/json": {
        schema: skillPostRequestBodySchema,
      },
    },
  },
  responses: {
    "201": {
      description: "Successful Skill creation",
      content: {
        "application/json": {
          schema: skillGetResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const updateSkill = {
  tags: ["Skill"],
  description: "## Update a Skill record\n**Admin + Player.**",
  operationId: "updateSkill",
  security: [securitySchema],
  requestBody: {
    content: {
      "application/json": {
        schema: skillPatchRequestBodySchema,
      },
    },
  },
  responses: {
    "204": {
      description: "Successful Skill update",
    },
    ...commonErrorsResponseSchema,
  },
};

const deleteSkill = {
  tags: ["Skill"],
  description: "## Delete a Skill record\n**Admin + Player.** Soft delete.",
  operationId: "deleteSkill",
  security: [securitySchema],
  responses: {
    "204": {
      description: "Successful Skill delete",
    },
    ...commonErrorsResponseSchema,
  },
};

const parameterId = {
  parameters: [
    {
      in: "path",
      name: "skillId",
      required: true,
      schema: skillRequestParamsSchema.properties.skillId,
      style: "simple",
    },
  ],
};

export const skillPaths = {
  "/skill": {
    get: searchSkill,
    post: insertSkill,
  },
  "/skill/{skillId}": {
    get: getSkill,
    patch: updateSkill,
    delete: deleteSkill,
    ...parameterId,
  },
};
