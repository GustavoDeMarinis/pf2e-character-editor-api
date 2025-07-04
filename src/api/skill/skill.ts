import { Skill, Prisma, Attribute } from "@prisma/client";
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

const subService = "character/service";

export const skillSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  name: true,
  description: true,
  associatedAttribute: true,
  actions: {
    select: {
      name: true,
      description: true,
      traits: {
        select: {
          name: true,
        },
      },
    },
  },
};

export const skillArgs = Prisma.validator<Prisma.SkillDefaultArgs>()({
  select: skillSelect,
});

export type SkillResult = Prisma.SkillGetPayload<typeof skillArgs>;

type SkillToInsert = Pick<
  Prisma.SkillUncheckedCreateInput,
  "name" | "description" | "associatedAttribute"
>;

export const searchSkill = async (
  search: {
    associatedAttribute?: Attribute;
    isActive?: boolean;
  },
  { skip, take }: PaginationOptions,
  sort?: string
): Promise<SearchResult<SkillResult> | ErrorResult> => {
  const { isActive, ...searchFilters } = search;
  const where: Prisma.SkillWhereInput = {
    ...searchFilters,
  };

  if (search.isActive !== undefined) {
    where.deletedAt = !isActive ? { not: null } : null;
  }
  const orderBy = handleSort(sort);
  const items = await prisma.skill.findMany({
    select: skillSelect,
    skip,
    take,
    orderBy,
    where,
  });
  const count = await getQueryCount(prisma.skill, where);

  logDebug({
    subService,
    message: `Skill Search found (${count}) results`,
    details: {
      count: count,
      filter: where,
    },
  });
  return { items, count };
};

export const getSkill = async ({
  id,
}: Required<Pick<Prisma.SkillWhereUniqueInput, "id">>): Promise<
  SkillResult | ErrorResult
> => {
  const where: Prisma.SkillWhereUniqueInput = {
    id,
  };
  const skill = await prisma.skill.findUniqueOrThrow({
    where,
    select: skillSelect,
  });
  if (skill) {
    logDebug({
      subService,
      message: "Skill Retrieved by Id",
      details: { skill },
    });
  }
  return skill;
};

export const insertSkill = async (
  skillToInsert: SkillToInsert
): Promise<SkillResult | ErrorResult> => {
  const existingSkills = await prisma.skill.findMany({
    select: {
      id: true,
      deletedAt: true,
      name: true,
    },
    where: {
      AND: [
        {
          name: skillToInsert.name,
        },
      ],
    },
  });
  const activeSkills = existingSkills.find((skill) => skill.deletedAt === null);

  if (activeSkills) {
    return {
      code: ErrorCode.DataConflict,
      message: "There is already an active skill with the same name",
    };
  }

  const createdSkill = prisma.skill.create({
    select: skillSelect,
    data: {
      ...skillToInsert,
    },
  });

  return createdSkill;
};

export const updateSkill = async (
  { id }: Prisma.SkillWhereUniqueInput,
  skillToUpdate: Pick<
    Prisma.SkillUncheckedUpdateInput,
    "name" | "description" | "associatedAttribute"
  >,
  reactivate?: false
) => {
  const data: Prisma.SkillUncheckedUpdateInput = {
    ...skillToUpdate,
  };
  if (reactivate) {
    data.deletedAt = null;
  }

  const updatedSkill = await prisma.skill.update({
    where: { id },
    data,
  });

  return updatedSkill;
};

export const deleteSkill = async ({
  id,
}: Required<Pick<Prisma.SkillWhereUniqueInput, "id">>) => {
  const existingSkill = await prisma.skill.findUnique({
    select: {
      deletedAt: true,
    },
    where: {
      id,
    },
  });
  if (!existingSkill || existingSkill.deletedAt) {
    return {
      code: ErrorCode.NotFound,
      message: `Skill Not Found`,
    };
  }
  const data = {
    deletedAt: new Date(),
  };

  const deletedSkill = await prisma.skill.update({
    data,
    where: {
      id,
    },
  });

  return deletedSkill;
};
