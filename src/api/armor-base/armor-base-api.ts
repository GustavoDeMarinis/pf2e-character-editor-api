import { Request, Response } from "express";
import { ErrorResponse } from "../../utils/shared-types";
import { validateJSONSchemaObject } from "../../middleware/validators/ajv-validator";
import { getPaginationOptions } from "../../utils/pagination";
import {
  createDeleteResponse,
  createGetArrayResponse,
  createGetResponse,
  createPatchResponse,
  createPostResponse,
} from "../../utils/http-response-factory";
import {
  ArmorBaseGetResponse,
  ArmorBasePatchRequestBody,
  ArmorBasePostRequestBody,
  ArmorBasePostResponse,
  ArmorBaseRequestParams,
  ArmorBaseSearchRequestQuery,
  ArmorBaseSearchResponse,
} from "./armor-base-api.types";
import {
  armorBasePatchRequestBodySchema,
  armorBasePostRequestBodySchema,
  armorBaseRequestParamsSchema,
  armorBaseSearchRequestQuerySchema,
} from "./armor-base-api.schema";
import {
  ArmorBaseResult,
  deleteArmorBase,
  getArmorBase,
  insertArmorBase,
  searchArmorBase,
  updateArmorBase,
} from "./armor-base";
import { ArmorBase } from "@prisma/client";

export const handleSearchArmorBase = async (
  req: Request,
  res: Response
): Promise<Response<ArmorBaseSearchResponse> | Response<ErrorResponse>> => {
  const { pageOffset, pageLimit, sort, ...query } =
    validateJSONSchemaObject<ArmorBaseSearchRequestQuery>(
      armorBaseSearchRequestQuerySchema,
      req.query
    );

  const pagination = getPaginationOptions({
    pageLimit: pageLimit,
    pageOffset: pageOffset,
  });

  const results = await searchArmorBase(query, pagination, sort);

  return createGetArrayResponse<ArmorBaseResult>(res, results, {
    pagination,
  });
};

export const handleGetArmorBase = async (
  req: Request,
  res: Response
): Promise<Response<ArmorBaseGetResponse> | Response<ErrorResponse>> => {
  const { armorBaseId } = validateJSONSchemaObject<ArmorBaseRequestParams>(
    armorBaseRequestParamsSchema,
    req.params
  );

  const result = await getArmorBase({ id: armorBaseId });

  return createGetResponse<ArmorBaseResult>(res, result);
};

export const handlePostArmorBase = async (
  req: Request,
  res: Response
): Promise<Response<ArmorBasePostResponse> | Response<ErrorResponse>> => {
  const body = validateJSONSchemaObject<ArmorBasePostRequestBody>(
    armorBasePostRequestBodySchema,
    req.body
  );
  const result = await insertArmorBase(body);

  return createPostResponse<ArmorBaseResult>(req, res, result);
};

export const handlePatchArmorBase = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { armorBaseId } = validateJSONSchemaObject<ArmorBaseRequestParams>(
    armorBaseRequestParamsSchema,
    req.params
  );
  const body = validateJSONSchemaObject<ArmorBasePatchRequestBody>(
    armorBasePatchRequestBodySchema,
    req.body
  );
  const result = await updateArmorBase({ id: armorBaseId }, body);
  return createPatchResponse<ArmorBase>(res, result);
};

export const handleDeleteArmorBase = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { armorBaseId } = validateJSONSchemaObject<ArmorBaseRequestParams>(
    armorBaseRequestParamsSchema,
    req.params
  );
  const result = await deleteArmorBase({ id: armorBaseId });

  return createDeleteResponse<ArmorBase>(res, result);
};
