module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleDirectories: ["node_modules", "src"],
    transform: {
      "^.+\\.tsx?$": "ts-jest",
    },
    globals: {
      "ts-jest": {
        tsconfig: "tsconfig.jest.json",
      },
    },
  };