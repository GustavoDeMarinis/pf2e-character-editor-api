import { Request, Response } from "express";
import { Spell } from "@prisma/client";
import { validateJSONSchemaObject } from "../../middleware/validators/ajv-validator";
import { ErrorResponse, ErrorResult, SearchResult } from "../../utils/shared-types";
import { isErrorResult } from "../../utils/exceptions";
import { getPaginationOptions } from "../../utils/pagination";
import {
  createDeleteResponse,
  createGetArrayResponse,
  createGetResponse,
  createPatchResponse,
  createPostResponse,
} from "../../utils/http-response-factory";
import {
  SpellResult,
  deleteSpell,
  getSpell,
  insertSpell,
  searchSpells,
  updateSpell,
  withDerivedIsCantrip,
} from "./spell";
import {
  SpellGetResponse,
  SpellPatchRequestBody,
  SpellPostRequestBody,
  SpellPostResponse,
  SpellRequestParams,
  SpellSearchRequestQuery,
  SpellSearchResponse,
} from "./spell-api.types";
import {
  spellPatchRequestBodySchema,
  spellPostRequestBodySchema,
  spellRequestParamsSchema,
  spellSearchRequestQuerySchema,
} from "./spell-api.schema";

type SpellResponseWithDerived = SpellResult & { isCantrip: boolean };

const decorateSearchResult = (
  result: SearchResult<SpellResult> | ErrorResult
): SearchResult<SpellResponseWithDerived> | ErrorResult => {
  if (isErrorResult(result)) return result;
  return {
    items: result.items.map(withDerivedIsCantrip),
    count: result.count,
  };
};

const decorateSingleResult = (
  result: SpellResult | ErrorResult
): SpellResponseWithDerived | ErrorResult => {
  if (isErrorResult(result)) return result;
  return withDerivedIsCantrip(result);
};

export const handleSearchSpell = async (
  req: Request,
  res: Response
): Promise<Response<SpellSearchResponse> | Response<ErrorResponse>> => {
  const { pageOffset, pageLimit, sort, ...query } =
    validateJSONSchemaObject<SpellSearchRequestQuery>(
      spellSearchRequestQuerySchema,
      req.query
    );

  const pagination = getPaginationOptions({ pageLimit, pageOffset });
  const results = await searchSpells(query, pagination, sort);
  return createGetArrayResponse<SpellResponseWithDerived>(
    res,
    decorateSearchResult(results),
    { pagination }
  );
};

export const handleGetSpell = async (
  req: Request,
  res: Response
): Promise<Response<SpellGetResponse> | Response<ErrorResponse>> => {
  const { spellId } = validateJSONSchemaObject<SpellRequestParams>(
    spellRequestParamsSchema,
    req.params
  );
  const result = await getSpell({ id: spellId });
  return createGetResponse<SpellResponseWithDerived>(res, decorateSingleResult(result));
};

export const handlePostSpell = async (
  req: Request,
  res: Response
): Promise<Response<SpellPostResponse> | Response<ErrorResponse>> => {
  const body = validateJSONSchemaObject<SpellPostRequestBody>(
    spellPostRequestBodySchema,
    req.body
  );
  const result = await insertSpell(body as Parameters<typeof insertSpell>[0]);
  return createPostResponse<SpellResponseWithDerived>(
    req,
    res,
    decorateSingleResult(result)
  );
};

export const handlePatchSpell = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { spellId } = validateJSONSchemaObject<SpellRequestParams>(
    spellRequestParamsSchema,
    req.params
  );
  const body = validateJSONSchemaObject<SpellPatchRequestBody>(
    spellPatchRequestBodySchema,
    req.body
  );
  const result = await updateSpell(
    { id: spellId },
    body as Parameters<typeof updateSpell>[1]
  );
  return createPatchResponse<Spell>(res, result);
};

export const handleDeleteSpell = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { spellId } = validateJSONSchemaObject<SpellRequestParams>(
    spellRequestParamsSchema,
    req.params
  );
  const result = await deleteSpell({ id: spellId });
  return createDeleteResponse<Spell>(res, result);
};
