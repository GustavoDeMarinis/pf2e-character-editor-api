import { Domain, Prisma } from "@prisma/client";
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

const subService = "domain/service";

export const domainSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  name: true,
  description: true,
};

export const domainArgs = Prisma.validator<Prisma.DomainDefaultArgs>()({
  select: domainSelect,
});

export type DomainResult = Prisma.DomainGetPayload<typeof domainArgs>;

type DomainToInsert = Pick<
  Prisma.DomainUncheckedCreateInput,
  "name" | "description"
>;

export const searchDomains = async (
  search: {
    name?: string;
    deityId?: string;
    isActive?: boolean;
  },
  { skip, take }: PaginationOptions,
  sort?: string
): Promise<SearchResult<DomainResult> | ErrorResult> => {
  const { isActive, deityId, ...searchFilters } = search;
  const where: Prisma.DomainWhereInput = { ...searchFilters };

  if (deityId !== undefined) {
    where.deities = { some: { id: deityId } };
  }

  if (isActive !== undefined) {
    where.deletedAt = !isActive ? { not: null } : null;
  }

  const orderBy = handleSort(sort);
  const items = await prisma.domain.findMany({
    select: domainSelect,
    skip,
    take,
    orderBy,
    where,
  });

  const count = await getQueryCount(prisma.domain, where);

  logDebug({
    subService,
    message: `Domain Search found (${count}) results`,
    details: { count, filter: where },
  });
  return { items, count };
};

export const getDomain = async ({
  id,
}: Required<Pick<Prisma.DomainWhereUniqueInput, "id">>): Promise<
  DomainResult | ErrorResult
> => {
  const domain = await prisma.domain.findUniqueOrThrow({
    where: { id },
    select: domainSelect,
  });
  logDebug({
    subService,
    message: "Domain Retrieved by Id",
    details: { domain },
  });
  return domain;
};

export const insertDomain = async (
  domainToInsert: DomainToInsert
): Promise<DomainResult | ErrorResult> => {
  const existing = await prisma.domain.findFirst({
    select: { id: true, deletedAt: true },
    where: { name: domainToInsert.name },
  });
  if (existing && !existing.deletedAt) {
    return {
      code: ErrorCode.DataConflict,
      message: "A domain with that name already exists",
    };
  }

  return prisma.domain.create({ select: domainSelect, data: domainToInsert });
};

export const updateDomain = async (
  { id }: Prisma.DomainWhereUniqueInput,
  domainToUpdate: Pick<
    Prisma.DomainUncheckedUpdateInput,
    "name" | "description"
  >,
  reactivate?: false
): Promise<Domain | ErrorResult> => {
  const existing = await prisma.domain.findUnique({
    select: { id: true, deletedAt: true },
    where: { id },
  });
  if (!existing || existing.deletedAt) {
    return { code: ErrorCode.NotFound, message: "Domain Not Found" };
  }

  const data: Prisma.DomainUncheckedUpdateInput = { ...domainToUpdate };
  if (reactivate) {
    data.deletedAt = null;
  }
  return prisma.domain.update({ where: { id }, data });
};

export const deleteDomain = async ({
  id,
}: Prisma.DomainWhereUniqueInput): Promise<Domain | ErrorResult> => {
  const existing = await prisma.domain.findUnique({
    select: { deletedAt: true },
    where: { id },
  });
  if (!existing || existing.deletedAt) {
    return { code: ErrorCode.NotFound, message: "Domain Not Found" };
  }
  return prisma.domain.update({
    data: { deletedAt: new Date() },
    where: { id },
  });
};
