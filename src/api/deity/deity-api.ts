import { Request, Response } from "express";
import { validateJSONSchemaObject } from "../../middleware/validators/ajv-validator";
import { ErrorResponse } from "../../utils/shared-types";
import { Deity } from "@prisma/client";
import { getPaginationOptions } from "../../utils/pagination";
import {
  createDeleteResponse,
  createGetArrayResponse,
  createGetResponse,
  createPatchResponse,
  createPostResponse,
} from "../../utils/http-response-factory";
import {
  DeityResult,
  deleteDeity,
  getDeity,
  insertDeity,
  searchDeities,
  updateDeity,
} from "./deity";
import {
  DeityPatchRequestBody,
  DeityPostRequestBody,
  DeityPostResponse,
  DeityRequestParams,
  DeitySearchRequestQuery,
  DeitySearchResponse,
  DeityGetResponse,
} from "./deity-api.types";
import {
  deityPatchRequestBodySchema,
  deityPostRequestBodySchema,
  deityRequestParamsSchema,
  deitySearchRequestQuerySchema,
} from "./deity-api.schema";

export const handleSearchDeity = async (
  req: Request,
  res: Response
): Promise<Response<DeitySearchResponse> | Response<ErrorResponse>> => {
  const { pageOffset, pageLimit, sort, ...query } =
    validateJSONSchemaObject<DeitySearchRequestQuery>(
      deitySearchRequestQuerySchema,
      req.query
    );

  const pagination = getPaginationOptions({ pageLimit, pageOffset });
  const results = await searchDeities(query, pagination, sort);
  return createGetArrayResponse<DeityResult>(res, results, { pagination });
};

export const handleGetDeity = async (
  req: Request,
  res: Response
): Promise<Response<DeityGetResponse> | Response<ErrorResponse>> => {
  const { deityId } = validateJSONSchemaObject<DeityRequestParams>(
    deityRequestParamsSchema,
    req.params
  );
  const result = await getDeity({ id: deityId });
  return createGetResponse<DeityResult>(res, result);
};

export const handlePostDeity = async (
  req: Request,
  res: Response
): Promise<Response<DeityPostResponse> | Response<ErrorResponse>> => {
  const body = validateJSONSchemaObject<DeityPostRequestBody>(
    deityPostRequestBodySchema,
    req.body
  );
  const result = await insertDeity(body);
  return createPostResponse<DeityResult>(req, res, result);
};

export const handlePatchDeity = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { deityId } = validateJSONSchemaObject<DeityRequestParams>(
    deityRequestParamsSchema,
    req.params
  );
  const body = validateJSONSchemaObject<DeityPatchRequestBody>(
    deityPatchRequestBodySchema,
    req.body
  );
  const result = await updateDeity({ id: deityId }, body);
  return createPatchResponse<Deity>(res, result);
};

export const handleDeleteDeity = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { deityId } = validateJSONSchemaObject<DeityRequestParams>(
    deityRequestParamsSchema,
    req.params
  );
  const result = await deleteDeity({ id: deityId });
  return createDeleteResponse<Deity>(res, result);
};
