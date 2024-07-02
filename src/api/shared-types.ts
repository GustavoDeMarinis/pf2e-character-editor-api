import { Prisma } from "@prisma/client";

export type PaginationOptions = {
  skip: number;
  take: number;
};

export interface ResultWithOptionalId {
  id?: string;
  [key: string]: unknown;
}

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
}
