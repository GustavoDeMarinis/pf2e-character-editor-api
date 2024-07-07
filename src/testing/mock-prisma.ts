import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";

import prisma from "../integrations/prisma/prisma-client";

jest.mock("../integrations/prisma/prisma-client", () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
  // Default mock $transaction
  prismaMock.$transaction.mockImplementation(async (callbackOrArray) => {
    if (callbackOrArray instanceof Function) {
      return await callbackOrArray(prismaMock);
    } else {
      return [];
    }
  });
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
