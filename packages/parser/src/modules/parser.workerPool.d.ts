import { Root } from 'hast';
import type { ParserOptions } from './parser';
export declare function resolveBrowserWorkerURL(moduleUrl?: string): URL;
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
 * 多线程 Markdown 解析器（使用 Worker 池）
 */
export declare class ParserWorkerPool {
  private options;
  private workers;
  private workerCount;
  private initialized;
  private initPromise;
  private completedTasks;
  private pending;
  constructor(options?: WorkerPoolOptions);
  /**
   * 初始化 Worker 池
   */
  private init;
  /**
   * 获取空闲的 Worker
   */
  private getAvailableWorker;
  /**
   * 释放 Worker
   */
  private releaseWorker;
  /**
   * 解析 Markdown 到 HTML
   * @param markdown Markdown 字符串
   * @returns HTML 字符串
   */
  parseToHTML(markdown: string): Promise<string>;
  /**
   * 解析 Markdown 到 HAST
   * @param markdown Markdown 字符串
   * @returns HAST Root 节点
   */
  parseToHAST(markdown: string): Promise<Root>;
  /**
   * 批量解析 Markdown 到 HTML（并行处理）
   * @param markdowns Markdown 字符串数组
   * @returns HTML 字符串数组
   */
  batchParseToHTML(markdowns: string[]): Promise<string[]>;
  /**
   * 批量解析 Markdown 到 HAST（并行处理）
   * @param markdowns Markdown 字符串数组
   * @returns HAST Root 节点数组
   */
  batchParseToHAST(markdowns: string[]): Promise<Root[]>;
  /**
   * 更新所有 Worker 的选项
   * @param options 新的解析器选项
   */
  updateOptions(options: Partial<ParserOptions>): Promise<void>;
  /**
   * 销毁 Worker 池
   */
  destroy(): Promise<void>;
  /**
   * 兼容旧 API：终止 Worker 池
   */
  terminate(): Promise<void>;
  /**
   * 兼容旧 API：获取统计信息
   */
  getStats(): {
    activeWorkers: number;
    idleWorkers: number;
    queuedTasks: number;
    completedTasks: number;
  };
  /**
   * 获取 Worker 池信息
   */
  getPoolInfo(): {
    workerCount: number;
    activeWorkers: number;
    busyWorkers: number;
    maxWorkers: number;
    environment: 'browser' | 'node' | 'unknown';
    initialized: boolean;
  };
}
/**
 * 创建多线程解析器实例
 * @param options 解析器选项（包含 Worker 数量）
 * @returns ParserWorkerPool 实例
 */
export declare function createWorkerPool(options?: WorkerPoolOptions): ParserWorkerPool;
//# sourceMappingURL=parser.workerPool.d.ts.map
