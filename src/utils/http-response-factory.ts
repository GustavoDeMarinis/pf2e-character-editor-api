import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  ArrayResponse,
  ErrorCode,
  ErrorResponse,
  ErrorResult,
  GetArrayResponseOptions,
  SearchResult,
} from "./shared-types";
import { isErrorResult } from "./exceptions";
import { logError, logWarning } from "./logging";
const subService = "http-response-factory";

export const createErrorResponse = (
  response: Response,
  result: ErrorResult
): Response<ErrorResponse> => {
  switch (result.code) {
    case ErrorCode.BadRequest:
      return createHttpErrorResponse(StatusCodes.BAD_REQUEST, response, result);
    case ErrorCode.NotFound:
      return createHttpErrorResponse(StatusCodes.NOT_FOUND, response, result);
    case ErrorCode.DataConflict:
      return createHttpErrorResponse(StatusCodes.CONFLICT, response, result);
    case ErrorCode.Forbidden:
      return createHttpErrorResponse(StatusCodes.FORBIDDEN, response, result);
    case ErrorCode.DataNotProcessable:
      return createHttpErrorResponse(
        StatusCodes.UNPROCESSABLE_ENTITY,
        response,
        result
      );
    case ErrorCode.Unknown:
    default:
      return createHttpErrorResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        response,
        result
      );
  }
};

function createHttpErrorResponse(
  code: StatusCodes,
  response: Response,
  errorResult: ErrorResult
): Response<ErrorResponse> {
  if (code >= StatusCodes.INTERNAL_SERVER_ERROR) {
    logError({
      subService,
      message: `Error ${code} ${errorResult.message}`,
      details: errorResult,
    });
  } else {
    logWarning({
      subService,
      message: `Error ${code} ${errorResult.message}`,
      details: errorResult,
    });
  }
  return response.status(code).json({
    error: {
      code,
      message: errorResult.message,
      validationDetails: errorResult.validationDetails,
    },
  });
}

export const createGetArrayResponse = <T>(
  response: Response,
  result: SearchResult<T> | ErrorResult,
  options?: GetArrayResponseOptions
): Response<ErrorResponse> | Response<ArrayResponse<T>> => {
  if (isErrorResult(result)) {
    return createErrorResponse(response, result);
  }
  const arrayResponse: ArrayResponse<T> = {
    items: result.items,
  };
  if (options?.pagination) {
    arrayResponse.pagination = {
      pageOffset: options.pagination.skip,
      pageLimit: options.pagination.take,
      total: result.count,
    };
  }

  return response.status(StatusCodes.OK).json(arrayResponse);
};
