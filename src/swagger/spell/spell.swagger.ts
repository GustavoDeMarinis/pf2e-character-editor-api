import {
  spellGetPostResponseSchema,
  spellPatchRequestBodySchema,
  spellPostRequestBodySchema,
  spellRequestParamsSchema,
  spellSearchRequestQuerySchema,
  spellSearchResponseSchema,
} from "../../api/spell/spell-api.schema";
import { commonErrorsResponseSchema } from "../error.swagger";
import { securitySchema } from "../security.swagger";

const searchSpell = {
  tags: ["Spell"],
  description:
    "## Search Spells\n" +
    "Filter by tradition, rank (exact / min / max), cantrip flag, focus flag, saving throw, traits, rarity, or active status.\n\n" +
    "Use `search` for a case-insensitive ILIKE match against both `name` and `description`.\n\n" +
    "`isCantrip=true` filters to spells with `rank === 0`; `isCantrip=false` filters to `rank > 0`.\n\n" +
    "Every item in the response includes a derived `isCantrip` boolean (not stored — computed from `rank`).",
  operationId: "searchSpell",
  security: [securitySchema],
  parameters: [
    {
      in: "query",
      name: "search",
      schema: spellSearchRequestQuerySchema.properties.search,
      description: spellSearchRequestQuerySchema.properties.search.description,
    },
    {
      in: "query",
      name: "tradition",
      schema: spellSearchRequestQuerySchema.properties.tradition,
      description: spellSearchRequestQuerySchema.properties.tradition.description,
    },
    {
      in: "query",
      name: "rank",
      schema: spellSearchRequestQuerySchema.properties.rank,
      description: spellSearchRequestQuerySchema.properties.rank.description,
    },
    {
      in: "query",
      name: "minRank",
      schema: spellSearchRequestQuerySchema.properties.minRank,
      description: spellSearchRequestQuerySchema.properties.minRank.description,
    },
    {
      in: "query",
      name: "maxRank",
      schema: spellSearchRequestQuerySchema.properties.maxRank,
      description: spellSearchRequestQuerySchema.properties.maxRank.description,
    },
    {
      in: "query",
      name: "isCantrip",
      schema: spellSearchRequestQuerySchema.properties.isCantrip,
      description: spellSearchRequestQuerySchema.properties.isCantrip.description,
    },
    {
      in: "query",
      name: "isFocus",
      schema: spellSearchRequestQuerySchema.properties.isFocus,
      description: spellSearchRequestQuerySchema.properties.isFocus.description,
    },
    {
      in: "query",
      name: "savingThrow",
      schema: spellSearchRequestQuerySchema.properties.savingThrow,
      description: spellSearchRequestQuerySchema.properties.savingThrow.description,
    },
    {
      in: "query",
      name: "traitIds",
      schema: spellSearchRequestQuerySchema.properties.traitIds,
      description: spellSearchRequestQuerySchema.properties.traitIds.description,
    },
    {
      in: "query",
      name: "rarity",
      schema: spellSearchRequestQuerySchema.properties.rarity,
      description: spellSearchRequestQuerySchema.properties.rarity.description,
    },
    {
      in: "query",
      name: "isActive",
      schema: spellSearchRequestQuerySchema.properties.isActive,
      description: spellSearchRequestQuerySchema.properties.isActive.description,
    },
    {
      in: "query",
      name: "sort",
      schema: spellSearchRequestQuerySchema.properties.sort,
      description: spellSearchRequestQuerySchema.properties.sort.description,
    },
    {
      in: "query",
      name: "pageOffset",
      schema: spellSearchRequestQuerySchema.properties.pageOffset,
      description: spellSearchRequestQuerySchema.properties.pageOffset.description,
    },
    {
      in: "query",
      name: "pageLimit",
      schema: spellSearchRequestQuerySchema.properties.pageLimit,
      description: spellSearchRequestQuerySchema.properties.pageLimit.description,
    },
  ],
  responses: {
    "200": {
      description: "Successful Spell search",
      content: {
        "application/json": {
          schema: spellSearchResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const getSpell = {
  tags: ["Spell"],
  description:
    "## Get Spell by Id\n" +
    "Includes nested `heightenings` and `traits`, plus the derived `isCantrip` field.",
  operationId: "getSpell",
  security: [securitySchema],
  responses: {
    "200": {
      description: "Successful Spell retrieval",
      content: {
        "application/json": {
          schema: spellGetPostResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const insertSpell = {
  tags: ["Spell"],
  description:
    "## Create a Spell\n" +
    "**Admin only.**\n\n" +
    "### Cantrip status\n" +
    "There is no `isCantrip` column. Cantrip status is **derived from `rank === 0`** and appears " +
    "only in responses. The `?isCantrip=` search filter maps to `rank: 0` / `rank: { gt: 0 }`.\n\n" +
    "### Heightenings (XOR rule)\n" +
    "Each heightening row is `{ interval, fixedRank, effect }` with **exactly one** of `interval` / `fixedRank` " +
    "non-null. Violating this returns **400** with `must match exactly one schema in oneOf`.\n\n" +
    "- `interval: N, fixedRank: null` — incremental (\"Heightened (+N)\").\n" +
    "- `interval: null, fixedRank: N` — fixed (\"Heightened (Nth)\").\n\n" +
    "### Other rules\n" +
    "- Spell names are globally unique. Duplicates return **409**.\n" +
    "- Any provided `traitId` that does not exist returns **404**.\n" +
    "- `isFocus: true` is accepted; ISSUE-02.07 adds the focus pool on top.",
  operationId: "insertSpell",
  security: [securitySchema],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: spellPostRequestBodySchema,
      },
    },
  },
  responses: {
    "201": {
      description: "Successful Spell creation",
      content: {
        "application/json": {
          schema: spellGetPostResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const updateSpell = {
  tags: ["Spell"],
  description:
    "## Update a Spell\n" +
    "**Admin only.** At least one field must be provided.\n\n" +
    "When `heightenings` is supplied, the entire heightening set is **replaced wholesale** inside a transaction " +
    "(`deleteMany` + `createMany`). Omit the field to leave heightenings untouched.\n\n" +
    "When `traitIds` is supplied, the trait set is replaced via Prisma `set`. Omit to leave traits untouched.",
  operationId: "updateSpell",
  security: [securitySchema],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: spellPatchRequestBodySchema,
      },
    },
  },
  responses: {
    "204": {
      description: "Successful Spell update",
    },
    ...commonErrorsResponseSchema,
  },
};

const deleteSpell = {
  tags: ["Spell"],
  description:
    "## Delete a Spell\n**Admin only.** Soft delete — the record remains accessible by id.",
  operationId: "deleteSpell",
  security: [securitySchema],
  responses: {
    "204": {
      description: "Successful Spell delete",
    },
    ...commonErrorsResponseSchema,
  },
};

const parameterId = {
  parameters: [
    {
      in: "path",
      name: "spellId",
      required: true,
      schema: spellRequestParamsSchema.properties.spellId,
      style: "simple",
    },
  ],
};

export const spellPaths = {
  "/spell": {
    get: searchSpell,
    post: insertSpell,
  },
  "/spell/{spellId}": {
    get: getSpell,
    patch: updateSpell,
    delete: deleteSpell,
    ...parameterId,
  },
};
