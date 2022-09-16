module.exports = {
  testEnvironment: 'jest-environment-node',
  moduleFileExtensions: [
    'js',
    'jsx',
    'json',
    'ts',
    'tsx'
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!**/node_modules/**',
    '!**/build/**',
    '!**/coverage/**'
  ],
  transform: {
    '\\.ts$': 'ts-jest',
    '\\.js$': 'ts-jest'
  },
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50
    }
  },
  coverageReporters: [
    'text',
    'text-summary'
  ],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(js|ts)x?$',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/build/',
    '/coverage/'
  ],
  moduleNameMapper: {
    '^lodash-es$': 'lodash'
  },
  setupFiles: ['dotenv/config']
}
