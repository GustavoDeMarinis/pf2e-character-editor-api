import { Request, Response } from "express";
import { ErrorResponse } from "../../utils/shared-types";
import { getPaginationOptions } from "../../utils/pagination";
import {
  createGetArrayResponse,
  createGetResponse,
} from "../../utils/http-response-factory";
import {
  AncestryGetResponse,
  AncestryRequestParams,
  AncestrySearchRequestQuery,
  AncestrySearchResponse,
} from "./ancestry-api.types";
import { validateJSONSchemaObject } from "../../middleware/validators/ajv-validator";
import {
  ancestryRequestParamsSchema,
  ancestrySearchRequestQuerySchema,
} from "./ancestry-api.schema";
import { AncestryResult, searchAncestries } from "./ancestry";
import { Prisma } from "@prisma/client";

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
