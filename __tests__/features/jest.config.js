module.exports = {
  clearMocks: true,
  preset: "jest-puppeteer",
  setupFilesAfterEnv: ['./setupTestFramework.js'],
  testMatch: [
    "**/__tests__/features/**/*.test.[jt]s?(x)",
  ],
};
