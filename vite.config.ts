import { defineConfig } from 'vitest/config';

export default defineConfig({
  server: {
    port: 3010,
  },
  test: {
    environment: 'jsdom',
  },
});
