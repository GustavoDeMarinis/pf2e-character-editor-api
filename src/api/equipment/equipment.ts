import { Equipment, ItemUsage, Prisma, Rarity } from "@prisma/client";
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

const subService = "equipment/service";

export const equipmentSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  name: true,
  description: true,
  level: true,
  price: true,
  bulk: true,
  hands: true,
  usage: true,
  rarity: true,
  traits: {
    select: {
      id: true,
      name: true,
    },
  },
};

export const equipmentArgs = Prisma.validator<Prisma.EquipmentDefaultArgs>()({
  select: equipmentSelect,
});

export type EquipmentResult = Prisma.EquipmentGetPayload<typeof equipmentArgs>;

type EquipmentToInsert = Pick<
  Prisma.EquipmentUncheckedCreateInput,
  "name" | "description" | "level" | "price" | "bulk" | "hands" | "usage" | "rarity"
> & { traitIds: string[] };

type EquipmentToUpdate = Pick<
  Prisma.EquipmentUncheckedUpdateInput,
  "name" | "description" | "level" | "price" | "bulk" | "hands" | "usage" | "rarity"
> & { traitIds?: string[] };

const validateTraitIds = async (
  traitIds: string[]
): Promise<ErrorResult | null> => {
  if (traitIds.length === 0) return null;
  const found = await prisma.trait.findMany({
    select: { id: true },
    where: { id: { in: traitIds } },
  });
  if (found.length !== traitIds.length) {
    return { code: ErrorCode.NotFound, message: "Trait not found in traitIds" };
  }
  return null;
};

export const searchEquipment = async (
  search: {
    name?: string;
    usage?: ItemUsage;
    rarity?: Rarity;
    level?: number;
    traitIds?: string[];
    isActive?: boolean;
  },
  { skip, take }: PaginationOptions,
  sort?: string
): Promise<SearchResult<EquipmentResult> | ErrorResult> => {
  const { isActive, name, traitIds, ...searchFilters } = search;
  const where: Prisma.EquipmentWhereInput = { ...searchFilters };

  if (name !== undefined) {
    where.name = { contains: name, mode: "insensitive" };
  }
  if (traitIds !== undefined) {
    where.traits = { every: { id: { in: traitIds } } };
  }
  if (isActive !== undefined) {
    where.deletedAt = !isActive ? { not: null } : null;
  }

  const orderBy = handleSort(sort);
  const items = await prisma.equipment.findMany({
    select: equipmentSelect,
    skip,
    take,
    orderBy,
    where,
  });
  const count = await getQueryCount(prisma.equipment, where);

  logDebug({
    subService,
    message: `Equipment Search found (${count}) results`,
    details: { count, filter: where },
  });
  return { items, count };
};

export const getEquipment = async ({
  id,
}: Required<Pick<Prisma.EquipmentWhereUniqueInput, "id">>): Promise<
  EquipmentResult | ErrorResult
> => {
  const equipment = await prisma.equipment.findUniqueOrThrow({
    where: { id },
    select: equipmentSelect,
  });
  logDebug({
    subService,
    message: "Equipment Retrieved by Id",
    details: { equipment },
  });
  return equipment;
};

export const insertEquipment = async (
  equipmentToInsert: EquipmentToInsert
): Promise<EquipmentResult | ErrorResult> => {
  const existing = await prisma.equipment.findFirst({
    select: { id: true, deletedAt: true },
    where: { name: equipmentToInsert.name },
  });
  if (existing && !existing.deletedAt) {
    return {
      code: ErrorCode.DataConflict,
      message: "An equipment item with that name already exists",
    };
  }

  const { traitIds, ...rest } = equipmentToInsert;

  const traitError = await validateTraitIds(traitIds);
  if (traitError) return traitError;

  return prisma.equipment.create({
    select: equipmentSelect,
    data: {
      ...rest,
      traits: { connect: traitIds.map((id) => ({ id })) },
    },
  });
};

export const updateEquipment = async (
  { id }: Prisma.EquipmentWhereUniqueInput,
  equipmentToUpdate: EquipmentToUpdate,
  reactivate?: false
): Promise<Equipment | ErrorResult> => {
  const existing = await prisma.equipment.findUnique({
    select: { id: true, deletedAt: true },
    where: { id },
  });
  if (!existing || existing.deletedAt) {
    return { code: ErrorCode.NotFound, message: "Equipment Not Found" };
  }

  const { traitIds, ...rest } = equipmentToUpdate;

  if (traitIds !== undefined) {
    const traitError = await validateTraitIds(traitIds);
    if (traitError) return traitError;
  }

  const data: Prisma.EquipmentUncheckedUpdateInput = {
    ...rest,
    ...(traitIds !== undefined && {
      traits: { set: traitIds.map((traitId) => ({ id: traitId })) },
    }),
  };
  if (reactivate) {
    data.deletedAt = null;
  }
  return prisma.equipment.update({ where: { id }, data });
};

export const deleteEquipment = async ({
  id,
}: Prisma.EquipmentWhereUniqueInput): Promise<Equipment | ErrorResult> => {
  const existing = await prisma.equipment.findUnique({
    select: { deletedAt: true },
    where: { id },
  });
  if (!existing || existing.deletedAt) {
    return { code: ErrorCode.NotFound, message: "Equipment Not Found" };
  }
  return prisma.equipment.update({
    data: { deletedAt: new Date() },
    where: { id },
  });
};
