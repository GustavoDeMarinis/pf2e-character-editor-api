import {
  ritualGetPostResponseSchema,
  ritualPatchRequestBodySchema,
  ritualPostRequestBodySchema,
  ritualRequestParamsSchema,
  ritualSearchRequestQuerySchema,
  ritualSearchResponseSchema,
} from "../../api/ritual/ritual-api.schema";
import { commonErrorsResponseSchema } from "../error.swagger";
import { securitySchema } from "../security.swagger";

const searchRitual = {
  tags: ["Ritual"],
  description:
    "## Search Rituals\n" +
    "Filter by name/description text, rank range, traits, secondary-check skills, rarity, or active status.\n\n" +
    "The `search` parameter matches against both `name` and `description` (case-insensitive OR).\n" +
    "Use `minRank`/`maxRank` together for a rank range; `rank` for an exact match.",
  operationId: "searchRituals",
  security: [securitySchema],
  parameters: [
    {
      in: "query",
      name: "search",
      schema: ritualSearchRequestQuerySchema.properties.search,
      description: ritualSearchRequestQuerySchema.properties.search.description,
    },
    {
      in: "query",
      name: "rank",
      schema: ritualSearchRequestQuerySchema.properties.rank,
      description: ritualSearchRequestQuerySchema.properties.rank.description,
    },
    {
      in: "query",
      name: "minRank",
      schema: ritualSearchRequestQuerySchema.properties.minRank,
      description: ritualSearchRequestQuerySchema.properties.minRank.description,
    },
    {
      in: "query",
      name: "maxRank",
      schema: ritualSearchRequestQuerySchema.properties.maxRank,
      description: ritualSearchRequestQuerySchema.properties.maxRank.description,
    },
    {
      in: "query",
      name: "traitIds",
      schema: ritualSearchRequestQuerySchema.properties.traitIds,
      description: ritualSearchRequestQuerySchema.properties.traitIds.description,
    },
    {
      in: "query",
      name: "secondaryCheckSkillIds",
      schema: ritualSearchRequestQuerySchema.properties.secondaryCheckSkillIds,
      description:
        ritualSearchRequestQuerySchema.properties.secondaryCheckSkillIds.description,
    },
    {
      in: "query",
      name: "rarity",
      schema: ritualSearchRequestQuerySchema.properties.rarity,
      description: ritualSearchRequestQuerySchema.properties.rarity.description,
    },
    {
      in: "query",
      name: "isActive",
      schema: ritualSearchRequestQuerySchema.properties.isActive,
      description: ritualSearchRequestQuerySchema.properties.isActive.description,
    },
    {
      in: "query",
      name: "sort",
      schema: ritualSearchRequestQuerySchema.properties.sort,
      description: ritualSearchRequestQuerySchema.properties.sort.description,
    },
    {
      in: "query",
      name: "pageOffset",
      schema: ritualSearchRequestQuerySchema.properties.pageOffset,
      description: ritualSearchRequestQuerySchema.properties.pageOffset.description,
    },
    {
      in: "query",
      name: "pageLimit",
      schema: ritualSearchRequestQuerySchema.properties.pageLimit,
      description: ritualSearchRequestQuerySchema.properties.pageLimit.description,
    },
  ],
  responses: {
    "200": {
      description: "Successful Ritual search",
      content: {
        "application/json": {
          schema: ritualSearchResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const getRitual = {
  tags: ["Ritual"],
  description: "## Get Ritual by Id\nReturns the ritual regardless of soft-delete status.",
  operationId: "getRitual",
  security: [securitySchema],
  responses: {
    "200": {
      description: "Successful Ritual retrieval",
      content: {
        "application/json": {
          schema: ritualGetPostResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const insertRitual = {
  tags: ["Ritual"],
  description:
    "## Create a Ritual\n**Admin only.**\n\n" +
    "Heightenings are sent inline as `heightenings: [{ fixedRank, effect }]`. " +
    "Unlike spells, rituals use **fixed-rank only** — there is no `interval`/XOR. " +
    "Each heightening declares the exact rank at which it applies.\n\n" +
    "`traitIds` and `secondaryCheckSkillIds` are FK-validated; a missing id returns 404.",
  operationId: "insertRitual",
  security: [securitySchema],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: ritualPostRequestBodySchema,
      },
    },
  },
  responses: {
    "201": {
      description: "Successful Ritual creation",
      content: {
        "application/json": {
          schema: ritualGetPostResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const updateRitual = {
  tags: ["Ritual"],
  description:
    "## Update a Ritual\n**Admin only.**\n\n" +
    "All fields are optional; at least one must be supplied.\n\n" +
    "**Heightening replacement:** when `heightenings` is present, the existing set is " +
    "hard-deleted and the new set is created atomically inside a `$transaction`. " +
    "Omitting `heightenings` leaves the existing heightenings untouched.\n\n" +
    "`traitIds` and `secondaryCheckSkillIds` replace their respective sets wholesale when provided.",
  operationId: "updateRitual",
  security: [securitySchema],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: ritualPatchRequestBodySchema,
      },
    },
  },
  responses: {
    "204": {
      description: "Successful Ritual update",
    },
    ...commonErrorsResponseSchema,
  },
};

const deleteRitual = {
  tags: ["Ritual"],
  description:
    "## Delete a Ritual\n**Admin only.** Soft-delete only — the record remains retrievable by id.",
  operationId: "deleteRitual",
  security: [securitySchema],
  responses: {
    "204": {
      description: "Successful Ritual delete",
    },
    ...commonErrorsResponseSchema,
  },
};

const parameterId = {
  parameters: [
    {
      in: "path",
      name: "ritualId",
      required: true,
      schema: ritualRequestParamsSchema.properties.ritualId,
      style: "simple",
    },
  ],
};

export const ritualPaths = {
  "/ritual": {
    get: searchRitual,
    post: insertRitual,
  },
  "/ritual/{ritualId}": {
    get: getRitual,
    patch: updateRitual,
    delete: deleteRitual,
    ...parameterId,
  },
};
