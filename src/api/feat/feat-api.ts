import { Request, Response } from "express";
import { validateJSONSchemaObject } from "../../middleware/validators/ajv-validator";
import { ErrorResponse } from "../../utils/shared-types";
import { Feat } from "@prisma/client";
import { getPaginationOptions } from "../../utils/pagination";
import {
  createDeleteResponse,
  createGetArrayResponse,
  createGetResponse,
  createPatchResponse,
  createPostResponse,
} from "../../utils/http-response-factory";
import {
  FeatResult,
  deleteFeat,
  getFeat,
  insertFeat,
  searchFeats,
  updateFeat,
} from "./feat";
import {
  FeatGetResponse,
  FeatPatchRequestBody,
  FeatPostRequestBody,
  FeatPostResponse,
  FeatRequestParams,
  FeatSearchRequestQuery,
  FeatSearchResponse,
} from "./feat-api.types";
import {
  featPatchRequestBodySchema,
  featPostRequestBodySchema,
  featRequestParamsSchema,
  featSearchRequestQuerySchema,
} from "./feat-api.schema";

export const handleSearchFeat = async (
  req: Request,
  res: Response
): Promise<Response<FeatSearchResponse> | Response<ErrorResponse>> => {
  const { pageOffset, pageLimit, sort, ...query } =
    validateJSONSchemaObject<FeatSearchRequestQuery>(
      featSearchRequestQuerySchema,
      req.query
    );

  const pagination = getPaginationOptions({ pageLimit, pageOffset });
  const results = await searchFeats(query, pagination, sort);
  return createGetArrayResponse<FeatResult>(res, results, { pagination });
};

export const handleGetFeat = async (
  req: Request,
  res: Response
): Promise<Response<FeatGetResponse> | Response<ErrorResponse>> => {
  const { featId } = validateJSONSchemaObject<FeatRequestParams>(
    featRequestParamsSchema,
    req.params
  );
  const result = await getFeat({ id: featId });
  return createGetResponse<FeatResult>(res, result);
};

export const handlePostFeat = async (
  req: Request,
  res: Response
): Promise<Response<FeatPostResponse> | Response<ErrorResponse>> => {
  const body = validateJSONSchemaObject<FeatPostRequestBody>(
    featPostRequestBodySchema,
    req.body
  );
  const result = await insertFeat(body as Parameters<typeof insertFeat>[0]);
  return createPostResponse<FeatResult>(req, res, result);
};

export const handlePatchFeat = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { featId } = validateJSONSchemaObject<FeatRequestParams>(
    featRequestParamsSchema,
    req.params
  );
  const body = validateJSONSchemaObject<FeatPatchRequestBody>(
    featPatchRequestBodySchema,
    req.body
  );
  const result = await updateFeat({ id: featId }, body as Parameters<typeof updateFeat>[1]);
  return createPatchResponse<Feat>(res, result);
};

export const handleDeleteFeat = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { featId } = validateJSONSchemaObject<FeatRequestParams>(
    featRequestParamsSchema,
    req.params
  );
  const result = await deleteFeat({ id: featId });
  return createDeleteResponse<Feat>(res, result);
};
