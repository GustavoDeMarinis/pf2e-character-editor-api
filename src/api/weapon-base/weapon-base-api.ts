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
  WeaponBaseGetResponse,
  WeaponBasePatchRequestBody,
  WeaponBasePostRequestBody,
  WeaponBasePostResponse,
  WeaponBaseRequestParams,
  WeaponBaseSearchRequestQuery,
  WeaponBaseSearchResponse,
} from "./weapon-base-api.types";
import {
  weaponBasePatchRequestBodySchema,
  weaponBasePostRequestBodySchema,
  weaponBaseRequestParamsSchema,
  weaponBaseSearchRequestQuerySchema,
} from "./weapon-base-api.schema";
import {
  WeaponBaseResult,
  deleteWeaponBase,
  getWeaponBase,
  insertWeaponBase,
  searchWeaponBase,
  updateWeaponBase,
} from "./weapon-base";
import { WeaponBase } from "@prisma/client";

export const handleSearchWeaponBase = async (
  req: Request,
  res: Response
): Promise<Response<WeaponBaseSearchResponse> | Response<ErrorResponse>> => {
  const { pageOffset, pageLimit, sort, ...query } =
    validateJSONSchemaObject<WeaponBaseSearchRequestQuery>(
      weaponBaseSearchRequestQuerySchema,
      req.query
    );

  const pagination = getPaginationOptions({
    pageLimit: pageLimit,
    pageOffset: pageOffset,
  });

  const results = await searchWeaponBase(query, pagination, sort);

  return createGetArrayResponse<WeaponBaseResult>(res, results, {
    pagination,
  });
};

export const handleGetWeaponBase = async (
  req: Request,
  res: Response
): Promise<Response<WeaponBaseGetResponse> | Response<ErrorResponse>> => {
  const { weaponBaseId } = validateJSONSchemaObject<WeaponBaseRequestParams>(
    weaponBaseRequestParamsSchema,
    req.params
  );

  const result = await getWeaponBase({ id: weaponBaseId });

  return createGetResponse<WeaponBaseResult>(res, result);
};

export const handlePostWeaponBase = async (
  req: Request,
  res: Response
): Promise<Response<WeaponBasePostResponse> | Response<ErrorResponse>> => {
  const body = validateJSONSchemaObject<WeaponBasePostRequestBody>(
    weaponBasePostRequestBodySchema,
    req.body
  );
  const result = await insertWeaponBase(body);

  return createPostResponse<WeaponBaseResult>(req, res, result);
};

export const handlePatchWeaponBase = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { weaponBaseId } = validateJSONSchemaObject<WeaponBaseRequestParams>(
    weaponBaseRequestParamsSchema,
    req.params
  );
  const body = validateJSONSchemaObject<WeaponBasePatchRequestBody>(
    weaponBasePatchRequestBodySchema,
    req.body
  );
  const result = await updateWeaponBase({ id: weaponBaseId }, body);
  return createPatchResponse<WeaponBase>(res, result);
};

export const handleDeleteWeaponBase = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { weaponBaseId } = validateJSONSchemaObject<WeaponBaseRequestParams>(
    weaponBaseRequestParamsSchema,
    req.params
  );
  const result = await deleteWeaponBase({ id: weaponBaseId });

  return createDeleteResponse<WeaponBase>(res, result);
};
