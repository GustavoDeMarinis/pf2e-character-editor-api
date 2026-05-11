import {
  characterFeatCharacterParamsSchema,
  characterFeatGetPostResponseSchema,
  characterFeatListResponseSchema,
  characterFeatParamsSchema,
  characterFeatPostRequestBodySchema,
} from "../../api/character-feat/character-feat-api.schema";
import { commonErrorsResponseSchema } from "../error.swagger";
import { securitySchema } from "../security.swagger";

const listCharacterFeats = {
  tags: ["CharacterFeat"],
  description:
    "## List a character's assigned feats\n" +
    "**Admin + Player (owner-scoped).** Players can only list feats for characters they created or are assigned to.",
  operationId: "listCharacterFeats",
  security: [securitySchema],
  responses: {
    "200": {
      description: "Successful character feat list",
      content: {
        "application/json": {
          schema: characterFeatListResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const assignFeatToCharacter = {
  tags: ["CharacterFeat"],
  description:
    "## Assign a feat to a character\n" +
    "**Admin + Player (owner-scoped).** Players can only assign feats to characters they own.\n\n" +
    "If the same feat was previously assigned and then soft-deleted, the assignment is **reactivated** " +
    "rather than creating a duplicate row. Attempting to assign an already-active feat returns **409**.",
  operationId: "assignFeatToCharacter",
  security: [securitySchema],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: characterFeatPostRequestBodySchema,
      },
    },
  },
  responses: {
    "201": {
      description: "Successful feat assignment",
      content: {
        "application/json": {
          schema: characterFeatGetPostResponseSchema,
        },
      },
    },
    ...commonErrorsResponseSchema,
  },
};

const removeFeatFromCharacter = {
  tags: ["CharacterFeat"],
  description:
    "## Remove a feat assignment from a character\n" +
    "**Admin + Player (owner-scoped).** Soft delete — the underlying `Feat` record is not affected. " +
    "The same feat can be re-assigned later.",
  operationId: "removeFeatFromCharacter",
  security: [securitySchema],
  responses: {
    "204": {
      description: "Successful feat assignment removal",
    },
    ...commonErrorsResponseSchema,
  },
};

const characterIdParameter = {
  in: "path",
  name: "characterId",
  required: true,
  schema: characterFeatCharacterParamsSchema.properties.characterId,
  style: "simple",
};

const characterFeatIdParameter = {
  in: "path",
  name: "characterFeatId",
  required: true,
  schema: characterFeatParamsSchema.properties.characterFeatId,
  style: "simple",
};

export const characterFeatPaths = {
  "/character/{characterId}/feats": {
    get: listCharacterFeats,
    post: assignFeatToCharacter,
    parameters: [characterIdParameter],
  },
  "/character/{characterId}/feats/{characterFeatId}": {
    delete: removeFeatFromCharacter,
    parameters: [characterIdParameter, characterFeatIdParameter],
  },
};
