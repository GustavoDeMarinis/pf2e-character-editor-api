import {
  featGetPostResponseSchema,
  featPatchRequestBodySchema,
  featPostRequestBodySchema,
  featRequestParamsSchema,
  featSearchRequestQuerySchema,
  featSearchResponseSchema,
} from "../../api/feat/feat-api.schema";
import { commonErrorsResponseSchema } from "../error.swagger";
import { securitySchema } from "../security.swagger";

const searchFeat = {
  tags: ["Feat"],
  description:
    "## Search Feats\n" +
    "Filter by type, level, parent FK (ancestryId / characterClassId / skillId), rarity, or active status.\n\n" +
    "Use `search` for a case-insensitive ILIKE match against both `name` and `description`.\n\n" +
    "Use `maxLevel` to return all feats up to a given level; combine with `featType` for class-feat progression lists.",
  operationId: "searchFeat",
  security: [securitySchema],
  parameters: [
    {
      in: "query",
      name: "search",
      schema: featSearchRequestQuerySchema.properties.search,
      description: featSearchRequestQuerySchema.properties.search.description,
    },
    {
      in: "query",
      name: "featType",
      schema: featSearchRequestQuerySchema.properties.featType,
      description: featSearchRequestQuerySchema.properties.featType.description,
    },
    {
      in: "query",
      name: "level",
      schema: featSearchRequestQuerySchema.properties.level,
      description: featSearchRequestQuerySchema.properties.level.description,
    },
    {
      in: "query",
      name: "maxLevel",
      schema: featSearchRequestQuerySchema.properties.maxLevel,
      description: featSearchRequestQuerySchema.properties.maxLevel.description,
    },
    {
      in: "query",
      name: "ancestryId",
      schema: featSearchRequestQuerySchema.properties.ancestryId,
      description: featSearchRequestQuerySchema.properties.ancestryId.description,
    },
    {
      in: "query",
      name: "characterClassId",
      schema: featSearchRequestQuerySchema.properties.characterClassId,
      description:
        featSearchRequestQuerySchema.properties.characterClassId.description,
    },
    {
      in: "query",
      name: "skillId",
      schema: featSearchRequestQuerySchema.properties.skillId,
      description: featSearchRequestQuerySchema.properties.skillId.description,
    },
    {
      in: "query",
      name: "rarity",
      schema: featSearchRequestQuerySchema.properties.rarity,
      description: featSearchRequestQuerySchema.properties.rarity.description,
    },
    {
      in: "query",
      name: "isActive",
      schema: featSearchRequestQuerySchema.properties.isActive,
      description: featSearchRequestQuerySchema.properties.isActive.description,
    },
    {
      in: "query",
      name: "sort",
      schema: featSearchRequestQuerySchema.properties.sort,
      description: featSearchRequestQuerySchema.properties.sort.description,
    },
    {
      in: "query",
      name: "pageOffset",
      schema: featSearchRequestQuerySchema.properties.pageOffset,
      description: featSearchRequestQuerySchema.properties.pageOffset.description,
    },
    {
      in: "query",
      name: "pageLimit",
      schema: featSearchRequestQuerySchema.properties.pageLimit,
      description: featSearchRequestQuerySchema.properties.pageLimit.description,
    },
  ],
  responses: {
    "200": {
      description: "Successful Feat search",
      content: {
        "application/json": {
          schema: featSearchResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const getFeat = {
  tags: ["Feat"],
  description: "## Get Feat by Id",
  operationId: "getFeat",
  security: [securitySchema],
  responses: {
    "200": {
      description: "Successful Feat retrieval",
      content: {
        "application/json": {
          schema: featGetPostResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const insertFeat = {
  tags: ["Feat"],
  description:
    "## Create a Feat\n" +
    "**Admin only.**\n\n" +
    "### Typed-FK rule (enforced by AJV `oneOf`)\n\n" +
    "Exactly one typed FK must be supplied based on `featType`:\n\n" +
    "| featType | Required field | Forbidden fields |\n" +
    "|---|---|---|\n" +
    "| `Ancestry` | `ancestryId` | `characterClassId`, `skillId` |\n" +
    "| `Class` | `characterClassId` | `ancestryId`, `skillId` |\n" +
    "| `Skill` | `skillId` | `ancestryId`, `characterClassId` |\n" +
    "| `General` | _(none)_ | `ancestryId`, `characterClassId`, `skillId` |\n" +
    "| `Bonus` | _(none)_ | `ancestryId`, `characterClassId`, `skillId` |\n\n" +
    "Violating this rule returns **400** with message `must match exactly one schema in oneOf`.\n\n" +
    "> **Archetype feats are not yet supported.** Sending `featType: Archetype` returns **400**. " +
    "Support will be added after ISSUE-02.13 (Archetype) ships.",
  operationId: "insertFeat",
  security: [securitySchema],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: featPostRequestBodySchema,
      },
    },
  },
  responses: {
    "201": {
      description: "Successful Feat creation",
      content: {
        "application/json": {
          schema: featGetPostResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const updateFeat = {
  tags: ["Feat"],
  description: "## Update a Feat\n**Admin only.** At least one field must be provided.",
  operationId: "updateFeat",
  security: [securitySchema],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: featPatchRequestBodySchema,
      },
    },
  },
  responses: {
    "204": {
      description: "Successful Feat update",
    },
    ...commonErrorsResponseSchema,
  },
};

const deleteFeat = {
  tags: ["Feat"],
  description: "## Delete a Feat\n**Admin only.** Soft delete — the record remains accessible by id.",
  operationId: "deleteFeat",
  security: [securitySchema],
  responses: {
    "204": {
      description: "Successful Feat delete",
    },
    ...commonErrorsResponseSchema,
  },
};

const parameterId = {
  parameters: [
    {
      in: "path",
      name: "featId",
      required: true,
      schema: featRequestParamsSchema.properties.featId,
      style: "simple",
    },
  ],
};

export const featPaths = {
  "/feat": {
    get: searchFeat,
    post: insertFeat,
  },
  "/feat/{featId}": {
    get: getFeat,
    patch: updateFeat,
    delete: deleteFeat,
    ...parameterId,
  },
};
