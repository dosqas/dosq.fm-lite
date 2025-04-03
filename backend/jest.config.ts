import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.jest.json";

export default {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["<rootDir>/jest.setup.js"],
  moduleDirectories: ["node_modules", "src"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths || {}, { prefix: "<rootDir>/" }),
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
  },
  testMatch: ["**/tests/**/*.test.ts"], // Only run tests in the "tests" directory
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.ts", // Include all TypeScript files in "src"
    "!src/app.ts", // Exclude app.ts
    "!src/data/songs.ts", // Exclude songs.ts
    "!src/**/*.d.ts", // Exclude TypeScript declaration files
  ],
  coverageDirectory: "<rootDir>/coverage",
  coverageReporters: ["text", "lcov"],
};