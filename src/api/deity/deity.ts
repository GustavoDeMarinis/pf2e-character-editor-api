import {
  Attribute,
  Deity,
  DeitySanctification,
  DivineFont,
  Prisma,
  Rarity,
} from "@prisma/client";
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

const subService = "deity/service";

export const deitySelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  name: true,
  description: true,
  rarity: true,
  edicts: true,
  anathema: true,
  divineAttributes: true,
  sanctification: true,
  divineFont: true,
  divineSkill: {
    select: {
      id: true,
      name: true,
    },
  },
  favoredWeapon: {
    select: {
      id: true,
      name: true,
    },
  },
  domains: {
    select: {
      id: true,
      name: true,
    },
  },
  alternateDomains: {
    select: {
      id: true,
      name: true,
    },
  },
  clericSpells: {
    select: {
      id: true,
      rank: true,
      spellId: true,
    },
  },
  traits: {
    select: {
      name: true,
      description: true,
    },
  },
};

export const deityArgs = Prisma.validator<Prisma.DeityDefaultArgs>()({
  select: deitySelect,
});

export type DeityResult = Prisma.DeityGetPayload<typeof deityArgs>;

type DeityToInsert = {
  name: string;
  description?: string | null;
  rarity: Rarity;
  edicts: string[];
  anathema: string[];
  divineAttributes: Attribute[];
  sanctification: DeitySanctification;
  divineFont: DivineFont;
  divineSkillId?: string | null;
  favoredWeaponId?: string | null;
  domainIds: string[];
  alternateDomainIds: string[];
  traitIds: string[];
};

type DeityToUpdate = {
  name?: string;
  description?: string | null;
  rarity?: Rarity;
  edicts?: string[];
  anathema?: string[];
  divineAttributes?: Attribute[];
  sanctification?: DeitySanctification;
  divineFont?: DivineFont;
  divineSkillId?: string | null;
  favoredWeaponId?: string | null;
  domainIds?: string[];
  alternateDomainIds?: string[];
  traitIds?: string[];
};

export const searchDeities = async (
  search: {
    name?: string;
    rarity?: Rarity;
    divineSkillId?: string;
    favoredWeaponId?: string;
    divineFont?: DivineFont;
    sanctification?: DeitySanctification;
    isActive?: boolean;
  },
  { skip, take }: PaginationOptions,
  sort?: string
): Promise<SearchResult<DeityResult> | ErrorResult> => {
  const { isActive, ...searchFilters } = search;
  const where: Prisma.DeityWhereInput = { ...searchFilters };

  if (isActive !== undefined) {
    where.deletedAt = !isActive ? { not: null } : null;
  }

  const orderBy = handleSort(sort);
  const items = await prisma.deity.findMany({
    select: deitySelect,
    skip,
    take,
    orderBy,
    where,
  });

  const count = await getQueryCount(prisma.deity, where);

  logDebug({
    subService,
    message: `Deity Search found (${count}) results`,
    details: { count, filter: where },
  });
  return { items, count };
};

export const getDeity = async ({
  id,
}: Required<Pick<Prisma.DeityWhereUniqueInput, "id">>): Promise<
  DeityResult | ErrorResult
> => {
  const deity = await prisma.deity.findUniqueOrThrow({
    where: { id },
    select: deitySelect,
  });
  logDebug({
    subService,
    message: "Deity Retrieved by Id",
    details: { deity },
  });
  return deity;
};

export const insertDeity = async (
  deityToInsert: DeityToInsert
): Promise<DeityResult | ErrorResult> => {
  const { domainIds, alternateDomainIds, traitIds, divineSkillId, favoredWeaponId, ...rest } =
    deityToInsert;

  if (divineSkillId) {
    const skill = await prisma.skill.findUnique({
      select: { id: true },
      where: { id: divineSkillId },
    });
    if (!skill) return { code: ErrorCode.NotFound, message: "Skill not found" };
  }

  if (favoredWeaponId) {
    const weapon = await prisma.weaponBase.findUnique({
      select: { id: true },
      where: { id: favoredWeaponId },
    });
    if (!weapon)
      return { code: ErrorCode.NotFound, message: "Weapon not found" };
  }

  for (const domainId of domainIds) {
    const domain = await prisma.domain.findUnique({
      select: { id: true },
      where: { id: domainId },
    });
    if (!domain)
      return { code: ErrorCode.NotFound, message: "Domain not found" };
  }

  for (const alternateDomainId of alternateDomainIds) {
    const domain = await prisma.domain.findUnique({
      select: { id: true },
      where: { id: alternateDomainId },
    });
    if (!domain)
      return { code: ErrorCode.NotFound, message: "Domain not found" };
  }

  const existing = await prisma.deity.findFirst({
    select: { id: true, deletedAt: true },
    where: { name: rest.name },
  });
  if (existing && !existing.deletedAt) {
    return {
      code: ErrorCode.DataConflict,
      message: "A deity with that name already exists",
    };
  }

  const data: Prisma.DeityUncheckedCreateInput = {
    ...rest,
    divineSkillId: divineSkillId ?? null,
    favoredWeaponId: favoredWeaponId ?? null,
    domains: { connect: domainIds.map((id) => ({ id })) },
    alternateDomains: { connect: alternateDomainIds.map((id) => ({ id })) },
    traits: { connect: traitIds.map((id) => ({ id })) },
  };

  return prisma.deity.create({ select: deitySelect, data });
};

export const updateDeity = async (
  { id }: Prisma.DeityWhereUniqueInput,
  deityToUpdate: DeityToUpdate,
  reactivate?: false
): Promise<Deity | ErrorResult> => {
  const existing = await prisma.deity.findUnique({
    select: { id: true, deletedAt: true },
    where: { id },
  });
  if (!existing || existing.deletedAt) {
    return { code: ErrorCode.NotFound, message: "Deity Not Found" };
  }

  const { domainIds, alternateDomainIds, traitIds, divineSkillId, favoredWeaponId, ...rest } =
    deityToUpdate;

  if (divineSkillId !== undefined && divineSkillId !== null) {
    const skill = await prisma.skill.findUnique({
      select: { id: true },
      where: { id: divineSkillId },
    });
    if (!skill) return { code: ErrorCode.NotFound, message: "Skill not found" };
  }

  if (favoredWeaponId !== undefined && favoredWeaponId !== null) {
    const weapon = await prisma.weaponBase.findUnique({
      select: { id: true },
      where: { id: favoredWeaponId },
    });
    if (!weapon)
      return { code: ErrorCode.NotFound, message: "Weapon not found" };
  }

  if (domainIds !== undefined) {
    for (const domainId of domainIds) {
      const domain = await prisma.domain.findUnique({
        select: { id: true },
        where: { id: domainId },
      });
      if (!domain)
        return { code: ErrorCode.NotFound, message: "Domain not found" };
    }
  }

  if (alternateDomainIds !== undefined) {
    for (const alternateDomainId of alternateDomainIds) {
      const domain = await prisma.domain.findUnique({
        select: { id: true },
        where: { id: alternateDomainId },
      });
      if (!domain)
        return { code: ErrorCode.NotFound, message: "Domain not found" };
    }
  }

  const data: Prisma.DeityUncheckedUpdateInput = {
    ...rest,
    ...(divineSkillId !== undefined && { divineSkillId }),
    ...(favoredWeaponId !== undefined && { favoredWeaponId }),
    ...(domainIds !== undefined && {
      domains: { set: domainIds.map((domainId) => ({ id: domainId })) },
    }),
    ...(alternateDomainIds !== undefined && {
      alternateDomains: {
        set: alternateDomainIds.map((domainId) => ({ id: domainId })),
      },
    }),
    ...(traitIds !== undefined && {
      traits: { set: traitIds.map((traitId) => ({ id: traitId })) },
    }),
  };

  if (reactivate) {
    data.deletedAt = null;
  }

  return prisma.deity.update({ where: { id }, data });
};

export const deleteDeity = async ({
  id,
}: Prisma.DeityWhereUniqueInput): Promise<Deity | ErrorResult> => {
  const existing = await prisma.deity.findUnique({
    select: { deletedAt: true },
    where: { id },
  });
  if (!existing || existing.deletedAt) {
    return { code: ErrorCode.NotFound, message: "Deity Not Found" };
  }
  return prisma.deity.update({
    data: { deletedAt: new Date() },
    where: { id },
  });
};
