import { Prisma } from "@prisma/client";
import prisma from "../../../src/integrations/prisma/prisma-client";
import { handlePasswordEncription } from "../../../src/api/auth/auth";
import { config } from "../../../src/config";

export const UserIds = {
  GustavoDm: "clyxamy1s00003wzugl1g7f98",
  adminUserRole: "clyxamy1t00013wzu79jl4lqd",
  playerUserRole: "clyxamy1t00023wzu84z61ky2",
};
const buildLocalUsers = async (): Promise<
  Prisma.UserUncheckedCreateInput[]
> => {
  const users: Prisma.UserUncheckedCreateInput[] = [
    {
      id: UserIds.adminUserRole,
      userName: "adminRoleUser",
      userEmail: "adminRoleUser@gmail.com",
      password: await handlePasswordEncription(config.USER_DEFAULT_PASSWORD),
      role: "Admin",
    },
    {
      id: UserIds.playerUserRole,
      userName: "playerRoleUser",
      userEmail: "playerRoleUser@gmail.com",
      password: await handlePasswordEncription(config.USER_DEFAULT_PASSWORD),
    },
    {
      id: UserIds.GustavoDm,
      userName: "GustavoDm",
      userEmail: "gustavodm@gmail.com",
      password: await handlePasswordEncription(config.USER_DEFAULT_PASSWORD),
      role: "Admin",
    },
  ];

  return users;
};

export const seedLocalUsers = async (): Promise<{
  users: Prisma.UserCreateManyInput[];
}> => {
  const users: Prisma.UserCreateManyInput[] = await buildLocalUsers();
  await prisma.user.createMany({
    data: users,
  });

  return { users };
};
