import { describe, expect, it } from 'vitest';
import { resolveBrowserWorkerURL } from '../src/modules/parser.workerPool';

describe('resolveBrowserWorkerURL', () => {
  it('falls back to package dist worker path when module url is in vite optimized deps', () => {
    const viteOptimizedModuleUrl =
      'http://localhost:5173/node_modules/.vite/deps/@markdown-next_parser.js?v=4b2f8f2d';

    const resolved = resolveBrowserWorkerURL(viteOptimizedModuleUrl);

    expect(resolved.href).toBe(
      'http://localhost:5173/node_modules/@markdown-next/parser/dist/modules/parser.worker.mjs'
    );
  });

  it('keeps relative worker resolution for normal package dist module url', () => {
    const packageDistModuleUrl =
      'http://localhost:5173/node_modules/@markdown-next/parser/dist/index.mjs?v=4b2f8f2d';

    const resolved = resolveBrowserWorkerURL(packageDistModuleUrl);

    expect(resolved.href).toBe(
      'http://localhost:5173/node_modules/@markdown-next/parser/dist/modules/parser.worker.mjs'
    );
  });

  it('works with file protocol module url (edge case)', () => {
    const fileModuleUrl = 'file:///Users/test/project/packages/parser/dist/index.mjs';

    const resolved = resolveBrowserWorkerURL(fileModuleUrl);

    expect(resolved.href).toBe(
      'file:///Users/test/project/packages/parser/dist/modules/parser.worker.mjs'
    );
  });
});
