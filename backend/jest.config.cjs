/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/test"],
  setupFiles: ["<rootDir>/test/setup.ts"],
  moduleNameMapper: {
    "^safer-buffer$": "<rootDir>/test/safer-buffer.ts",
  },
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { diagnostics: false }],
  },
  clearMocks: true,
};
