/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'node',
  verbose: true,
  globalSetup: './scripts/init-tests.ts',
  globalTeardown: './scripts/close-tests.ts',
  transform: {
    '^.+.tsx?$': ['ts-jest',{}],
  },
  moduleNameMapper: {
    '^@constants/(.*)$': '<rootDir>/src/constants/$1',
    '^@functions/(.*)$': '<rootDir>/src/functions/$1',
    '^@models/(.*)$': '<rootDir>/src/db/models/$1',
    '^@resolvers/(.*)$': '<rootDir>/src/graphql/resolvers/$1',
    '^@schemas/(.*)$': '<rootDir>/src/graphql/schemas/$1',
    '^@interfaces/(.*)$': '<rootDir>/src/interfaces/$1'
  }
};