import { defineConfig } from 'tsup';

export default defineConfig({
  dts: true,
  clean: true,
  entry: ['src/index.ts'],
  format: ['esm'],
  outDir: 'dist',
  target: 'es2020',
  minify: true, // Enable minification
  sourcemap: 'inline',
  shims: true, // Enable shims for import.meta in CJS
  tsconfig: './tsconfig.build.json',
  splitting: false,
});
