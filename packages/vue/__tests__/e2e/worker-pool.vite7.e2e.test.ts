import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { once } from 'node:events';
import { request } from 'node:http';
import { createServer } from 'node:net';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { chromium, type Browser, type Page } from 'playwright';

const TEST_HOST = '127.0.0.1';
const SERVER_READY_TIMEOUT = 120000;
const KNOWN_BUG_ERROR_PATTERNS = [
  'Extraneous non-emits event listeners (ready)',
  'The file does not exist at',
  'document is not defined',
  '/.vite/deps/modules/parser.worker.mjs',
];

const currentDir = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(currentDir, '../../../../');

let browser: Browser;
let devServer: ChildProcessWithoutNullStreams;
let serverPort = 0;
let baseUrl = '';
const serverLogs: string[] = [];

function runPnpm(args: string[]): Promise<string> {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn('pnpm', args, {
      cwd: workspaceRoot,
      stdio: 'pipe',
      env: { ...process.env, FORCE_COLOR: '0' },
    });

    let output = '';
    child.stdout.on('data', (chunk) => {
      output += chunk.toString();
    });
    child.stderr.on('data', (chunk) => {
      output += chunk.toString();
    });

    child.on('error', rejectPromise);
    child.on('close', (code) => {
      if (code === 0) {
        resolvePromise(output);
      } else {
        rejectPromise(new Error(`Command failed: pnpm ${args.join(' ')}\n${output}`));
      }
    });
  });
}

function getRandomPort(): Promise<number> {
  return new Promise((resolvePromise, rejectPromise) => {
    const server = createServer();
    server.on('error', rejectPromise);
    server.listen(0, TEST_HOST, () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        server.close();
        rejectPromise(new Error('Failed to resolve an available port.'));
        return;
      }

      const port = address.port;
      server.close((closeError) => {
        if (closeError) rejectPromise(closeError);
        else resolvePromise(port);
      });
    });
  });
}

function probeHttp(url: string): Promise<void> {
  return new Promise((resolvePromise, rejectPromise) => {
    const req = request(url, (res) => {
      res.resume();
      if (res.statusCode && res.statusCode >= 200 && res.statusCode < 500) {
        resolvePromise();
      } else {
        rejectPromise(new Error(`Unexpected status code: ${res.statusCode}`));
      }
    });

    req.on('error', rejectPromise);
    req.end();
  });
}

async function waitForServer(url: string, timeoutMs: number): Promise<void> {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      await probeHttp(url);
      return;
    } catch {
      await delay(250);
    }
  }

  throw new Error(`Vite server did not become ready in ${timeoutMs}ms.\n${serverLogs.join('')}`);
}

async function stopDevServer(): Promise<void> {
  if (!devServer || devServer.killed) return;

  devServer.kill('SIGTERM');

  const exitPromise = once(devServer, 'exit');
  const timeoutPromise = delay(5000).then(() => {
    if (devServer.exitCode === null) devServer.kill('SIGKILL');
  });

  await Promise.race([exitPromise, timeoutPromise]);
}

function trackRuntimeErrors(page: Page): string[] {
  const runtimeErrors: string[] = [];

  page.on('console', (message) => {
    const type = message.type();
    if (type === 'error' || type === 'warning') {
      runtimeErrors.push(`[console:${type}] ${message.text()}`);
    }
  });

  page.on('pageerror', (error) => {
    runtimeErrors.push(`[pageerror] ${error.message}`);
  });

  return runtimeErrors;
}

function expectNoKnownBugErrors(runtimeErrors: string[]): void {
  const matched = runtimeErrors.filter((line) =>
    KNOWN_BUG_ERROR_PATTERNS.some((pattern) => line.includes(pattern))
  );
  expect(matched).toEqual([]);
}

describe('vite7 worker pool e2e', () => {
  beforeAll(async () => {
    await runPnpm(['--filter', '@markdown-next/parser', 'build']);
    await runPnpm(['--filter', '@markdown-next/vue', 'build']);
    await runPnpm(['--filter', '@markdown-next/vue', 'exec', 'playwright', 'install', 'chromium']);

    serverPort = await getRandomPort();
    baseUrl = `http://${TEST_HOST}:${serverPort}`;

    devServer = spawn(
      'pnpm',
      [
        '--filter',
        'markdown-next-preview',
        'exec',
        'vite',
        '--host',
        TEST_HOST,
        '--port',
        String(serverPort),
        '--strictPort',
      ],
      {
        cwd: workspaceRoot,
        stdio: 'pipe',
        env: { ...process.env, FORCE_COLOR: '0' },
      }
    );

    devServer.stdout.on('data', (chunk) => {
      serverLogs.push(chunk.toString());
    });
    devServer.stderr.on('data', (chunk) => {
      serverLogs.push(chunk.toString());
    });

    await waitForServer(baseUrl, SERVER_READY_TIMEOUT);
    browser = await chromium.launch({ headless: true });
  });

  afterAll(async () => {
    if (browser) await browser.close();
    await stopDevServer();
  });

  it('renders worker markdown preview in Vite 7 without historical runtime errors', async () => {
    const page = await browser.newPage();
    const runtimeErrors = trackRuntimeErrors(page);

    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.waitForSelector('.preview h1');
    await page.waitForSelector('mjx-container');

    const heading = (await page.locator('.preview h1').first().textContent())?.trim() ?? '';
    expect(heading).toContain('Markdown Next');
    expectNoKnownBugErrors(runtimeErrors);

    const errorLogs = serverLogs.filter((line) =>
      KNOWN_BUG_ERROR_PATTERNS.some((pattern) => line.includes(pattern))
    );
    expect(errorLogs).toEqual([]);

    await page.close();
  });

  it('emits ready event and supports getStats API in browser runtime', async () => {
    const page = await browser.newPage();
    const runtimeErrors = trackRuntimeErrors(page);

    await page.goto(`${baseUrl}/e2e-ready.html`, { waitUntil: 'networkidle' });
    await page.waitForFunction(
      () => document.querySelector('#ready-state')?.textContent?.trim() === 'ready'
    );

    const readyError = (await page.locator('#ready-error').textContent())?.trim() ?? '';
    expect(readyError).toBe('');

    const statsText = (await page.locator('#stats-json').textContent())?.trim() ?? '';
    expect(statsText.length).toBeGreaterThan(0);
    const stats = JSON.parse(statsText) as Record<string, number>;
    expect(stats).toHaveProperty('activeWorkers');
    expect(stats).toHaveProperty('idleWorkers');
    expect(stats).toHaveProperty('queuedTasks');
    expect(stats).toHaveProperty('completedTasks');
    expectNoKnownBugErrors(runtimeErrors);

    await page.close();
  });

  it('stays stable under rapid markdown updates (edge case)', async () => {
    const page = await browser.newPage();
    const runtimeErrors = trackRuntimeErrors(page);

    await page.goto(baseUrl, { waitUntil: 'networkidle' });

    const editor = page.locator('textarea.editor').first();
    for (let i = 1; i <= 8; i++) {
      await editor.fill(`# Edge Update ${i}\n\n- item ${i}\n\n$ ${i}=y^2 $\n`);
    }

    await page.waitForFunction(() => {
      const heading = document.querySelector('.preview h1');
      return heading?.textContent?.includes('Edge Update 8');
    });
    await page.waitForSelector('mjx-container');
    expectNoKnownBugErrors(runtimeErrors);

    await page.close();
  });
});
