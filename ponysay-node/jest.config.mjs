/**
 * @type {import('jest').Config}
 */
export default {
  testMatch: [
    '<rootDir>/src/__tests__/**/*.test.mjs',
    '<rootDir>/src/__tests__/**/*.test.js'
  ],
  testEnvironment: 'node',
  transform: { '^.+\\.mjs$': 'babel-jest' },
  globals: {
    'jest': {
      useESM: true
    }
  }
};