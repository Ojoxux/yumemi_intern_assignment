import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
    'process.env': {
      VITE_REACT_APP_RESAS_API_KEY: 'test-api-key'
    }
  },
};

export default config;
