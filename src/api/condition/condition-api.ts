import { Request, Response } from "express";
import { Condition } from "@prisma/client";
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
  ConditionResult,
  deleteCondition,
  getCondition,
  insertCondition,
  searchConditions,
  updateCondition,
} from "./condition";
import {
  ConditionGetResponse,
  ConditionPatchRequestBody,
  ConditionPostRequestBody,
  ConditionPostResponse,
  ConditionRequestParams,
  ConditionSearchRequestQuery,
  ConditionSearchResponse,
} from "./condition-api.types";
import {
  conditionPatchRequestBodySchema,
  conditionPostRequestBodySchema,
  conditionRequestParamsSchema,
  conditionSearchRequestQuerySchema,
} from "./condition-api.schema";

export const handleSearchConditions = async (
  req: Request,
  res: Response
): Promise<Response<ConditionSearchResponse> | Response<ErrorResponse>> => {
  const { pageOffset, pageLimit, sort, ...query } =
    validateJSONSchemaObject<ConditionSearchRequestQuery>(
      conditionSearchRequestQuerySchema,
      req.query
    );
  const pagination = getPaginationOptions({ pageLimit, pageOffset });
  const results = await searchConditions(query, pagination, sort);
  return createGetArrayResponse<ConditionResult>(res, results, { pagination });
};

export const handleGetCondition = async (
  req: Request,
  res: Response
): Promise<Response<ConditionGetResponse> | Response<ErrorResponse>> => {
  const { conditionId } = validateJSONSchemaObject<ConditionRequestParams>(
    conditionRequestParamsSchema,
    req.params
  );
  const result = await getCondition({ id: conditionId });
  return createGetResponse<ConditionResult>(res, result);
};

export const handlePostCondition = async (
  req: Request,
  res: Response
): Promise<Response<ConditionPostResponse> | Response<ErrorResponse>> => {
  const body = validateJSONSchemaObject<ConditionPostRequestBody>(
    conditionPostRequestBodySchema,
    req.body
  );
  const result = await insertCondition(body);
  return createPostResponse<ConditionResult>(req, res, result);
};

export const handlePatchCondition = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { conditionId } = validateJSONSchemaObject<ConditionRequestParams>(
    conditionRequestParamsSchema,
    req.params
  );
  const body = validateJSONSchemaObject<ConditionPatchRequestBody>(
    conditionPatchRequestBodySchema,
    req.body
  );
  const result = await updateCondition({ id: conditionId }, body);
  return createPatchResponse<Condition>(res, result);
};

export const handleDeleteCondition = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { conditionId } = validateJSONSchemaObject<ConditionRequestParams>(
    conditionRequestParamsSchema,
    req.params
  );
  const result = await deleteCondition({ id: conditionId });
  return createDeleteResponse<Condition>(res, result);
};
