import { defineConfig } from 'tsup';

export default defineConfig({
  dts: true,
  clean: true,
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  outDir: 'dist',
  target: 'es2020',
  minify: true, // 禁用压缩
  sourcemap: 'inline',
});
