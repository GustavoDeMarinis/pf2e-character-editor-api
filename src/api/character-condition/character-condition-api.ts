import { Request, Response } from "express";
import { CharacterCondition } from "@prisma/client";
import { validateJSONSchemaObject } from "../../middleware/validators/ajv-validator";
import { ErrorResponse } from "../../utils/shared-types";
import { getCurrentUserAuthorization } from "../../middleware/security/authorization";
import {
  createDeleteResponse,
  createGetArrayResponse,
  createPatchResponse,
  createPostResponse,
} from "../../utils/http-response-factory";
import {
  CharacterConditionResult,
  applyConditionToCharacter,
  listCharacterConditions,
  removeConditionFromCharacter,
  updateCharacterCondition,
} from "./character-condition";
import {
  CharacterConditionCharacterParams,
  CharacterConditionListRequestQuery,
  CharacterConditionListResponse,
  CharacterConditionParams,
  CharacterConditionPatchRequestBody,
  CharacterConditionPostRequestBody,
  CharacterConditionPostResponse,
} from "./character-condition-api.types";
import {
  characterConditionCharacterParamsSchema,
  characterConditionListRequestQuerySchema,
  characterConditionParamsSchema,
  characterConditionPatchRequestBodySchema,
  characterConditionPostRequestBodySchema,
} from "./character-condition-api.schema";

export const handleListCharacterConditions = async (
  req: Request,
  res: Response
): Promise<Response<CharacterConditionListResponse> | Response<ErrorResponse>> => {
  const { characterId } = validateJSONSchemaObject<CharacterConditionCharacterParams>(
    characterConditionCharacterParamsSchema,
    req.params
  );
  const { currentlyActive } = validateJSONSchemaObject<CharacterConditionListRequestQuery>(
    characterConditionListRequestQuerySchema,
    req.query
  );
  const callerAuth = getCurrentUserAuthorization(req);
  const result = await listCharacterConditions(characterId, { currentlyActive }, callerAuth);
  return createGetArrayResponse<CharacterConditionResult>(res, result);
};

export const handleApplyConditionToCharacter = async (
  req: Request,
  res: Response
): Promise<Response<CharacterConditionPostResponse> | Response<ErrorResponse>> => {
  const { characterId } = validateJSONSchemaObject<CharacterConditionCharacterParams>(
    characterConditionCharacterParamsSchema,
    req.params
  );
  const body = validateJSONSchemaObject<CharacterConditionPostRequestBody>(
    characterConditionPostRequestBodySchema,
    req.body
  );
  const callerAuth = getCurrentUserAuthorization(req);
  const result = await applyConditionToCharacter(
    characterId,
    body as Parameters<typeof applyConditionToCharacter>[1],
    callerAuth
  );
  return createPostResponse<CharacterConditionResult>(req, res, result);
};

export const handleUpdateCharacterCondition = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { characterId, characterConditionId } =
    validateJSONSchemaObject<CharacterConditionParams>(
      characterConditionParamsSchema,
      req.params
    );
  const body = validateJSONSchemaObject<CharacterConditionPatchRequestBody>(
    characterConditionPatchRequestBodySchema,
    req.body
  );
  const callerAuth = getCurrentUserAuthorization(req);
  const result = await updateCharacterCondition(
    { characterId, characterConditionId },
    body as Parameters<typeof updateCharacterCondition>[1],
    callerAuth
  );
  return createPatchResponse<CharacterCondition>(res, result);
};

export const handleRemoveConditionFromCharacter = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { characterId, characterConditionId } =
    validateJSONSchemaObject<CharacterConditionParams>(
      characterConditionParamsSchema,
      req.params
    );
  const callerAuth = getCurrentUserAuthorization(req);
  const result = await removeConditionFromCharacter(
    { characterId, characterConditionId },
    callerAuth
  );
  return createDeleteResponse<CharacterCondition>(res, result);
};
