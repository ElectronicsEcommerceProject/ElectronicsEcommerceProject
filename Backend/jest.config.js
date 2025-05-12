export default {
  testEnvironment: "node",
  transform: {}, // No transformations needed since we're using ES modules
  setupFiles: ["dotenv/config"], // Load environment variables before Jest initialization
  setupFilesAfterEnv: ["./jest.setup.js"], // Run after Jest is initialized, so jest object is available
  testMatch: ["**/__tests__/**/*.test.js"],
  verbose: true,
  forceExit: true, // Force Jest to exit after all tests complete
  clearMocks: true,
  resetMocks: false,
  restoreMocks: true,
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^(\\.{1,2}/.*)\\.js$": "$1" // This helps with ES module imports
  },
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  testTimeout: 30000 // Global timeout for all tests (preferred over jest.setTimeout)
};