import { Prisma, User } from "@prisma/client";
import prisma from "../../integrations/prisma/prisma-client";
import { ErrorCode, ErrorResult } from "../../utils/shared-types";

export const userSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  userName: true,
  userEmail: true,
  role: true,
};

type UserToUpdate = Pick<
  Prisma.UserUncheckedUpdateInput,
  "userName" | "userEmail" | "role"
>;

export const updateUser = async (
  { id }: Prisma.UserWhereUniqueInput,
  { userName, userEmail, role }: UserToUpdate
): Promise<Omit<User, "password"> | ErrorResult> => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });
  if (!user) {
    return {
      code: ErrorCode.NotFound,
      message: "User not found",
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
