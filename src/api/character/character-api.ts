import { Request, Response } from "express";
import {
  CharacterResult,
  deleteCharacter,
  getCharacter,
  insertCharacter,
  searchCharacters,
  updateCharacter,
} from "./character";
import {
  createDeleteResponse,
  createGetArrayResponse,
  createGetResponse,
  createPatchResponse,
  createPostResponse,
} from "../../utils/http-response-factory";
import { getPaginationOptions } from "../../utils/pagination";
import { validateJSONSchemaObject } from "../../middleware/validators/ajv-validator";
import {
  CharacterGetResponse,
  CharacterPatchRequestBody,
  CharacterPostRequestBody,
  CharacterPostResponse,
  CharacterRequestParams,
  CharacterSearchRequestQuery,
  CharacterSearchResponse,
} from "./character-api.types";
import {
  characterPatchRequestBodySchema,
  characterPostRequestBodySchema,
  characterRequestParamsSchema,
  characterSearchRequestQuerySchema,
} from "./character-api.schema";
import { ErrorResponse } from "../../utils/shared-types";
import { Character } from "@prisma/client";

export const handleSearchCharacter = async (
  req: Request,
  res: Response
): Promise<Response<CharacterSearchResponse> | Response<ErrorResponse>> => {
  const { pageOffset, pageLimit, sort, ...query } =
    validateJSONSchemaObject<CharacterSearchRequestQuery>(
      characterSearchRequestQuerySchema,
      req.query
    );

  const pagination = getPaginationOptions({
    pageLimit: pageLimit,
    pageOffset: pageOffset,
  });

  const results = await searchCharacters(query, pagination, sort, req.auth);
  return createGetArrayResponse<CharacterResult>(res, results, {
    pagination,
  });
};

export const handleGetCharacter = async (
  req: Request,
  res: Response
): Promise<Response<CharacterGetResponse> | Response<ErrorResponse>> => {
  const { characterId } = validateJSONSchemaObject<CharacterRequestParams>(
    characterRequestParamsSchema,
    req.params
  );
  const result = await getCharacter({ id: characterId }, req.auth);

  return createGetResponse<CharacterResult>(res, result);
};

export const handlePostCharacter = async (
  req: Request,
  res: Response
): Promise<Response<CharacterPostResponse> | Response<ErrorResponse>> => {
  const body = validateJSONSchemaObject<CharacterPostRequestBody>(
    characterPostRequestBodySchema,
    req.body
  );
  const result = await insertCharacter(body, req.auth);

  return createPostResponse<CharacterResult>(req, res, result);
};

export const handlePatchCharacter = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { characterId } = validateJSONSchemaObject<CharacterRequestParams>(
    characterRequestParamsSchema,
    req.params
  );
  const body = validateJSONSchemaObject<CharacterPatchRequestBody>(
    characterPatchRequestBodySchema,
    req.body
  );
  const result = await updateCharacter({ id: characterId }, body, undefined, req.auth);
  return createPatchResponse<Character>(res, result);
};

export const handleDeleteCharacter = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { characterId } = validateJSONSchemaObject<CharacterRequestParams>(
    characterRequestParamsSchema,
    req.params
  );
  const result = await deleteCharacter({ id: characterId }, req.auth);

  return createDeleteResponse<Character>(res, result);
};
