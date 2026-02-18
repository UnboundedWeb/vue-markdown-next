import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['__tests__/e2e/**/*.test.ts'],
    environment: 'node',
    testTimeout: 180000,
    hookTimeout: 180000,
    maxWorkers: 1,
    minWorkers: 1,
  },
});
