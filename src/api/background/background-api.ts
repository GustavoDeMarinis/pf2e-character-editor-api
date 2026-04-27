import { Request, Response } from "express";
import { validateJSONSchemaObject } from "../../middleware/validators/ajv-validator";
import { ErrorResponse } from "../../utils/shared-types";
import { Background } from "@prisma/client";
import { getPaginationOptions } from "../../utils/pagination";
import {
  createDeleteResponse,
  createGetArrayResponse,
  createGetResponse,
  createPatchResponse,
  createPostResponse,
} from "../../utils/http-response-factory";
import {
  BackgroundResult,
  deleteBackground,
  getBackground,
  insertBackground,
  searchBackgrounds,
  updateBackground,
} from "./background";
import {
  BackgroundPatchRequestBody,
  BackgroundPostRequestBody,
  BackgroundPostResponse,
  BackgroundRequestParams,
  BackgroundSearchRequestQuery,
  BackgroundSearchResponse,
  BackgroundGetResponse,
} from "./background-api.types";
import {
  backgroundPatchRequestBodySchema,
  backgroundPostRequestBodySchema,
  backgroundRequestParamsSchema,
  backgroundSearchRequestQuerySchema,
} from "./background-api.schema";

export const handleSearchBackground = async (
  req: Request,
  res: Response
): Promise<Response<BackgroundSearchResponse> | Response<ErrorResponse>> => {
  const { pageOffset, pageLimit, sort, ...query } =
    validateJSONSchemaObject<BackgroundSearchRequestQuery>(
      backgroundSearchRequestQuerySchema,
      req.query
    );

  const pagination = getPaginationOptions({ pageLimit, pageOffset });
  const results = await searchBackgrounds(query, pagination, sort);
  return createGetArrayResponse<BackgroundResult>(res, results, { pagination });
};

export const handleGetBackground = async (
  req: Request,
  res: Response
): Promise<Response<BackgroundGetResponse> | Response<ErrorResponse>> => {
  const { backgroundId } = validateJSONSchemaObject<BackgroundRequestParams>(
    backgroundRequestParamsSchema,
    req.params
  );
  const result = await getBackground({ id: backgroundId });
  return createGetResponse<BackgroundResult>(res, result);
};

export const handlePostBackground = async (
  req: Request,
  res: Response
): Promise<Response<BackgroundPostResponse> | Response<ErrorResponse>> => {
  const body = validateJSONSchemaObject<BackgroundPostRequestBody>(
    backgroundPostRequestBodySchema,
    req.body
  );
  const result = await insertBackground(body);
  return createPostResponse<BackgroundResult>(req, res, result);
};

export const handlePatchBackground = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { backgroundId } = validateJSONSchemaObject<BackgroundRequestParams>(
    backgroundRequestParamsSchema,
    req.params
  );
  const body = validateJSONSchemaObject<BackgroundPatchRequestBody>(
    backgroundPatchRequestBodySchema,
    req.body
  );
  const result = await updateBackground({ id: backgroundId }, body);
  return createPatchResponse<Background>(res, result);
};

export const handleDeleteBackground = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { backgroundId } = validateJSONSchemaObject<BackgroundRequestParams>(
    backgroundRequestParamsSchema,
    req.params
  );
  const result = await deleteBackground({ id: backgroundId });
  return createDeleteResponse<Background>(res, result);
};
