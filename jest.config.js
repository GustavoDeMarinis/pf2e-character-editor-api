/** @type {import('jest').Config} */
module.exports = {
  clearMocks: true,
  setupFilesAfterEnv: ["<rootDir>/src/testing/mock-prisma.ts"],
  transformIgnorePatterns: ["node_modules/(?!(dot-prop)/)"],
  testEnvironment: "node",
  collectCoverageFrom: [
    "src/**/*.{ts,js}",
    "!src/swagger/**",
    "!**/node_modules/**",
  ],
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  maxWorkers: 4,
  workerIdleMemoryLimit: "500M",
};
