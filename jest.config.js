module.exports = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: './coverage',
  coverageReporters: ['lcov', 'text', 'html', 'json', 'cobertura', 'clover'],
  collectCoverageFrom: ['src/**/*.ts', '!src/__tests__/**', '!node_modules/**'],
  coverageThreshold: {
    global: {
      statements: 35,
      branches: 14,
      functions: 33,
      lines: 34,
    },
  },
};
