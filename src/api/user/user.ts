import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../integrations/prisma/prisma-client";
import { ErrorCode } from "../../utils/shared-types";

const LOCAL_SALT_ROUNDS = 10; //TODO pass this to config

type UserForInsert = Pick<
  Prisma.UserUncheckedCreateInput,
  "userName" | "userEmail" | "password"
>;

//TODO add password rules now it can be anything
export const insertUser = async ({
  userName,
  userEmail,
  password,
}: UserForInsert) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ userName }, { userEmail }],
    },
  });
  if (user) {
    return {
      code: ErrorCode.DataConflict,
      message: "User already has an active character with the same name",
    };
  }
  const hashedPassword = await bcrypt.hash(password, LOCAL_SALT_ROUNDS);
  const createdUser = prisma.user.create({
    data: {
      userName,
      userEmail,
      password: hashedPassword,
    },
  });

  return createdUser;
};
