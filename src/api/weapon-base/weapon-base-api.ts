import { Request, Response } from "express";
import { ErrorResponse } from "../../utils/shared-types";
import { validateJSONSchemaObject } from "../../middleware/validators/ajv-validator";
import { getPaginationOptions } from "../../utils/pagination";
import {
  createGetArrayResponse,
  createGetResponse,
  createPostResponse,
} from "../../utils/http-response-factory";
import {
  WeaponBaseGetResponse,
  WeaponBasePostRequestBody,
  WeaponBasePostResponse,
  WeaponBaseRequestParams,
  WeaponBaseSearchRequestQuery,
  WeaponBaseSearchResponse,
} from "./weapon-base-api.types";
import {
  weaponBasePostRequestBodySchema,
  weaponBaseRequestParamsSchema,
  weaponBaseSearchRequestQuerySchema,
} from "./weapon-base-api.schema";
import {
  WeaponBaseResult,
  getWeaponBase,
  searchWeaponBase,
} from "./weapon-base";

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
