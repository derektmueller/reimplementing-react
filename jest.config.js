module.exports = {
  clearMocks: true,
  testEnvironment: "jsdom",
  testMatch: [
    "**/__tests__/**/*.test.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)"
  ],
  testPathIgnorePatterns: [
    "/features/"
  ],
};
