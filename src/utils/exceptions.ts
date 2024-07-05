import { ErrorCode, ErrorResult } from "./shared-types";

export function isErrorResult(result: any): result is ErrorResult {
  return Object.values(ErrorCode).includes(result?.code) && result?.message;
}
