import { Condition, Prisma } from "@prisma/client";
import prisma from "../../integrations/prisma/prisma-client";
import {
  ErrorCode,
  ErrorResult,
  PaginationOptions,
  SearchResult,
} from "../../utils/shared-types";
import { handleSort } from "../../utils/sorting";
import { getQueryCount } from "../../utils/pagination";
import { logDebug } from "../../utils/logging";

const subService = "condition/service";

export const conditionSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  name: true,
  description: true,
  hasValue: true,
  overrides: { select: { id: true, name: true } },
  overriddenBy: { select: { id: true, name: true } },
};

export const conditionArgs = Prisma.validator<Prisma.ConditionDefaultArgs>()({
  select: conditionSelect,
});

export type ConditionResult = Prisma.ConditionGetPayload<typeof conditionArgs>;

type ConditionToInsert = Pick<
  Prisma.ConditionUncheckedCreateInput,
  "name" | "description" | "hasValue"
> & { overrideIds?: string[] };

type ConditionToUpdate = Pick<
  Prisma.ConditionUncheckedUpdateInput,
  "name" | "description" | "hasValue"
> & { overrideIds?: string[] };

const validateOverrideIds = async (
  overrideIds: string[]
): Promise<ErrorResult | null> => {
  if (overrideIds.length === 0) return null;
  const found = await prisma.condition.findMany({
    select: { id: true },
    where: { id: { in: overrideIds } },
  });
  if (found.length !== overrideIds.length) {
    return { code: ErrorCode.NotFound, message: "Condition not found in overrideIds" };
  }
  return null;
};

export const searchConditions = async (
  search: { name?: string; hasValue?: boolean; isActive?: boolean },
  { skip, take }: PaginationOptions,
  sort?: string
): Promise<SearchResult<ConditionResult> | ErrorResult> => {
  const { isActive, name, hasValue } = search;
  const where: Prisma.ConditionWhereInput = {};

  if (name !== undefined) {
    where.name = { contains: name, mode: "insensitive" };
  }
  if (hasValue !== undefined) {
    where.hasValue = hasValue;
  }
  if (isActive !== undefined) {
    where.deletedAt = !isActive ? { not: null } : null;
  }

  const orderBy = handleSort(sort);
  const items = await prisma.condition.findMany({
    select: conditionSelect,
    skip,
    take,
    orderBy,
    where,
  });
  const count = await getQueryCount(prisma.condition, where);

  logDebug({
    subService,
    message: `Condition Search found (${count}) results`,
    details: { count, filter: where },
  });
  return { items, count };
};

export const getCondition = async ({
  id,
}: Required<Pick<Prisma.ConditionWhereUniqueInput, "id">>): Promise<
  ConditionResult | ErrorResult
> => {
  const condition = await prisma.condition.findUniqueOrThrow({
    where: { id },
    select: conditionSelect,
  });
  logDebug({
    subService,
    message: "Condition Retrieved by Id",
    details: { condition },
  });
  return condition;
};

export const insertCondition = async (
  conditionToInsert: ConditionToInsert
): Promise<ConditionResult | ErrorResult> => {
  const existing = await prisma.condition.findFirst({
    select: { id: true, deletedAt: true },
    where: { name: conditionToInsert.name },
  });
  if (existing && !existing.deletedAt) {
    return { code: ErrorCode.DataConflict, message: "A condition with that name already exists" };
  }

  const { overrideIds, ...rest } = conditionToInsert;
  const resolvedOverrideIds = overrideIds ?? [];

  const overrideError = await validateOverrideIds(resolvedOverrideIds);
  if (overrideError) return overrideError;

  return prisma.condition.create({
    select: conditionSelect,
    data: {
      ...rest,
      overrides: { connect: resolvedOverrideIds.map((id) => ({ id })) },
    },
  });
};

export const updateCondition = async (
  { id }: Prisma.ConditionWhereUniqueInput,
  conditionToUpdate: ConditionToUpdate
): Promise<Condition | ErrorResult> => {
  const existing = await prisma.condition.findUnique({
    select: { id: true, deletedAt: true },
    where: { id },
  });
  if (!existing || existing.deletedAt) {
    return { code: ErrorCode.NotFound, message: "Condition Not Found" };
  }

  const { overrideIds, ...rest } = conditionToUpdate;

  if (overrideIds !== undefined) {
    if (overrideIds.includes(id as string)) {
      return { code: ErrorCode.BadRequest, message: "A condition cannot override itself" };
    }
    const overrideError = await validateOverrideIds(overrideIds);
    if (overrideError) return overrideError;
  }

  return prisma.condition.update({
    where: { id },
    data: {
      ...rest,
      ...(overrideIds !== undefined && {
        overrides: { set: overrideIds.map((overrideId) => ({ id: overrideId })) },
      }),
    },
  });
};

export const deleteCondition = async ({
  id,
}: Prisma.ConditionWhereUniqueInput): Promise<Condition | ErrorResult> => {
  const existing = await prisma.condition.findUnique({
    select: { deletedAt: true },
    where: { id },
  });
  if (!existing || existing.deletedAt) {
    return { code: ErrorCode.NotFound, message: "Condition Not Found" };
  }
  return prisma.condition.update({
    data: { deletedAt: new Date() },
    where: { id },
  });
};
