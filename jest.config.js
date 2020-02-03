const { pathsToModuleNameMapper } = require('ts-jest/utils');
// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
const { compilerOptions } = require('./tsconfig.json');
module.exports = {
  preset: 'ts-jest',
  // testEnvironment: 'node',
  // testEnvironment: '@jest-runner/electron/environment',
  // runner: '@jest-runner/electron',
  testEnvironmentOptions: {
    resources: 'usable',
  },
  // setupFiles: ['<rootDir>/test-setup.js'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json'
    }
  },
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    './assets/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/test/**'
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png)$': '<rootDir>/test/mock/file.ts',
    '\\.pcss$': 'identity-obj-proxy',
    'node-vibrant': '<rootDir>/test/mock/vibrant.ts',
    'electron': "<rootDir>/test/mock/electron.ts",
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' })
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testMatch: ['<rootDir>assets/**/test.(ts|tsx|js)']
};
