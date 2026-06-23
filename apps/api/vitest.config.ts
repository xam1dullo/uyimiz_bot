import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{ts,js}'],
    exclude: ['dist/**', 'node_modules/**'],
    coverage: {
      provider: 'v8',
      include: ['src/modules/**/domain/**', 'src/modules/**/application/**'],
      exclude: ['**/*.test.*', '**/*.spec.*', '**/__tests__/**'],
    },
  },
});
