import { Request, Response } from "express";
import { CharacterSpell } from "@prisma/client";
import { validateJSONSchemaObject } from "../../middleware/validators/ajv-validator";
import { ErrorResponse } from "../../utils/shared-types";
import {
  createDeleteResponse,
  createGetArrayResponse,
  createPostResponse,
} from "../../utils/http-response-factory";
import { getCurrentUserAuthorization } from "../../middleware/security/authorization";
import {
  CharacterSpellResult,
  assignSpellToCharacter,
  listCharacterSpells,
  removeSpellFromCharacter,
} from "./character-spell";
import {
  CharacterSpellCharacterParams,
  CharacterSpellListResponse,
  CharacterSpellParams,
  CharacterSpellPostRequestBody,
  CharacterSpellPostResponse,
} from "./character-spell-api.types";
import {
  characterSpellCharacterParamsSchema,
  characterSpellParamsSchema,
  characterSpellPostRequestBodySchema,
} from "./character-spell-api.schema";

export const handleListCharacterSpells = async (
  req: Request,
  res: Response
): Promise<Response<CharacterSpellListResponse> | Response<ErrorResponse>> => {
  const { characterId } = validateJSONSchemaObject<CharacterSpellCharacterParams>(
    characterSpellCharacterParamsSchema,
    req.params
  );
  const callerAuth = getCurrentUserAuthorization(req);
  const result = await listCharacterSpells(characterId, callerAuth);
  return createGetArrayResponse<CharacterSpellResult>(res, result);
};

export const handleAssignSpellToCharacter = async (
  req: Request,
  res: Response
): Promise<Response<CharacterSpellPostResponse> | Response<ErrorResponse>> => {
  const { characterId } = validateJSONSchemaObject<CharacterSpellCharacterParams>(
    characterSpellCharacterParamsSchema,
    req.params
  );
  const body = validateJSONSchemaObject<CharacterSpellPostRequestBody>(
    characterSpellPostRequestBodySchema,
    req.body
  );
  const callerAuth = getCurrentUserAuthorization(req);
  const result = await assignSpellToCharacter(
    characterId,
    body as Parameters<typeof assignSpellToCharacter>[1],
    callerAuth
  );
  return createPostResponse<CharacterSpellResult>(req, res, result);
};

export const handleRemoveSpellFromCharacter = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { characterId, characterSpellId } = validateJSONSchemaObject<CharacterSpellParams>(
    characterSpellParamsSchema,
    req.params
  );
  const callerAuth = getCurrentUserAuthorization(req);
  const result = await removeSpellFromCharacter({ characterId, characterSpellId }, callerAuth);
  return createDeleteResponse<CharacterSpell>(res, result);
};
