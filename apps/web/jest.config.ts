import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['<rootDir>/src/store/workoutStore.test.ts'], // <--- ONLY RUN THIS TEST
  transformIgnorePatterns: [
    '/node_modules/(?!.*(uuid)).*/', // Transform uuid module and other ESM modules
  ],
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/app/(.*)$': '<rootDir>/src/app/$1',
    '^@/store/(.*)$': '<rootDir>/src/store/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    '^@/context/AuthContext$': '<rootDir>/src/context/__mocks__/AuthContext.tsx', // Add this line
    // Force a single instance of React
    '^react$': '<rootDir>/node_modules/react',
  },
  moduleDirectories: ['node_modules', '<rootDir>'],
};

export default createJestConfig(config);