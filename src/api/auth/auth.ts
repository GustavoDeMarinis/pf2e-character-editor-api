import { Prisma, User, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import { Response } from "express";
import prisma from "../../integrations/prisma/prisma-client";
import { ErrorCode, ErrorResult } from "../../utils/shared-types";
import { PASSWORDREGEX } from "../../utils/regexs";
import {
  CurrentUserAuthorization,
  jwtSign,
} from "../../middleware/security/authorization";

const LOCAL_SALT_ROUNDS = 10; //TODO pass this to config

export const userSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  userName: true,
  userEmail: true,
  role: true,
};

type AuthUsingEmailParams = Pick<
  Prisma.UserUncheckedCreateInput,
  "userEmail" | "password"
> & { userName?: string };

type AuthUsingUserNameParams = Pick<
  Prisma.UserUncheckedCreateInput,
  "userName" | "password"
> & { userEmail?: string };

type SignUpParams = Pick<
  Prisma.UserUncheckedCreateInput,
  "userName" | "userEmail" | "password" | "role"
>;

export const signUp = async (
  userToInsert: SignUpParams
): Promise<Omit<User, "password"> | ErrorResult> => {
  if (!PASSWORDREGEX.test(userToInsert.password)) {
    return {
      code: ErrorCode.BadRequest,
      message:
        "Password should have at least one special character, one number and be at least 8 character long",
    };
  }
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { userName: userToInsert.userName },
        { userEmail: userToInsert.userEmail },
      ],
    },
  });
  if (user) {
    return {
      code: ErrorCode.DataConflict,
      message: "User already has an active character with the same name",
    };
  }
  const hashedPassword = await bcrypt.hash(
    userToInsert.password,
    LOCAL_SALT_ROUNDS
  );
  const createdUser = prisma.user.create({
    select: userSelect,
    data: {
      userName: userToInsert.userName,
      userEmail: userToInsert.userEmail,
      role: userToInsert.role,
      password: hashedPassword,
    },
  });

  return createdUser;
};

export const signIn = async (
  res: Response,
  userToAuthenticate: AuthUsingEmailParams | AuthUsingUserNameParams
): Promise<Pick<User, "id"> | ErrorResult> => {
  if (!PASSWORDREGEX.test(userToAuthenticate.password)) {
    return {
      code: ErrorCode.Forbidden,
      message: "Forbidden", //Improve message
    };
  }
  const user = await prisma.user.findFirst({
    select: {
      id: true,
      role: true,
      password: true,
    },
    where: {
      OR: [
        { userName: userToAuthenticate.userName },
        { userEmail: userToAuthenticate.userEmail },
      ],
    },
  });
  if (!user) {
    return {
      code: ErrorCode.Forbidden,
      message: "Forbidden",
    };
  }
  const isValidPassword = await bcrypt.compare(
    userToAuthenticate.password,
    user.password
  );
  if (!isValidPassword) {
    return {
      code: ErrorCode.Forbidden,
      message: "Forbidden",
    };
  }
  jwtSign(res, { userId: user.id, role: user.role });
  const { password, ...publicUser } = user;
  return { ...publicUser };
};

export const changePassword = async (
  { id }: Prisma.UserWhereUniqueInput,
  currentUser: CurrentUserAuthorization,
  oldPassword: string,
  newPassword: string
): Promise<void | ErrorResult> => {
  const user = await prisma.user.findUnique({
    select: {
      id: true,
      password: true,
    },
    where: { id },
  });
  if (!user) {
    return {
      code: ErrorCode.NotFound,
      message: "User Not Found",
    };
  }
  if (currentUser.role !== UserRole.Admin) {
    if (user.id !== currentUser.userId) {
      return {
        code: ErrorCode.Forbidden,
        message: "Forbidden",
      };
    }
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);

    if (!isValidPassword) {
      return {
        code: ErrorCode.Forbidden,
        message: "Forbidden",
      };
    }
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        password: newPassword,
      },
    });
  }
  await prisma.user.update({
    where: {
      id,
    },
    data: {
      password: newPassword,
    },
  });
};
