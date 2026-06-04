import { Request, Response } from "express";
import { FocusSpellGrant } from "@prisma/client";
import { validateJSONSchemaObject } from "../../middleware/validators/ajv-validator";
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
  FocusSpellGrantResult,
  deleteFocusSpellGrant,
  getFocusSpellGrant,
  insertFocusSpellGrant,
  searchFocusSpellGrants,
  updateFocusSpellGrant,
} from "./focus-spell-grant";
import {
  FocusSpellGrantGetResponse,
  FocusSpellGrantPatchRequestBody,
  FocusSpellGrantPostRequestBody,
  FocusSpellGrantPostResponse,
  FocusSpellGrantRequestParams,
  FocusSpellGrantSearchRequestQuery,
  FocusSpellGrantSearchResponse,
} from "./focus-spell-grant-api.types";
import {
  focusSpellGrantPatchRequestBodySchema,
  focusSpellGrantPostRequestBodySchema,
  focusSpellGrantRequestParamsSchema,
  focusSpellGrantSearchRequestQuerySchema,
} from "./focus-spell-grant-api.schema";

export const handleSearchFocusSpellGrant = async (
  req: Request,
  res: Response
): Promise<
  Response<FocusSpellGrantSearchResponse> | Response<ErrorResponse>
> => {
  const { pageOffset, pageLimit, sort, ...query } =
    validateJSONSchemaObject<FocusSpellGrantSearchRequestQuery>(
      focusSpellGrantSearchRequestQuerySchema,
      req.query
    );

  const pagination = getPaginationOptions({
    pageLimit: pageLimit,
    pageOffset: pageOffset,
  });

  const results = await searchFocusSpellGrants(query, pagination, sort);
  return createGetArrayResponse<FocusSpellGrantResult>(res, results, {
    pagination,
  });
};

export const handleGetFocusSpellGrant = async (
  req: Request,
  res: Response
): Promise<Response<FocusSpellGrantGetResponse> | Response<ErrorResponse>> => {
  const { focusSpellGrantId } =
    validateJSONSchemaObject<FocusSpellGrantRequestParams>(
      focusSpellGrantRequestParamsSchema,
      req.params
    );
  const result = await getFocusSpellGrant({ id: focusSpellGrantId });
  return createGetResponse<FocusSpellGrantResult>(res, result);
};

export const handlePostFocusSpellGrant = async (
  req: Request,
  res: Response
): Promise<Response<FocusSpellGrantPostResponse> | Response<ErrorResponse>> => {
  const body = validateJSONSchemaObject<FocusSpellGrantPostRequestBody>(
    focusSpellGrantPostRequestBodySchema,
    req.body
  );
  const result = await insertFocusSpellGrant(body);
  return createPostResponse<FocusSpellGrantResult>(req, res, result);
};

export const handlePatchFocusSpellGrant = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { focusSpellGrantId } =
    validateJSONSchemaObject<FocusSpellGrantRequestParams>(
      focusSpellGrantRequestParamsSchema,
      req.params
    );
  const body = validateJSONSchemaObject<FocusSpellGrantPatchRequestBody>(
    focusSpellGrantPatchRequestBodySchema,
    req.body
  );
  const result = await updateFocusSpellGrant({ id: focusSpellGrantId }, body);
  return createPatchResponse<FocusSpellGrant>(res, result);
};

export const handleDeleteFocusSpellGrant = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { focusSpellGrantId } =
    validateJSONSchemaObject<FocusSpellGrantRequestParams>(
      focusSpellGrantRequestParamsSchema,
      req.params
    );
  const result = await deleteFocusSpellGrant({ id: focusSpellGrantId });
  return createDeleteResponse<FocusSpellGrant>(res, result);
};
