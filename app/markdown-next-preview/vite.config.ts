import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    // Prefer worker condition to avoid DOM-only exports in web workers.
    conditions: ['worker', 'browser', 'module', 'import', 'default'],
  },
});
