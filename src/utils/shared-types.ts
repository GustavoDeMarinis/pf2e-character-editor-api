import { Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

export interface SearchResult<T> {
  items: T[];
  count: number;
}

export type GetArrayResponseOptions = {
  pagination?: PaginationOptions;
};

export type PaginationOptions = {
  skip: number;
  take: number;
};

export interface ResultWithOptionalId {
  id?: string;
  [key: string]: unknown;
}

export type ErrorResponse = {
  error: {
    code: StatusCodes;
    message: string;
    validationDetails?: { [key: string]: string };
  };
};

export type ErrorResult = {
  code: ErrorCode;
  message: string;
  validationDetails?: { [key: string]: string };
  internalErrorDetails?: { [key: string]: Prisma.JsonValue };
};

export enum ErrorCode {
  NotFound,
  DataConflict,
  DataNotProcessable,
  BadRequest, // Should be reserved for request validation errors that cannot be included in ajv
  Forbidden,
  Unknown,
}
export interface ArrayResponse<T> {
  items: T[];
  pagination?: {
    pageLimit: number;
    pageOffset: number;
    total: number;
  };
}
