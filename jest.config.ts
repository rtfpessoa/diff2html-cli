import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest/presets/default-esm',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  moduleFileExtensions: ['js', 'json', 'jsx', 'node', 'ts', 'tsx'],
  transform: {
    // '^.+\\.tsx?$' to process ts with `ts-jest`
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    '^.+\\.m?[tj]sx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts'],
  verbose: true,
  testEnvironment: 'node',
  coverageDirectory: './coverage',
  coverageProvider: 'v8',
  coverageReporters: ['lcov', 'text', 'html', 'json', 'cobertura', 'clover'],
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', 'src/__tests__/'],
  coverageThreshold: {
    global: {
      statements: 19,
      branches: 10,
      functions: 33,
      lines: 19,
    },
  },
};

export default jestConfig;
