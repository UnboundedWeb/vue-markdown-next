import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: {
    resolve: true,
    compilerOptions: {
      composite: false,
      rootDir: undefined,
    },
  },
  clean: true,
  sourcemap: true,
  external: ['vue', '@markdown-next/parser', '@markdown-next/shared'],
  splitting: false,
  treeshake: true,
  outDir: 'dist',
  target: 'es2020',
  platform: 'browser',
});
