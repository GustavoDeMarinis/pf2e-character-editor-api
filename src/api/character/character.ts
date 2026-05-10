import { Prisma, UserRole } from "@prisma/client";
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
import { isOwner } from "../../middleware/security/authorization";

type CallerAuth = {
  userId: string;
  role: UserRole;
};

const subService = "character/service";

export const characterSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  characterName: true,
  assignedUser: {
    select: {
      id: true,
      userName: true,
    },
  },
  createdByUser: {
    select: {
      id: true,
      userName: true,
    },
  },
  ancestry: {
    select: {
      name: true,
    },
  },
  characterClass: {
    select: {
      className: true,
      keyAttributes: true,
      hitPoints: true,
    },
  },
  background: {
    select: {
      id: true,
      name: true,
    },
  },
  ancestryBoost: true,
  ancestryFlaw: true,
  backgroundBoost: true,
  classBoost: true,
  level: true,
  heritage: {
    select: {
      id: true,
      name: true,
    },
  },
  deity: {
    select: {
      id: true,
      name: true,
    },
  },
};

export const characterArgs = Prisma.validator<Prisma.CharacterDefaultArgs>()({
  select: characterSelect,
});

export type CharacterResult = Prisma.CharacterGetPayload<typeof characterArgs>;

type CharacterToInsert = Pick<
  Prisma.CharacterUncheckedCreateInput,
  | "characterName"
  | "ancestryId"
  | "backgroundId"
  | "createdByUserId"
  | "assignedUserId"
  | "level"
  | "characterClassId"
  | "ancestryBoost"
  | "ancestryFlaw"
  | "backgroundBoost"
  | "classBoost"
  | "languages"
  | "classDc"
  | "heritageId"
  | "deityId"
>;

export const searchCharacters = async (
  search: {
    userCreatorName?: string;
    userAssignedName?: string;
    characterClassName?: string;
    isActive?: boolean;
  },
  { skip, take }: PaginationOptions,
  sort?: string,
  callerAuth?: CallerAuth
): Promise<SearchResult<CharacterResult> | ErrorResult> => {
  const { isActive, userAssignedName, userCreatorName, characterClassName } = search;
  const where: Prisma.CharacterWhereInput = {
    assignedUser: {
      userName: userAssignedName,
    },
    createdByUser: {
      userName: userCreatorName,
    },
    characterClass: {
      className: characterClassName,
    },
  };

  if (search.isActive !== undefined) {
    where.deletedAt = !isActive ? { not: null } : null;
  }

  if (callerAuth && callerAuth.role !== UserRole.Admin) {
    where.OR = [
      { createdByUserId: callerAuth!.userId },
      { assignedUserId: callerAuth!.userId },
    ];
  }

  const orderBy = handleSort(sort);
  const items = await prisma.character.findMany({
    select: characterSelect,
    skip,
    take,
    orderBy,
    where,
  });
  const count = await getQueryCount(prisma.character, where);

  logDebug({
    subService,
    message: `Character Search found (${count}) results`,
    details: {
      count: count,
      filter: where,
    },
  });
  return { items, count };
};

export const getCharacter = async (
  { id }: Required<Pick<Prisma.CharacterWhereUniqueInput, "id">>,
  callerAuth?: CallerAuth
): Promise<CharacterResult | ErrorResult> => {
  if (callerAuth && callerAuth.role !== UserRole.Admin) {
    const ownership = await prisma.character.findUnique({
      select: { createdByUserId: true, assignedUserId: true },
      where: { id },
    });
    if (!ownership || !isOwner(ownership, callerAuth.userId)) {
      return {
        code: ErrorCode.Forbidden,
        message: "Access denied",
      }
    }
  }

  const character = await prisma.character.findUniqueOrThrow({
    where: { id },
    select: characterSelect,
  });

  logDebug({
    subService,
    message: "Character Retrieved by Id",
    details: { character },
  });
  return character;
};

export const insertCharacter = async (
  characterToInsert: CharacterToInsert,
  callerAuth?: CallerAuth
): Promise<CharacterResult | ErrorResult> => {
  if (callerAuth && callerAuth.role !== UserRole.Admin) {
    characterToInsert = {
      ...characterToInsert,
      createdByUserId: callerAuth!.userId,
      assignedUserId: callerAuth!.userId,
    };
  }
  if (characterToInsert.heritageId) {
    const heritage = await prisma.heritage.findUnique({
      select: { ancestryId: true },
      where: { id: characterToInsert.heritageId },
    });
    if (!heritage) {
      return { code: ErrorCode.NotFound, message: "Heritage not found" };
    }
    if (heritage.ancestryId !== characterToInsert.ancestryId) {
      return {
        code: ErrorCode.BadRequest,
        message: "Heritage does not belong to the selected ancestry",
      };
    }
  }

  if (characterToInsert.backgroundId) {
    const background = await prisma.background.findUnique({
      select: { id: true },
      where: { id: characterToInsert.backgroundId },
    });
    if (!background) {
      return { code: ErrorCode.NotFound, message: "Background not found" };
    }
  }

  if (characterToInsert.deityId) {
    const deity = await prisma.deity.findUnique({
      select: { id: true },
      where: { id: characterToInsert.deityId as string },
    });
    if (!deity) {
      return { code: ErrorCode.NotFound, message: "Deity not found" };
    }
  }

  const existingCharacters = await prisma.character.findMany({
    select: {
      id: true,
      deletedAt: true,
      characterName: true,
      createdByUserId: true,
    },
    where: {
      AND: [
        {
          characterName: characterToInsert.characterName,
        },
        {
          createdByUserId: characterToInsert.createdByUserId,
        },
      ],
    },
  });
  const activeCharacters = existingCharacters.find(
    (character) => character.deletedAt === null
  );

  if (activeCharacters) {
    return {
      code: ErrorCode.DataConflict,
      message: "User already has an active character with the same name",
    };
  }

  const createdCharacter = prisma.character.create({
    select: characterSelect,
    data: {
      ...characterToInsert,
    },
  });

  return createdCharacter;
};

export const updateCharacter = async (
  { id }: Prisma.CharacterWhereUniqueInput,
  characterToUpdate: Pick<
    Prisma.CharacterUncheckedUpdateInput,
    | "characterName"
    | "ancestryId"
    | "backgroundId"
    | "createdByUserId"
    | "assignedUserId"
    | "level"
    | "characterClassId"
    | "ancestryBoost"
    | "ancestryFlaw"
    | "backgroundBoost"
    | "classBoost"
    | "languages"
    | "classDc"
    | "heritageId"
    | "deityId"
  >,
  reactivate?: false,
  callerAuth?: CallerAuth
) => {
  if (callerAuth && callerAuth.role !== UserRole.Admin) {
    const existing = await prisma.character.findUnique({
      select: { createdByUserId: true, assignedUserId: true },
      where: { id },
    });
    if (!existing) {
      return { code: ErrorCode.NotFound, message: "Character not found" };
    }
    if (!isOwner(existing, callerAuth.userId)) {
      return {
        code: ErrorCode.Forbidden,
        message: "Access denied",
      }
    }
    delete characterToUpdate.createdByUserId;
    delete characterToUpdate.assignedUserId;
  }

  if (characterToUpdate.backgroundId) {
    const background = await prisma.background.findUnique({
      select: { id: true },
      where: { id: characterToUpdate.backgroundId as string },
    });
    if (!background) {
      return { code: ErrorCode.NotFound, message: "Background not found" };
    }
  }

  if (characterToUpdate.deityId) {
    const deity = await prisma.deity.findUnique({
      select: { id: true },
      where: { id: characterToUpdate.deityId as string },
    });
    if (!deity) {
      return { code: ErrorCode.NotFound, message: "Deity not found" };
    }
  }

  if (characterToUpdate.heritageId) {
    const heritageId = characterToUpdate.heritageId as string;
    const current = await prisma.character.findUnique({
      select: { ancestryId: true },
      where: { id },
    });
    const targetAncestryId =
      (characterToUpdate.ancestryId as string | undefined) ?? current?.ancestryId;
    if (targetAncestryId) {
      const heritage = await prisma.heritage.findUnique({
        select: { ancestryId: true },
        where: { id: heritageId },
      });
      if (!heritage) {
        return { code: ErrorCode.NotFound, message: "Heritage not found" };
      }
      if (heritage.ancestryId !== targetAncestryId) {
        return {
          code: ErrorCode.BadRequest,
          message: "Heritage does not belong to the selected ancestry",
        };
      }
    }
  }

  const data: Prisma.CharacterUncheckedUpdateInput = { ...characterToUpdate };
  if (reactivate) {
    data.deletedAt = null;
  }

  const updatedCharacter = await prisma.character.update({
    where: { id },
    data,
  });

  return updatedCharacter;
};

export const deleteCharacter = async (
  { id }: Required<Pick<Prisma.CharacterWhereUniqueInput, "id">>,
  callerAuth?: CallerAuth
) => {
  const existingCharacter = await prisma.character.findUnique({
    select: { deletedAt: true, createdByUserId: true, assignedUserId: true },
    where: { id },
  });
  if (!existingCharacter || existingCharacter.deletedAt) {
    return { code: ErrorCode.NotFound, message: "Character Not Found" };
  }

  if (callerAuth && callerAuth.role !== UserRole.Admin && !isOwner(existingCharacter, callerAuth.userId)) {
    return  {
        code: ErrorCode.Forbidden,
        message: "Access denied",
      };
  }
  const data = {
    deletedAt: new Date(),
  };

  const deletedCharacter = await prisma.character.update({
    data,
    where: {
      id,
    },
  });

  return deletedCharacter;
};
