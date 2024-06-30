import { PrismaClient } from "@prisma/client";
import { seedLocal } from "./seeders/local/local-seed";

const prisma = new PrismaClient();

const main = async () => {
  seedLocal();
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
