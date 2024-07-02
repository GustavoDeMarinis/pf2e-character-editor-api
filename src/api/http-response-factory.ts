// import { Request, Response } from "express";
// import { ReasonPhrases, StatusCodes } from "http-status-codes";
// import {
//   ErrorCode,
//   ErrorResult,
//   PaginationOptions,
//   ResultWithOptionalId,
// } from "./shared-types";

// export type ErrorResponse = {
//   error: {
//     code: StatusCodes;
//     message: string;
//     validationDetails?: { [key: string]: string };
//   };
// };

// export type GetArrayResponseOptions = {
//   pagination?: PaginationOptions;
// };

// export interface ArrayResponse<T> {
//   items: T[];
//   pagination?: {
//     pageLimit: number;
//     pageOffset: number;
//     total: number;
//   };
// }

// export function createGetResponse<T extends ResultWithOptionalId>(
//   request: Request,
//   response: Response,
//   result: ErrorResult | T | null
// ): Response<ErrorResponse> | Response<T> {
//   if (!result) {
//     return createErrorResponse(response, {
//       code: ErrorCode.NotFound,
//       message: ReasonPhrases.NOT_FOUND,
//     });
//   }
//   if (isErrorResult(result)) {
//     return createErrorResponse(response, result);
//   }
//   return response.status(StatusCodes.OK).json(result);
// }

// export function createErrorResponse(
//   response: Response,
//   result: ErrorResult
// ): Response<ErrorResponse> {
//   switch (result.code) {
//     case ErrorCode.BadRequest:
//       return createHttpErrorResponse(StatusCodes.BAD_REQUEST, response, result);
//     case ErrorCode.NotFound:
//       return createHttpErrorResponse(StatusCodes.NOT_FOUND, response, result);
//     case ErrorCode.DataConflict:
//       return createHttpErrorResponse(StatusCodes.CONFLICT, response, result);
//     case ErrorCode.Forbidden:
//       return createHttpErrorResponse(StatusCodes.FORBIDDEN, response, result);
//     case ErrorCode.DataNotProcessable:
//       return createHttpErrorResponse(
//         StatusCodes.UNPROCESSABLE_ENTITY,
//         response,
//         result
//       );
//     case ErrorCode.Unknown:
//     default:
//       return createHttpErrorResponse(
//         StatusCodes.INTERNAL_SERVER_ERROR,
//         response,
//         result
//       );
//   }
// }

// const createHttpErrorResponse = (
//   code: StatusCodes,
//   response: Response,
//   errorResult: ErrorResult
// ): Response<ErrorResponse> => {
//   if (code >= StatusCodes.INTERNAL_SERVER_ERROR) {
//     logError({
//       subService,
//       message: `Error ${code} ${errorResult.message}`,
//       details: errorResult,
//     });
//   } else {
//     logWarning({
//       subService,
//       message: `Error ${code} ${errorResult.message}`,
//       details: errorResult,
//     });
//   }
//   return response.status(code).json({
//     error: {
//       code,
//       message: errorResult.message,
//       validationDetails: errorResult.validationDetails,
//     },
//   });
// };
