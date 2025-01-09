import { Request, Response } from "express";
import { ErrorResponse } from "../../utils/shared-types";
import { getPaginationOptions } from "../../utils/pagination";
import {
  createDeleteResponse,
  createGetArrayResponse,
  createGetResponse,
  createPatchResponse,
  createPostResponse,
} from "../../utils/http-response-factory";
import {
  AncestryGetResponse,
  AncestryPatchRequestBody,
  AncestryPostRequestBody,
  AncestryPostResponse,
  AncestryRequestParams,
  AncestrySearchRequestQuery,
  AncestrySearchResponse,
} from "./ancestry-api.types";
import { validateJSONSchemaObject } from "../../middleware/validators/ajv-validator";
import {
  ancestryPatchRequestBodySchema,
  ancestryPostRequestBodySchema,
  ancestryRequestParamsSchema,
  ancestrySearchRequestQuerySchema,
} from "./ancestry-api.schema";
import {
  AncestryResult,
  deleteAncestry,
  getAncestry,
  insertAncestry,
  searchAncestries,
  updateAncestry,
} from "./ancestry";
import { Ancestry } from "@prisma/client";

export const handleSearchAncestry = async (
  req: Request,
  res: Response
): Promise<Response<AncestrySearchResponse> | Response<ErrorResponse>> => {
  const { pageOffset, pageLimit, sort, ...query } =
    validateJSONSchemaObject<AncestrySearchRequestQuery>(
      ancestrySearchRequestQuerySchema,
      req.query
    );

  const pagination = getPaginationOptions({
    pageLimit: pageLimit,
    pageOffset: pageOffset,
  });

  const results = await searchAncestries(query, pagination, sort);
  return createGetArrayResponse<AncestryResult>(res, results, {
    pagination,
  });
};

export const handleGetAncestry = async (
  req: Request,
  res: Response
): Promise<Response<AncestryGetResponse> | Response<ErrorResponse>> => {
  const { ancestryId } = validateJSONSchemaObject<AncestryRequestParams>(
    ancestryRequestParamsSchema,
    req.params
  );

  const result = await getAncestry({ id: ancestryId });

  return createGetResponse<AncestryResult>(res, result);
};

export const handlePostAncestry = async (
  req: Request,
  res: Response
): Promise<Response<AncestryPostResponse> | Response<ErrorResponse>> => {
  const body = validateJSONSchemaObject<AncestryPostRequestBody>(
    ancestryPostRequestBodySchema,
    req.body
  );
  const result = await insertAncestry(body);

  return createPostResponse<AncestryResult>(req, res, result);
};

export const handlePatchAncestry = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { ancestryId } = validateJSONSchemaObject<AncestryRequestParams>(
    ancestryRequestParamsSchema,
    req.params
  );
  const body = validateJSONSchemaObject<AncestryPatchRequestBody>(
    ancestryPatchRequestBodySchema,
    req.body
  );

  const result = await updateAncestry({ id: ancestryId }, body);
  return createPatchResponse<Ancestry>(res, result);
};

export const handleDeleteAncestry = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { ancestryId } = validateJSONSchemaObject<AncestryRequestParams>(
    ancestryRequestParamsSchema,
    req.params
  );
  const result = await deleteAncestry({ id: ancestryId });

  return createDeleteResponse<Ancestry>(res, result);
};
