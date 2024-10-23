import { Request, Response } from "express";
import { getPaginationOptions } from "../../utils/pagination";
import { ErrorResponse } from "../../utils/shared-types";
import {
  CharacterClassGetResponse,
  CharacterClassPatchRequestBody,
  CharacterClassPostRequestBody,
  CharacterClassPostResponse,
  CharacterClassRequestParams,
  CharacterClassSearchRequestQuery,
  CharacterClassSearchResponse,
} from "./character-class-api.types";
import { validateJSONSchemaObject } from "../../middleware/validators/ajv-validator";
import {
  createDeleteResponse,
  createGetArrayResponse,
  createGetResponse,
  createPatchResponse,
  createPostResponse,
} from "../../utils/http-response-factory";
import {
  CharacterClassResult,
  deleteCharacterClass,
  getCharacterClass,
  insertCharacterClass,
  searchCharactersClass,
  updateCharacterClass,
} from "./character-class";
import {
  characterClassPatchRequestBodySchema,
  characterClassPostRequestBodySchema,
  characterClassRequestParamsSchema,
  characterClassSearchRequestQuerySchema,
} from "./character-class.schema";
import { CharacterClass } from "@prisma/client";

export const handleSearchCharacterClass = async (
  req: Request,
  res: Response
): Promise<
  Response<CharacterClassSearchResponse> | Response<ErrorResponse>
> => {
  const { pageOffset, pageLimit, sort, ...query } =
    validateJSONSchemaObject<CharacterClassSearchRequestQuery>(
      characterClassSearchRequestQuerySchema,
      req.query
    );

  const pagination = getPaginationOptions({
    pageLimit: pageLimit,
    pageOffset: pageOffset,
  });

  const results = await searchCharactersClass(query, pagination, sort);
  return createGetArrayResponse<CharacterClassResult>(res, results, {
    pagination,
  });
};

export const handleGetCharacterClass = async (
  req: Request,
  res: Response
): Promise<Response<CharacterClassGetResponse> | Response<ErrorResponse>> => {
  const { characterClassId } =
    validateJSONSchemaObject<CharacterClassRequestParams>(
      characterClassRequestParamsSchema,
      req.params
    );
  const result = await getCharacterClass({ id: characterClassId });

  return createGetResponse<CharacterClassResult>(res, result);
};

export const handlePostCharacterClass = async (
  req: Request,
  res: Response
): Promise<Response<CharacterClassPostResponse> | Response<ErrorResponse>> => {
  const body = validateJSONSchemaObject<CharacterClassPostRequestBody>(
    characterClassPostRequestBodySchema,
    req.body
  );
  const result = await insertCharacterClass(body);

  return createPostResponse<CharacterClassResult>(req, res, result);
};

export const handlePatchCharacterClass = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { characterClassId } =
    validateJSONSchemaObject<CharacterClassRequestParams>(
      characterClassRequestParamsSchema,
      req.params
    );
  const body = validateJSONSchemaObject<CharacterClassPatchRequestBody>(
    characterClassPatchRequestBodySchema,
    req.body
  );
  const result = await updateCharacterClass({ id: characterClassId }, body);
  return createPatchResponse<CharacterClass>(res, result);
};

export const handleDeleteCharacterClass = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { characterClassId } =
    validateJSONSchemaObject<CharacterClassRequestParams>(
      characterClassRequestParamsSchema,
      req.params
    );
  const result = await deleteCharacterClass({ id: characterClassId });

  return createDeleteResponse<CharacterClass>(res, result);
};
