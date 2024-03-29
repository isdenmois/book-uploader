module.exports = {
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
  testEnvironment: 'node',
  transformIgnorePatterns: ['node_modules/(?!nanostores|@nanostores|.pnpm/nanostores)'],
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/__mocks__/style-mock.js',
    'shared/(.*)': '<rootDir>/src/shared/$1',
    '^features/(.*)': '<rootDir>/src/features/$1',
    '^entities/(.*)': '<rootDir>/src/entities/$1',
    '^pages/(.*)': '<rootDir>/src/pages/$1',
    'solid-js/web': '<rootDir>/node_modules/solid-js/web/dist/web.cjs',
    'solid-js': '<rootDir>/node_modules/solid-js/dist/solid.cjs',
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coveragePathIgnorePatterns: ['node_modules', 'src/app/index.tsx', 'src/shared/test-utils'],
}
