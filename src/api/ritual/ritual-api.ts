import { Request, Response } from "express";
import { validateJSONSchemaObject } from "../../middleware/validators/ajv-validator";
import { ErrorResponse } from "../../utils/shared-types";
import { Ritual } from "@prisma/client";
import { getPaginationOptions } from "../../utils/pagination";
import {
  createDeleteResponse,
  createGetArrayResponse,
  createGetResponse,
  createPatchResponse,
  createPostResponse,
} from "../../utils/http-response-factory";
import {
  RitualResult,
  deleteRitual,
  getRitual,
  insertRitual,
  searchRituals,
  updateRitual,
} from "./ritual";
import {
  RitualPatchRequestBody,
  RitualPostRequestBody,
  RitualPostResponse,
  RitualRequestParams,
  RitualSearchRequestQuery,
  RitualSearchResponse,
  RitualGetResponse,
} from "./ritual-api.types";
import {
  ritualPatchRequestBodySchema,
  ritualPostRequestBodySchema,
  ritualRequestParamsSchema,
  ritualSearchRequestQuerySchema,
} from "./ritual-api.schema";

export const handleSearchRitual = async (
  req: Request,
  res: Response
): Promise<Response<RitualSearchResponse> | Response<ErrorResponse>> => {
  const { pageOffset, pageLimit, sort, ...query } =
    validateJSONSchemaObject<RitualSearchRequestQuery>(
      ritualSearchRequestQuerySchema,
      req.query
    );

  const pagination = getPaginationOptions({ pageLimit, pageOffset });
  const results = await searchRituals(query, pagination, sort);
  return createGetArrayResponse<RitualResult>(res, results, { pagination });
};

export const handleGetRitual = async (
  req: Request,
  res: Response
): Promise<Response<RitualGetResponse> | Response<ErrorResponse>> => {
  const { ritualId } = validateJSONSchemaObject<RitualRequestParams>(
    ritualRequestParamsSchema,
    req.params
  );
  const result = await getRitual({ id: ritualId });
  return createGetResponse<RitualResult>(res, result);
};

export const handlePostRitual = async (
  req: Request,
  res: Response
): Promise<Response<RitualPostResponse> | Response<ErrorResponse>> => {
  const body = validateJSONSchemaObject<RitualPostRequestBody>(
    ritualPostRequestBodySchema,
    req.body
  );
  const result = await insertRitual(body);
  return createPostResponse<RitualResult>(req, res, result);
};

export const handlePatchRitual = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { ritualId } = validateJSONSchemaObject<RitualRequestParams>(
    ritualRequestParamsSchema,
    req.params
  );
  const body = validateJSONSchemaObject<RitualPatchRequestBody>(
    ritualPatchRequestBodySchema,
    req.body
  );
  const result = await updateRitual({ id: ritualId }, body);
  return createPatchResponse<Ritual>(res, result);
};

export const handleDeleteRitual = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { ritualId } = validateJSONSchemaObject<RitualRequestParams>(
    ritualRequestParamsSchema,
    req.params
  );
  const result = await deleteRitual({ id: ritualId });
  return createDeleteResponse<Ritual>(res, result);
};
