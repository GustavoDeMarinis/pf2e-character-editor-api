import { Request, Response } from "express";
import { validateJSONSchemaObject } from "../../middleware/validators/ajv-validator";
import { ErrorResponse } from "../../utils/shared-types";
import { CharacterFeat } from "@prisma/client";
import {
  createDeleteResponse,
  createGetArrayResponse,
  createPostResponse,
} from "../../utils/http-response-factory";
import { getCurrentUserAuthorization } from "../../middleware/security/authorization";
import {
  CharacterFeatResult,
  assignFeatToCharacter,
  listCharacterFeats,
  removeFeatFromCharacter,
} from "./character-feat";
import {
  CharacterFeatCharacterParams,
  CharacterFeatListResponse,
  CharacterFeatParams,
  CharacterFeatPostRequestBody,
  CharacterFeatPostResponse,
} from "./character-feat-api.types";
import {
  characterFeatCharacterParamsSchema,
  characterFeatParamsSchema,
  characterFeatPostRequestBodySchema,
} from "./character-feat-api.schema";

export const handleListCharacterFeats = async (
  req: Request,
  res: Response
): Promise<Response<CharacterFeatListResponse> | Response<ErrorResponse>> => {
  const { characterId } = validateJSONSchemaObject<CharacterFeatCharacterParams>(
    characterFeatCharacterParamsSchema,
    req.params
  );
  const callerAuth = getCurrentUserAuthorization(req);
  const result = await listCharacterFeats(characterId, callerAuth);
  return createGetArrayResponse<CharacterFeatResult>(res, result);
};

export const handleAssignFeatToCharacter = async (
  req: Request,
  res: Response
): Promise<Response<CharacterFeatPostResponse> | Response<ErrorResponse>> => {
  const { characterId } = validateJSONSchemaObject<CharacterFeatCharacterParams>(
    characterFeatCharacterParamsSchema,
    req.params
  );
  const body = validateJSONSchemaObject<CharacterFeatPostRequestBody>(
    characterFeatPostRequestBodySchema,
    req.body
  );
  const callerAuth = getCurrentUserAuthorization(req);
  const result = await assignFeatToCharacter(
    characterId,
    body as Parameters<typeof assignFeatToCharacter>[1],
    callerAuth
  );
  return createPostResponse<CharacterFeatResult>(req, res, result);
};

export const handleRemoveFeatFromCharacter = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { characterId, characterFeatId } = validateJSONSchemaObject<CharacterFeatParams>(
    characterFeatParamsSchema,
    req.params
  );
  const callerAuth = getCurrentUserAuthorization(req);
  const result = await removeFeatFromCharacter({ characterId, characterFeatId }, callerAuth);
  return createDeleteResponse<CharacterFeat>(res, result);
};
