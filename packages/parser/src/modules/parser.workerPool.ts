import { wrap, Remote } from 'comlink';
import { Root } from 'hast';
import type { ParserOptions } from './parser';

/**
 * Worker 实例接口
 */
interface ParserWorkerService {
  // eslint-disable-next-line no-unused-vars
  new (_options: ParserOptions): ParserWorkerService;
  // eslint-disable-next-line no-unused-vars
  parseToHTML(_markdown: string): Promise<string>;
  // eslint-disable-next-line no-unused-vars
  parseToHAST(_markdown: string): Promise<Root>;
  // eslint-disable-next-line no-unused-vars
  updateOptions(_options: ParserOptions): void;
}

/**
 * 获取环境类型
 */
function getEnvironment(): 'browser' | 'node' | 'unknown' {
  // eslint-disable-next-line no-undef
  if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
    return 'browser';
  }
  // eslint-disable-next-line no-undef
  if (typeof process !== 'undefined' && process.versions?.node) {
    return 'node';
  }
  return 'unknown';
}

/**
 * 获取最大可用线程数
 */
function getMaxWorkers(): number {
  const env = getEnvironment();

  if (env === 'browser') {
    // 浏览器环境：使用 navigator.hardwareConcurrency
    // 通常限制为 CPU 核心数，但浏览器可能有自己的限制
    // eslint-disable-next-line no-undef, @typescript-eslint/no-explicit-any
    const nav = typeof navigator !== 'undefined' ? (navigator as any) : null;
    const cores = nav?.hardwareConcurrency || 4;
    // 限制最大为 8 个 Worker，避免过度占用资源
    return Math.min(cores, 8);
  }

  if (env === 'node') {
    // Node.js 环境：使用 os.cpus()
    try {
      // eslint-disable-next-line no-undef
      const os = require('os');
      const cores = os.cpus()?.length || 4;
      // Node.js 中也限制最大为 8 个 Worker
      return Math.min(cores, 8);
    } catch {
      return 4;
    }
  }

  return 4;
}

/**
 * 创建 Worker 实例
 */
function createWorker(): Worker {
  const env = getEnvironment();

  if (env === 'browser') {
    // 浏览器环境：使用 Web Worker
    return new Worker(new URL('./modules/parser.worker.mjs', import.meta.url), {
      type: 'module',
    });
  }

  if (env === 'node') {
    // Node.js 环境：使用 worker_threads
    try {
      // eslint-disable-next-line no-undef
      const { Worker } = require('worker_threads');
      return new Worker(new URL('./modules/parser.worker.mjs', import.meta.url));
    } catch {
      throw new Error(
        'Worker threads are not supported in this Node.js environment. ' +
          'Please use Node.js 12+ or use the single-threaded parser instead.'
      );
    }
  }

  throw new Error('Unsupported environment for worker pool');
}

/**
 * Worker 池配置
 */
export interface WorkerPoolOptions extends ParserOptions {
  /**
   * Worker 数量，默认为 CPU 核心数（最大 8）
   */
  workerCount?: number;
}

/**
 * Worker 池状态
 */
interface WorkerState {
  worker: Worker;
  proxy: Remote<ParserWorkerService>;
  busy: boolean;
}

/**
 * 多线程 Markdown 解析器（使用 Worker 池）
 */
export class ParserWorkerPool {
  private options: WorkerPoolOptions;
  private workers: WorkerState[] = [];
  private workerCount: number;
  private initialized = false;
  private initPromise: Promise<void> | null = null;
  // eslint-disable-next-line no-unused-vars
  private pending: Array<(worker: WorkerState) => void> = [];

  constructor(options: WorkerPoolOptions = {}) {
    this.options = options;
    const maxWorkers = getMaxWorkers();
    this.workerCount = options.workerCount
      ? Math.min(Math.max(1, options.workerCount), maxWorkers)
      : maxWorkers;
  }

  /**
   * 初始化 Worker 池
   */
  private async init(): Promise<void> {
    if (this.initialized) return;
    if (this.initPromise) {
      await this.initPromise;
      return;
    }

    this.initPromise = (async () => {
      const workerPromises = Array.from({ length: this.workerCount }, async () => {
        const worker = createWorker();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const WorkerClass = wrap<any>(worker) as any;
        const parserOptions = { ...this.options };
        delete (parserOptions as { workerCount?: number }).workerCount;
        const proxy = await new WorkerClass(parserOptions);

        return {
          worker,
          proxy,
          busy: false,
        };
      });

      this.workers = await Promise.all(workerPromises);
      this.initialized = true;
    })();

    try {
      await this.initPromise;
    } finally {
      this.initPromise = null;
    }
  }

  /**
   * 获取空闲的 Worker
   */
  private async getAvailableWorker(): Promise<WorkerState> {
    await this.init();

    // 查找空闲的 Worker
    let worker = this.workers.find((w) => !w.busy);

    // 如果所有 Worker 都忙，排队等待释放
    if (!worker) {
      return await new Promise<WorkerState>((resolve) => {
        this.pending.push((available) => {
          available.busy = true;
          resolve(available);
        });
      });
    }

    worker.busy = true;
    return worker;
  }

  /**
   * 释放 Worker
   */
  private releaseWorker(worker: WorkerState): void {
    const next = this.pending.shift();
    if (next) {
      next(worker);
      return;
    }
    worker.busy = false;
  }

  /**
   * 解析 Markdown 到 HTML
   * @param markdown Markdown 字符串
   * @returns HTML 字符串
   */
  async parseToHTML(markdown: string): Promise<string> {
    const worker = await this.getAvailableWorker();
    try {
      return await worker.proxy.parseToHTML(markdown);
    } finally {
      this.releaseWorker(worker);
    }
  }

  /**
   * 解析 Markdown 到 HAST
   * @param markdown Markdown 字符串
   * @returns HAST Root 节点
   */
  async parseToHAST(markdown: string): Promise<Root> {
    const worker = await this.getAvailableWorker();
    try {
      return await worker.proxy.parseToHAST(markdown);
    } finally {
      this.releaseWorker(worker);
    }
  }

  /**
   * 批量解析 Markdown 到 HTML（并行处理）
   * @param markdowns Markdown 字符串数组
   * @returns HTML 字符串数组
   */
  async batchParseToHTML(markdowns: string[]): Promise<string[]> {
    await this.init();
    return Promise.all(markdowns.map((md) => this.parseToHTML(md)));
  }

  /**
   * 批量解析 Markdown 到 HAST（并行处理）
   * @param markdowns Markdown 字符串数组
   * @returns HAST Root 节点数组
   */
  async batchParseToHAST(markdowns: string[]): Promise<Root[]> {
    await this.init();
    return Promise.all(markdowns.map((md) => this.parseToHAST(md)));
  }

  /**
   * 更新所有 Worker 的选项
   * @param options 新的解析器选项
   */
  async updateOptions(options: Partial<ParserOptions>): Promise<void> {
    await this.init();
    this.options = { ...this.options, ...options };
    const parserOptions = { ...this.options };
    delete (parserOptions as { workerCount?: number }).workerCount;
    await Promise.all(this.workers.map((w) => w.proxy.updateOptions(parserOptions)));
  }

  /**
   * 销毁 Worker 池
   */
  async destroy(): Promise<void> {
    if (!this.initialized) return;

    for (const { worker } of this.workers) {
      worker.terminate();
    }
    this.workers = [];
    this.initialized = false;
  }

  /**
   * 获取 Worker 池信息
   */
  getPoolInfo(): {
    workerCount: number;
    maxWorkers: number;
    environment: 'browser' | 'node' | 'unknown';
    initialized: boolean;
  } {
    return {
      workerCount: this.workerCount,
      maxWorkers: getMaxWorkers(),
      environment: getEnvironment(),
      initialized: this.initialized,
    };
  }
}

/**
 * 创建多线程解析器实例
 * @param options 解析器选项（包含 Worker 数量）
 * @returns ParserWorkerPool 实例
 */
export function createWorkerPool(options: WorkerPoolOptions = {}): ParserWorkerPool {
  return new ParserWorkerPool(options);
}
