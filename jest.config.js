"use strict";

module.exports = {
  setupFiles: ["dotenv/config"],
  coverageDirectory: "<rootDir>/coverage",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "./tsconfig.json" }],
  },
  testMatch: ["**/*.spec.(ts|js)"],
};
