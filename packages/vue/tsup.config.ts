import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: {
    resolve: true,
    compilerOptions: {
      composite: false,
      rootDir: undefined,
    },
  },
  clean: true,
  sourcemap: false,
  external: ['vue', '@markdown-next/parser', '@markdown-next/shared'],
  splitting: false,
  treeshake: true,
  outDir: 'dist',
  outExtension: () => ({ js: '.js' }),
  target: 'es2020',
  platform: 'browser',
});
