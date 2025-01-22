import { Request, Response } from "express";
import { ErrorResponse } from "../../utils/shared-types";
import { getPaginationOptions } from "../../utils/pagination";
import {
  createDeleteResponse,
  createGetArrayResponse,
  createGetResponse,
  createPatchResponse,
  createPostResponse,
} from "../../utils/http-response-factory";
import { validateJSONSchemaObject } from "../../middleware/validators/ajv-validator";
import { Language } from "@prisma/client";
import {
  LanguageGetResponse,
  LanguagePatchRequestBody,
  LanguagePostRequestBody,
  LanguagePostResponse,
  LanguageRequestParams,
  LanguageSearchRequestQuery,
  LanguageSearchResponse,
} from "./language-api.types";
import {
  languagePatchRequestBodySchema,
  languagePostRequestBodySchema,
  languageRequestParamsSchema,
  languageSearchRequestQuerySchema,
} from "./language-api.schema";
import {
  LanguageResult,
  deleteLanguage,
  getLanguage,
  insertLanguage,
  searchLanguage,
  updateLanguage,
} from "./language";

export const handleSearchLanguage = async (
  req: Request,
  res: Response
): Promise<Response<LanguageSearchResponse> | Response<ErrorResponse>> => {
  const { pageOffset, pageLimit, sort, ...query } =
    validateJSONSchemaObject<LanguageSearchRequestQuery>(
      languageSearchRequestQuerySchema,
      req.query
    );

  const pagination = getPaginationOptions({
    pageLimit: pageLimit,
    pageOffset: pageOffset,
  });

  const results = await searchLanguage(query, pagination, sort);
  return createGetArrayResponse<LanguageResult>(res, results, {
    pagination,
  });
};

export const handleGetLanguage = async (
  req: Request,
  res: Response
): Promise<Response<LanguageGetResponse> | Response<ErrorResponse>> => {
  const { languageId } = validateJSONSchemaObject<LanguageRequestParams>(
    languageRequestParamsSchema,
    req.params
  );

  const result = await getLanguage({ id: languageId });

  return createGetResponse<LanguageResult>(res, result);
};

export const handlePostLanguage = async (
  req: Request,
  res: Response
): Promise<Response<LanguagePostResponse> | Response<ErrorResponse>> => {
  const body = validateJSONSchemaObject<LanguagePostRequestBody>(
    languagePostRequestBodySchema,
    req.body
  );
  const result = await insertLanguage(body);

  return createPostResponse<LanguageResult>(req, res, result);
};

export const handlePatchLanguage = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { languageId } = validateJSONSchemaObject<LanguageRequestParams>(
    languageRequestParamsSchema,
    req.params
  );
  const body = validateJSONSchemaObject<LanguagePatchRequestBody>(
    languagePatchRequestBodySchema,
    req.body
  );

  const result = await updateLanguage({ id: languageId }, body);
  return createPatchResponse<Language>(res, result);
};

export const handleDeleteLanguage = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { languageId } = validateJSONSchemaObject<LanguageRequestParams>(
    languageRequestParamsSchema,
    req.params
  );
  const result = await deleteLanguage({ id: languageId });

  return createDeleteResponse<Language>(res, result);
};
