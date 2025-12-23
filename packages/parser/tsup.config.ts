import { defineConfig } from 'tsup';

export default defineConfig({
  dts: {
    tsconfig: './tsconfig.build.json',
    compilerOptions: {
      composite: false,
      incremental: false,
    },
  },
  clean: true,
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  outDir: 'dist',
  target: 'es2020',
  minify: true, // Enable minification
  sourcemap: 'inline',
  shims: true, // Enable shims for import.meta in CJS
});
