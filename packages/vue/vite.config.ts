import { defineConfig } from 'vite';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [vueJsx()],
  sourceMap: false,
  build: {
    sourcemap: false,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'MarkdownNextVue',
      formats: ['es'],
      fileName: (format) => (format === 'es' ? 'index.mjs' : 'index.cjs'),
    },
    rollupOptions: {
      external: ['vue', '@markdown-next/parser', 'hast-util-to-jsx-runtime'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
});
