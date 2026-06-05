import { Request, Response } from "express";
import { validateJSONSchemaObject } from "../../middleware/validators/ajv-validator";
import { ErrorResponse } from "../../utils/shared-types";
import { Equipment } from "@prisma/client";
import { getPaginationOptions } from "../../utils/pagination";
import {
  createDeleteResponse,
  createGetArrayResponse,
  createGetResponse,
  createPatchResponse,
  createPostResponse,
} from "../../utils/http-response-factory";
import {
  EquipmentResult,
  deleteEquipment,
  getEquipment,
  insertEquipment,
  searchEquipment,
  updateEquipment,
} from "./equipment";
import {
  EquipmentGetResponse,
  EquipmentPatchRequestBody,
  EquipmentPostRequestBody,
  EquipmentPostResponse,
  EquipmentRequestParams,
  EquipmentSearchRequestQuery,
  EquipmentSearchResponse,
} from "./equipment-api.types";
import {
  equipmentPatchRequestBodySchema,
  equipmentPostRequestBodySchema,
  equipmentRequestParamsSchema,
  equipmentSearchRequestQuerySchema,
} from "./equipment-api.schema";

export const handleSearchEquipment = async (
  req: Request,
  res: Response
): Promise<Response<EquipmentSearchResponse> | Response<ErrorResponse>> => {
  const { pageOffset, pageLimit, sort, ...query } =
    validateJSONSchemaObject<EquipmentSearchRequestQuery>(
      equipmentSearchRequestQuerySchema,
      req.query
    );

  const pagination = getPaginationOptions({
    pageLimit: pageLimit,
    pageOffset: pageOffset,
  });

  const results = await searchEquipment(query, pagination, sort);
  return createGetArrayResponse<EquipmentResult>(res, results, { pagination });
};

export const handleGetEquipment = async (
  req: Request,
  res: Response
): Promise<Response<EquipmentGetResponse> | Response<ErrorResponse>> => {
  const { equipmentId } = validateJSONSchemaObject<EquipmentRequestParams>(
    equipmentRequestParamsSchema,
    req.params
  );
  const result = await getEquipment({ id: equipmentId });

  return createGetResponse<EquipmentResult>(res, result);
};

export const handleInsertEquipment = async (
  req: Request,
  res: Response
): Promise<Response<EquipmentPostResponse> | Response<ErrorResponse>> => {
  const body = validateJSONSchemaObject<EquipmentPostRequestBody>(
    equipmentPostRequestBodySchema,
    req.body
  );
  const result = await insertEquipment(body);

  return createPostResponse<EquipmentResult>(req, res, result);
};

export const handleUpdateEquipment = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { equipmentId } = validateJSONSchemaObject<EquipmentRequestParams>(
    equipmentRequestParamsSchema,
    req.params
  );
  const body = validateJSONSchemaObject<EquipmentPatchRequestBody>(
    equipmentPatchRequestBodySchema,
    req.body
  );
  const result = await updateEquipment({ id: equipmentId }, body);
  return createPatchResponse<Equipment>(res, result);
};

export const handleDeleteEquipment = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { equipmentId } = validateJSONSchemaObject<EquipmentRequestParams>(
    equipmentRequestParamsSchema,
    req.params
  );
  const result = await deleteEquipment({ id: equipmentId });

  return createDeleteResponse<Equipment>(res, result);
};
