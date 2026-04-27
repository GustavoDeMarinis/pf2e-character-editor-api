import {
  backgroundGetPostResponseSchema,
  backgroundPatchRequestBodySchema,
  backgroundPostRequestBodySchema,
  backgroundRequestParamsSchema,
  backgroundSearchRequestQuerySchema,
  backgroundSearchResponseSchema,
} from "../../api/background/background-api.schema";
import { commonErrorsResponseSchema } from "../error.swagger";
import { securitySchema } from "../security.swagger";

const searchBackground = {
  tags: ["Background"],
  description:
    "## Search Background\nFilter by name, rarity, trainedSkillId, or active status.\n\n" +
    "> **Scope note:** Multi-skill and ancestry-restricted backgrounds are deferred to ISSUE-02.22; " +
    "current scope is global, single-skill backgrounds only.",
  operationId: "searchBackground",
  security: [securitySchema],
  parameters: [
    {
      in: "query",
      name: "pageOffset",
      schema: backgroundSearchRequestQuerySchema.properties.pageOffset,
      description: backgroundSearchRequestQuerySchema.properties.pageOffset.description,
    },
    {
      in: "query",
      name: "pageLimit",
      schema: backgroundSearchRequestQuerySchema.properties.pageLimit,
      description: backgroundSearchRequestQuerySchema.properties.pageLimit.description,
    },
    {
      in: "query",
      name: "name",
      schema: backgroundSearchRequestQuerySchema.properties.name,
      description: backgroundSearchRequestQuerySchema.properties.name.description,
    },
    {
      in: "query",
      name: "rarity",
      schema: backgroundSearchRequestQuerySchema.properties.rarity,
      description: backgroundSearchRequestQuerySchema.properties.rarity.description,
    },
    {
      in: "query",
      name: "trainedSkillId",
      schema: backgroundSearchRequestQuerySchema.properties.trainedSkillId,
      description: backgroundSearchRequestQuerySchema.properties.trainedSkillId.description,
    },
    {
      in: "query",
      name: "isActive",
      schema: backgroundSearchRequestQuerySchema.properties.isActive,
      description: backgroundSearchRequestQuerySchema.properties.isActive.description,
    },
    {
      in: "query",
      name: "sort",
      schema: backgroundSearchRequestQuerySchema.properties.sort,
      description: backgroundSearchRequestQuerySchema.properties.sort.description,
    },
  ],
  responses: {
    "200": {
      description: "Successful Background search",
      content: {
        "application/json": {
          schema: backgroundSearchResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const getBackground = {
  tags: ["Background"],
  description: "## Get Background",
  operationId: "getBackground",
  security: [securitySchema],
  responses: {
    "200": {
      description: "Successful Background retrieval",
      content: {
        "application/json": {
          schema: backgroundGetPostResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const insertBackground = {
  tags: ["Background"],
  description:
    "## Create a Background record\n**Admin only.**\n\n" +
    "> **Note:** `grantedSkillFeatId` will be added in ISSUE-02.04 when the Feat model lands.",
  operationId: "insertBackground",
  security: [securitySchema],
  requestBody: {
    content: {
      "application/json": {
        schema: backgroundPostRequestBodySchema,
      },
    },
  },
  responses: {
    "201": {
      description: "Successful Background creation",
      content: {
        "application/json": {
          schema: backgroundGetPostResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const updateBackground = {
  tags: ["Background"],
  description: "## Update a Background record\n**Admin only.**",
  operationId: "updateBackground",
  security: [securitySchema],
  requestBody: {
    content: {
      "application/json": {
        schema: backgroundPatchRequestBodySchema,
      },
    },
  },
  responses: {
    "204": {
      description: "Successful Background update",
    },
    ...commonErrorsResponseSchema,
  },
};

const deleteBackground = {
  tags: ["Background"],
  description: "## Delete a Background record\n**Admin only.** Soft delete.",
  operationId: "deleteBackground",
  security: [securitySchema],
  responses: {
    "204": {
      description: "Successful Background delete",
    },
    ...commonErrorsResponseSchema,
  },
};

const parameterId = {
  parameters: [
    {
      in: "path",
      name: "backgroundId",
      required: true,
      schema: backgroundRequestParamsSchema.properties.backgroundId,
      style: "simple",
    },
  ],
};

export const backgroundPaths = {
  "/background": {
    get: searchBackground,
    post: insertBackground,
  },
  "/background/{backgroundId}": {
    get: getBackground,
    patch: updateBackground,
    delete: deleteBackground,
    ...parameterId,
  },
};
