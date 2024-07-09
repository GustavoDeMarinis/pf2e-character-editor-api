import { Request, Response } from "express";
import {
  CharacterSearchResult,
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

  const results = await searchCharacters(query, pagination, sort);
  return createGetArrayResponse<CharacterSearchResult>(res, results, {
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
  const result = await getCharacter({ id: characterId });

  return createGetResponse<Character>(res, result);
};

export const handlePostCharacter = async (
  req: Request,
  res: Response
): Promise<Response<CharacterPostResponse> | Response<ErrorResponse>> => {
  const body = validateJSONSchemaObject<CharacterPostRequestBody>(
    characterRequestParamsSchema,
    req.body
  );
  const result = await insertCharacter(body);

  return createPostResponse<Character>(req, res, result);
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
  const result = await updateCharacter({ id: characterId }, body);
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
  const result = await deleteCharacter({ id: characterId });

  return createDeleteResponse<Character>(res, result);
};
