import { Request, Response } from "express";
import {
  createDeleteResponse,
  createGetArrayResponse,
  createGetResponse,
  createPatchResponse,
  createPostResponse,
} from "../../utils/http-response-factory";
import { getPaginationOptions } from "../../utils/pagination";
import { validateJSONSchemaObject } from "../../middleware/validators/ajv-validator";
import { ErrorResponse } from "../../utils/shared-types";
import { Skill } from "@prisma/client";
import {
  skillPatchRequestBodySchema,
  skillPostRequestBodySchema,
  skillRequestParamsSchema,
  skillSearchRequestQuerySchema,
} from "./skill-api.schema";
import {
  SkillGetResponse,
  SkillPatchRequestBody,
  SkillPostRequestBody,
  SkillPostResponse,
  SkillRequestParams,
  SkillSearchRequestQuery,
  SkillSearchResponse,
} from "./skill-api.types";
import { deleteSkill, getSkill, insertSkill, searchSkill, SkillResult, updateSkill } from "./skill";

export const handleSearchSkill = async (
  req: Request,
  res: Response
): Promise<Response<SkillSearchResponse> | Response<ErrorResponse>> => {
  const { pageOffset, pageLimit, sort, ...query } =
    validateJSONSchemaObject<SkillSearchRequestQuery>(
      skillSearchRequestQuerySchema,
      req.query
    );

  const pagination = getPaginationOptions({
    pageLimit: pageLimit,
    pageOffset: pageOffset,
  });

  const results = await searchSkill(query, pagination, sort);
  return createGetArrayResponse<SkillResult>(res, results, {
    pagination,
  });
};

export const handleGetSkill = async (
  req: Request,
  res: Response
): Promise<Response<SkillGetResponse> | Response<ErrorResponse>> => {
  const { skillId } = validateJSONSchemaObject<SkillRequestParams>(
    skillRequestParamsSchema,
    req.params
  );
  const result = await getSkill({ id: skillId });

  return createGetResponse<SkillResult>(res, result);
};

export const handlePostSkill = async (
  req: Request,
  res: Response
): Promise<Response<SkillPostResponse> | Response<ErrorResponse>> => {
  const body = validateJSONSchemaObject<SkillPostRequestBody>(
    skillPostRequestBodySchema,
    req.body
  );
  const result = await insertSkill(body);

  return createPostResponse<SkillResult>(req, res, result);
};

export const handlePatchSkill = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { skillId } = validateJSONSchemaObject<SkillRequestParams>(
    skillRequestParamsSchema,
    req.params
  );
  const body = validateJSONSchemaObject<SkillPatchRequestBody>(
    skillPatchRequestBodySchema,
    req.body
  );
  const result = await updateSkill({ id: skillId }, body);
  return createPatchResponse<Skill>(res, result);
};

export const handleDeleteSkill = async (
  req: Request,
  res: Response
): Promise<Response<void> | Response<ErrorResponse>> => {
  const { skillId } = validateJSONSchemaObject<SkillRequestParams>(
    skillRequestParamsSchema,
    req.params
  );
  const result = await deleteSkill({ id: skillId });

  return createDeleteResponse<Skill>(res, result);
};
