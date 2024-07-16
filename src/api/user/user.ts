import { Prisma, User, UserRole } from "@prisma/client";
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
import { CurrentUserAuthorization } from "../../middleware/security/authorization";
const subService = "user/service";

export const userSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  userName: true,
  userEmail: true,
  role: true,
};

export const userSearchArgs = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: userSelect,
});

export type UserSearchResult = Prisma.UserGetPayload<typeof userSearchArgs>;

type UserToUpdate = Pick<
  Prisma.UserUncheckedUpdateInput,
  "userName" | "userEmail" | "role"
>;

type UserSearchParams = Pick<
  Prisma.UserWhereInput,
  "userEmail" | "userName" | "role"
> & { isActive?: boolean };

export const searchUser = async (
  search: UserSearchParams,
  { skip, take }: PaginationOptions,
  sort?: string
): Promise<SearchResult<UserSearchResult> | ErrorResult> => {
  const { isActive, ...searchFilters } = search;
  const where: Prisma.UserWhereInput = {
    ...searchFilters,
  };

  if (search.isActive !== undefined) {
    where.deletedAt = !isActive ? { not: null } : null;
  }

  const orderBy = handleSort(sort);
  const items = await prisma.user.findMany({
    select: userSelect,
    skip,
    take,
    orderBy,
    where,
  });
  const count = await getQueryCount(prisma.user, where);

  logDebug({
    subService,
    message: `User Search found (${count}) results`,
    details: {
      count: count,
      filter: where,
    },
  });
  return { items, count };
};

export const getUser = async ({
  id,
}: Prisma.UserWhereUniqueInput): Promise<
  Omit<User, "password"> | ErrorResult
> => {
  const where: Prisma.UserWhereUniqueInput = {
    id,
  };
  const user = await prisma.user.findUniqueOrThrow({
    where,
    select: userSelect,
  });
  if (user) {
    logDebug({
      subService,
      message: "User Retrieved by Id",
      details: { user },
    });
  }
  return user;
};

export const updateUser = async (
  { id }: Prisma.UserWhereUniqueInput,
  { userName, userEmail, role }: UserToUpdate
): Promise<Omit<User, "password"> | ErrorResult> => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!user) {
    return {
      code: ErrorCode.NotFound,
      message: "User Not Found",
    };
  }

  const updatedUser = prisma.user.update({
    where: { id },
    select: userSelect,
    data: {
      userName,
      userEmail,
      role,
    },
  });

  return updatedUser;
};

export const deleteUser = async (
  { id }: Required<Pick<Prisma.UserWhereUniqueInput, "id">>,
  currentUser: CurrentUserAuthorization
) => {
  if (currentUser.role !== UserRole.Admin) {
    if (id !== currentUser.userId) {
      return {
        code: ErrorCode.Forbidden,
        message: "Forbidden",
      };
    }
  }
  const existingUser = await prisma.user.findUnique({
    select: {
      deletedAt: true,
    },
    where: {
      id,
    },
  });
  if (!existingUser || existingUser.deletedAt) {
    return {
      code: ErrorCode.NotFound,
      message: `User Not Found`,
    };
  }
  const data = {
    deletedAt: new Date(),
  };

  const deletedUser = await prisma.user.update({
    data,
    where: {
      id,
    },
  });

  return deletedUser;
};
