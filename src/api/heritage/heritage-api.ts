import { Request, Response } from "express";
import { validateJSONSchemaObject } from "../../middleware/validators/ajv-validator";
import { ErrorResponse } from "../../utils/shared-types";
import { Heritage } from "@prisma/client";
import { getPaginationOptions } from "../../utils/pagination";
import {
  createDeleteResponse,
  createGetArrayResponse,
  createGetResponse,
  createPatchResponse,
  createPostResponse,
} from "../../utils/http-response-factory";
import {
  HeritageResult,
  deleteHeritage,
  getHeritage,
  insertHeritage,
  searchHeritages,
  updateHeritage,
} from "./heritage";
import {
  HeritagePatchRequestBody,
  HeritagePostRequestBody,
  HeritagePostResponse,
  HeritageRequestParams,
  HeritageSearchRequestQuery,
  HeritageSearchResponse,
  HeritageGetResponse,
} from "./heritage-api.types";
import {
  heritagePatchRequestBodySchema,
  heritagePostRequestBodySchema,
  heritageRequestParamsSchema,
  heritageSearchRequestQuerySchema,
} from "./heritage-api.schema";

export const handleSearchHeritage = async (
  req: Request,
  res: Response
): Promise<Response<HeritageSearchResponse> | Response<ErrorResponse>> => {
  const { pageOffset, pageLimit, sort, ...query } =
    validateJSONSchemaObject<HeritageSearchRequestQuery>(
      heritageSearchRequestQuerySchema,
      req.query
    );

  const pagination = getPaginationOptions({
    pageLimit: pageLimit,
    pageOffset: pageOffset,
  });

  const results = await searchHeritages(query, pagination, sort);
  return createGetArrayResponse<HeritageResult>(res, results, { pagination });
};

export const handleGetHeritage = async (
  req: Request,
  res: Response
): Promise<Response<HeritageGetResponse> | Response<ErrorResponse>> => {
  const { heritageId } = validateJSONSchemaObject<HeritageRequestParams>(
    heritageRequestParamsSchema,
    req.params
  );
  const result = await getHeritage({ id: heritageId });

  return createGetResponse<HeritageResult>(res, result);
};

export const handlePostHeritage = async (
  req: Request,
  res: Response
): Promise<Response<HeritagePostResponse> | Response<ErrorResponse>> => {
  const body = validateJSONSchemaObject<HeritagePostRequestBody>(
    heritagePostRequestBodySchema,
    req.body
  );
  const result = await insertHeritage(body);

  return createPostResponse<HeritageResult>(req, res, result);
};

export const handlePatchHeritage = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { heritageId } = validateJSONSchemaObject<HeritageRequestParams>(
    heritageRequestParamsSchema,
    req.params
  );
  const body = validateJSONSchemaObject<HeritagePatchRequestBody>(
    heritagePatchRequestBodySchema,
    req.body
  );
  const result = await updateHeritage({ id: heritageId }, body);
  return createPatchResponse<Heritage>(res, result);
};

export const handleDeleteHeritage = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { heritageId } = validateJSONSchemaObject<HeritageRequestParams>(
    heritageRequestParamsSchema,
    req.params
  );
  const result = await deleteHeritage({ id: heritageId });

  return createDeleteResponse<Heritage>(res, result);
};
