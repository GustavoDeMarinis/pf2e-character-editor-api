import {
  characterSpellCharacterParamsSchema,
  characterSpellGetPostResponseSchema,
  characterSpellListResponseSchema,
  characterSpellParamsSchema,
  characterSpellPostRequestBodySchema,
} from "../../api/character-spell/character-spell-api.schema";
import { commonErrorsResponseSchema } from "../error.swagger";
import { securitySchema } from "../security.swagger";

const listCharacterSpells = {
  tags: ["CharacterSpell"],
  description:
    "## List a character's known/prepared spells\n" +
    "**Admin + Player (owner-scoped).** Players can only list spells for characters they created or are assigned to.",
  operationId: "listCharacterSpells",
  security: [securitySchema],
  responses: {
    "200": {
      description: "Successful character spell list",
      content: {
        "application/json": {
          schema: characterSpellListResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const assignSpellToCharacter = {
  tags: ["CharacterSpell"],
  description:
    "## Assign a spell to a character\n" +
    "**Admin + Player (owner-scoped).** Players can only assign spells to characters they own.\n\n" +
    "Duplicate detection is keyed on `(characterId, spellId, preparedAtRank)`. The same spell can be " +
    "assigned multiple times at **different** `preparedAtRank` values (heightened preparations).\n\n" +
    "If a matching assignment was previously soft-deleted, it is **reactivated** instead of creating a duplicate row.",
  operationId: "assignSpellToCharacter",
  security: [securitySchema],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: characterSpellPostRequestBodySchema,
      },
    },
  },
  responses: {
    "201": {
      description: "Successful spell assignment",
      content: {
        "application/json": {
          schema: characterSpellGetPostResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const removeSpellFromCharacter = {
  tags: ["CharacterSpell"],
  description:
    "## Remove a spell assignment from a character\n" +
    "**Admin + Player (owner-scoped).** Soft delete — the underlying `Spell` record is not affected. " +
    "The same spell can be re-assigned later.",
  operationId: "removeSpellFromCharacter",
  security: [securitySchema],
  responses: {
    "204": {
      description: "Successful spell assignment removal",
    },
    ...commonErrorsResponseSchema,
  },
};

const characterIdParameter = {
  in: "path",
  name: "characterId",
  required: true,
  schema: characterSpellCharacterParamsSchema.properties.characterId,
  style: "simple",
};

const characterSpellIdParameter = {
  in: "path",
  name: "characterSpellId",
  required: true,
  schema: characterSpellParamsSchema.properties.characterSpellId,
  style: "simple",
};

export const characterSpellPaths = {
  "/character/{characterId}/spells": {
    get: listCharacterSpells,
    post: assignSpellToCharacter,
    parameters: [characterIdParameter],
  },
  "/character/{characterId}/spells/{characterSpellId}": {
    delete: removeSpellFromCharacter,
    parameters: [characterIdParameter, characterSpellIdParameter],
  },
};
