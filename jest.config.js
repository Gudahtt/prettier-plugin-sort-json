module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['./src/**.ts'],
  coverageReporters: ['text', 'html'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'jsx', 'tsx', 'node'],
  preset: 'ts-jest',
  resetMocks: true,
  restoreMocks: true,
  testEnvironment: 'node',
  testRegex: ['\\.test\\.ts$'],
  testTimeout: 2500,
};
