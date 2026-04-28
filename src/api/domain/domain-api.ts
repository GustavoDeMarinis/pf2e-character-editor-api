import { Request, Response } from "express";
import { validateJSONSchemaObject } from "../../middleware/validators/ajv-validator";
import { ErrorResponse } from "../../utils/shared-types";
import { Domain } from "@prisma/client";
import { getPaginationOptions } from "../../utils/pagination";
import {
  createDeleteResponse,
  createGetArrayResponse,
  createGetResponse,
  createPatchResponse,
  createPostResponse,
} from "../../utils/http-response-factory";
import {
  DomainResult,
  deleteDomain,
  getDomain,
  insertDomain,
  searchDomains,
  updateDomain,
} from "./domain";
import {
  DomainPatchRequestBody,
  DomainPostRequestBody,
  DomainPostResponse,
  DomainRequestParams,
  DomainSearchRequestQuery,
  DomainSearchResponse,
  DomainGetResponse,
} from "./domain-api.types";
import {
  domainPatchRequestBodySchema,
  domainPostRequestBodySchema,
  domainRequestParamsSchema,
  domainSearchRequestQuerySchema,
} from "./domain-api.schema";

export const handleSearchDomain = async (
  req: Request,
  res: Response
): Promise<Response<DomainSearchResponse> | Response<ErrorResponse>> => {
  const { pageOffset, pageLimit, sort, ...query } =
    validateJSONSchemaObject<DomainSearchRequestQuery>(
      domainSearchRequestQuerySchema,
      req.query
    );

  const pagination = getPaginationOptions({ pageLimit, pageOffset });
  const results = await searchDomains(query, pagination, sort);
  return createGetArrayResponse<DomainResult>(res, results, { pagination });
};

export const handleGetDomain = async (
  req: Request,
  res: Response
): Promise<Response<DomainGetResponse> | Response<ErrorResponse>> => {
  const { domainId } = validateJSONSchemaObject<DomainRequestParams>(
    domainRequestParamsSchema,
    req.params
  );
  const result = await getDomain({ id: domainId });
  return createGetResponse<DomainResult>(res, result);
};

export const handlePostDomain = async (
  req: Request,
  res: Response
): Promise<Response<DomainPostResponse> | Response<ErrorResponse>> => {
  const body = validateJSONSchemaObject<DomainPostRequestBody>(
    domainPostRequestBodySchema,
    req.body
  );
  const result = await insertDomain(body);
  return createPostResponse<DomainResult>(req, res, result);
};

export const handlePatchDomain = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { domainId } = validateJSONSchemaObject<DomainRequestParams>(
    domainRequestParamsSchema,
    req.params
  );
  const body = validateJSONSchemaObject<DomainPatchRequestBody>(
    domainPatchRequestBodySchema,
    req.body
  );
  const result = await updateDomain({ id: domainId }, body);
  return createPatchResponse<Domain>(res, result);
};

export const handleDeleteDomain = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { domainId } = validateJSONSchemaObject<DomainRequestParams>(
    domainRequestParamsSchema,
    req.params
  );
  const result = await deleteDomain({ id: domainId });
  return createDeleteResponse<Domain>(res, result);
};
