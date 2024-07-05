import { Request, Response } from "express";
import {
  CharacterSearchResult,
  deleteCharacter,
  getCharacter,
  insertCharacter,
  searchCharacters,
  updateCharacter,
} from "./character";
import { StatusCodes } from "http-status-codes";
import { createGetArrayResponse } from "../../utils/http-response-factory";
import { getPaginationOptions } from "../../utils/pagination";
import { validateJSONSchemaObject } from "../../middleware/validators/ajv-validator";
import {
  CharacterSearchRequestQuery,
  CharacterSearchResponse,
} from "./character-api.types";
import { characterSearchRequestQuerySchema } from "./character-api.schema";
import { ErrorResponse } from "../../utils/shared-types";

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

export const handleGetCharacter = async (req: Request, res: Response) => {
  const { characterId } = req.params;
  const result = await getCharacter({ id: characterId });

  return res.status(StatusCodes.OK).json(result);
};

export const handlePostCharacter = async (req: Request, res: Response) => {
  const body = req.body;
  const result = await insertCharacter(body);

  return res.status(StatusCodes.OK).json(result);
};

export const handlePatchCharacter = async (req: Request, res: Response) => {
  const { characterId } = req.params;
  const body = req.body;
  const result = await updateCharacter({ id: characterId }, body);
  return res.status(StatusCodes.OK).json(result);
};

export const handleDeleteCharacter = async (req: Request, res: Response) => {
  const { characterId } = req.params;
  const result = await deleteCharacter({ id: characterId });

  return res.status(StatusCodes.OK).json(result);
};
