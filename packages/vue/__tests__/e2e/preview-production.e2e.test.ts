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
const E2E_SETUP_TIMEOUT = 600000;
const KNOWN_RUNTIME_ERROR_PATTERNS = [
  'Invalid linked format',
  'The file does not exist at',
  'document is not defined',
  '/.vite/deps/modules/parser.worker.mjs',
];

const currentDir = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(currentDir, '../../../../');

let browser: Browser;
let previewServer: ChildProcessWithoutNullStreams;
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

  throw new Error(
    `Vite preview server did not become ready in ${timeoutMs}ms.\n${serverLogs.join('')}`
  );
}

async function stopPreviewServer(): Promise<void> {
  if (!previewServer || previewServer.killed) return;

  previewServer.kill('SIGTERM');

  const exitPromise = once(previewServer, 'exit');
  const timeoutPromise = delay(5000).then(() => {
    if (previewServer.exitCode === null) previewServer.kill('SIGKILL');
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

function expectNoKnownRuntimeErrors(runtimeErrors: string[]): void {
  const matched = runtimeErrors.filter((line) =>
    KNOWN_RUNTIME_ERROR_PATTERNS.some((pattern) => line.includes(pattern))
  );
  expect(matched).toEqual([]);
}

describe('preview production e2e', () => {
  beforeAll(async () => {
    await runPnpm(['--filter', '@markdown-next/parser', 'build']);
    await runPnpm(['--filter', '@markdown-next/vue', 'build']);
    await runPnpm(['--filter', 'markdown-next-preview', 'build']);
    await runPnpm(['--filter', '@markdown-next/vue', 'exec', 'playwright', 'install', 'chromium']);

    serverPort = await getRandomPort();
    baseUrl = `http://${TEST_HOST}:${serverPort}`;

    previewServer = spawn(
      'pnpm',
      [
        '--filter',
        'markdown-next-preview',
        'exec',
        'vite',
        'preview',
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

    previewServer.stdout.on('data', (chunk) => {
      serverLogs.push(chunk.toString());
    });
    previewServer.stderr.on('data', (chunk) => {
      serverLogs.push(chunk.toString());
    });

    await waitForServer(baseUrl, SERVER_READY_TIMEOUT);
    browser = await chromium.launch({ headless: true });
  }, E2E_SETUP_TIMEOUT);

  afterAll(async () => {
    if (browser) await browser.close();
    await stopPreviewServer();
  });

  it('renders default preview content in production build', async () => {
    const page = await browser.newPage();
    const runtimeErrors = trackRuntimeErrors(page);
    const failedRequests: string[] = [];
    const worker404Responses: string[] = [];

    page.on('requestfailed', (request) => {
      failedRequests.push(
        `${request.method()} ${request.url()} ${request.failure()?.errorText ?? ''}`
      );
    });
    page.on('response', (response) => {
      const isWorkerRequest = response.url().includes('parser.worker');
      if (isWorkerRequest && response.status() >= 400) {
        worker404Responses.push(`${response.status()} ${response.url()}`);
      }
    });

    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.preview h1');

    const heading = (await page.locator('.preview h1').first().textContent())?.trim() ?? '';
    expect(heading).toContain('Markdown Next');
    expect(await page.locator('text=Rendering markdown...').count()).toBe(0);
    expect(worker404Responses).toEqual([]);
    expect(
      failedRequests.filter(
        (line) => line.includes('parser.worker') || line.includes('modules/parser.worker')
      )
    ).toEqual([]);
    expectNoKnownRuntimeErrors(runtimeErrors);

    await page.close();
  }, 30000);

  it('renders #stream route in production build without i18n format errors', async () => {
    const page = await browser.newPage();
    const runtimeErrors = trackRuntimeErrors(page);

    await page.goto(`${baseUrl}/#stream`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.stream-control-pane h2');
    await page.waitForSelector('.stream-output-pane h2');

    const streamTitle = (await page.locator('.stream-control-pane h2').first().textContent()) ?? '';
    expect(streamTitle.trim().length).toBeGreaterThan(0);
    expectNoKnownRuntimeErrors(runtimeErrors);

    await page.close();
  }, 30000);
});
