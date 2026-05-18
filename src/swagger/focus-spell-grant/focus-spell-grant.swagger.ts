import {
  focusSpellGrantGetPostResponseSchema,
  focusSpellGrantPatchRequestBodySchema,
  focusSpellGrantPostRequestBodySchema,
  focusSpellGrantRequestParamsSchema,
  focusSpellGrantSearchRequestQuerySchema,
  focusSpellGrantSearchResponseSchema,
} from "../../api/focus-spell-grant/focus-spell-grant-api.schema";
import { commonErrorsResponseSchema } from "../error.swagger";
import { securitySchema } from "../security.swagger";

const searchFocusSpellGrant = {
  tags: ["FocusSpellGrant"],
  description:
    "## Search Focus-Spell Grants\n" +
    "Filter the grant table by exact `spellId`, `characterClassId`, `domainId`, " +
    "or active status. Each row returns a nested `spell` summary plus a nullable " +
    "`characterClass` / `domain` (exactly one is populated per active grant).",
  operationId: "searchFocusSpellGrants",
  security: [securitySchema],
  parameters: [
    {
      in: "query",
      name: "spellId",
      schema: focusSpellGrantSearchRequestQuerySchema.properties.spellId,
      description:
        focusSpellGrantSearchRequestQuerySchema.properties.spellId.description,
    },
    {
      in: "query",
      name: "characterClassId",
      schema:
        focusSpellGrantSearchRequestQuerySchema.properties.characterClassId,
      description:
        focusSpellGrantSearchRequestQuerySchema.properties.characterClassId
          .description,
    },
    {
      in: "query",
      name: "domainId",
      schema: focusSpellGrantSearchRequestQuerySchema.properties.domainId,
      description:
        focusSpellGrantSearchRequestQuerySchema.properties.domainId.description,
    },
    {
      in: "query",
      name: "isActive",
      schema: focusSpellGrantSearchRequestQuerySchema.properties.isActive,
      description:
        focusSpellGrantSearchRequestQuerySchema.properties.isActive.description,
    },
    {
      in: "query",
      name: "sort",
      schema: focusSpellGrantSearchRequestQuerySchema.properties.sort,
      description:
        focusSpellGrantSearchRequestQuerySchema.properties.sort.description,
    },
    {
      in: "query",
      name: "pageOffset",
      schema: focusSpellGrantSearchRequestQuerySchema.properties.pageOffset,
      description:
        focusSpellGrantSearchRequestQuerySchema.properties.pageOffset
          .description,
    },
    {
      in: "query",
      name: "pageLimit",
      schema: focusSpellGrantSearchRequestQuerySchema.properties.pageLimit,
      description:
        focusSpellGrantSearchRequestQuerySchema.properties.pageLimit.description,
    },
  ],
  responses: {
    "200": {
      description: "Successful FocusSpellGrant search",
      content: {
        "application/json": {
          schema: focusSpellGrantSearchResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const getFocusSpellGrant = {
  tags: ["FocusSpellGrant"],
  description:
    "## Get Focus-Spell Grant by Id\nReturns the grant regardless of soft-delete status.",
  operationId: "getFocusSpellGrant",
  security: [securitySchema],
  responses: {
    "200": {
      description: "Successful FocusSpellGrant retrieval",
      content: {
        "application/json": {
          schema: focusSpellGrantGetPostResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const insertFocusSpellGrant = {
  tags: ["FocusSpellGrant"],
  description:
    "## Create a Focus-Spell Grant\n**Admin only.**\n\n" +
    "**XOR rule:** the body must include **exactly one** of `characterClassId` or " +
    "`domainId` — never both, never neither. Enforced at the request-validation layer " +
    "via `oneOf`; the service re-validates as defence-in-depth.\n\n" +
    "**Spell must be a focus spell.** The referenced `spellId` is loaded and its " +
    "`isFocus` flag is checked; if the spell exists but `isFocus === false`, the request " +
    "is rejected with `400 Spell is not a focus spell`.\n\n" +
    "**FK validation:** missing `spellId`, `characterClassId`, or `domainId` all return " +
    "`404 <Entity> not found` (never 400).\n\n" +
    "**Duplicate detection:** an active grant for the same `(spellId, characterClassId)` " +
    "or `(spellId, domainId)` returns `409`. Soft-deleted matches do not block creation.",
  operationId: "insertFocusSpellGrant",
  security: [securitySchema],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: focusSpellGrantPostRequestBodySchema,
      },
    },
  },
  responses: {
    "201": {
      description: "Successful FocusSpellGrant creation",
      content: {
        "application/json": {
          schema: focusSpellGrantGetPostResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const updateFocusSpellGrant = {
  tags: ["FocusSpellGrant"],
  description:
    "## Update a Focus-Spell Grant\n**Admin only.**\n\n" +
    "All fields are optional; at least one must be supplied. `characterClassId` and " +
    "`domainId` accept `null` so a patch can clear one side and (optionally) set the " +
    "other in the same call — e.g. `{ \"characterClassId\": null, \"domainId\": \"...\" }` " +
    "re-scopes a class-scoped grant to a domain.\n\n" +
    "**XOR is re-validated against the merged row**, not against the patch body alone. " +
    "If the merged result leaves both or neither of `characterClassId`/`domainId` set, " +
    "the request is rejected with " +
    "`400 Exactly one of characterClassId or domainId must be set`.\n\n" +
    "If `spellId` is changed, the new spell must exist and have `isFocus === true` " +
    "(same rules as POST).",
  operationId: "updateFocusSpellGrant",
  security: [securitySchema],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: focusSpellGrantPatchRequestBodySchema,
      },
    },
  },
  responses: {
    "204": {
      description: "Successful FocusSpellGrant update",
    },
    ...commonErrorsResponseSchema,
  },
};

const deleteFocusSpellGrant = {
  tags: ["FocusSpellGrant"],
  description:
    "## Delete a Focus-Spell Grant\n**Admin only.** Soft-delete only — the record " +
    "remains retrievable by id, and a soft-deleted match no longer blocks creation " +
    "of a new grant with the same `(spellId, scope)`.",
  operationId: "deleteFocusSpellGrant",
  security: [securitySchema],
  responses: {
    "204": {
      description: "Successful FocusSpellGrant delete",
    },
    ...commonErrorsResponseSchema,
  },
};

const parameterId = {
  parameters: [
    {
      in: "path",
      name: "focusSpellGrantId",
      required: true,
      schema: focusSpellGrantRequestParamsSchema.properties.focusSpellGrantId,
      style: "simple",
    },
  ],
};

export const focusSpellGrantPaths = {
  "/focus-spell-grant": {
    get: searchFocusSpellGrant,
    post: insertFocusSpellGrant,
  },
  "/focus-spell-grant/{focusSpellGrantId}": {
    get: getFocusSpellGrant,
    patch: updateFocusSpellGrant,
    delete: deleteFocusSpellGrant,
    ...parameterId,
  },
};
