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
    resources: 'usable'
  },
  setupFiles: ['<rootDir>/test-setup.js'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json'
    }
  },
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    './assets/**/*.{ts,tsx}',
    '!./assets/**/*.d.{ts,tsx}',
    '!./assets/index.tsx',
    '!**/node_modules/**',
    '!**/test/**'
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png)$': '<rootDir>/test/mock/file.ts',
    '\\.p?css$': 'identity-obj-proxy',
    'node-vibrant': '<rootDir>/test/mock/vibrant.ts',
    electron: '<rootDir>/test/mock/electron.ts',
    mousetrap: '<rootDir>/test/mock/mousetrap.ts',
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' })
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testMatch: ['<rootDir>/**/*.test.(ts|tsx)', '<rootDir>/**/test.(ts|tsx)']
};
