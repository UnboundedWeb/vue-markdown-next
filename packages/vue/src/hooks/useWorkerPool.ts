import { ref, onBeforeUnmount } from 'vue';
import {
  ParserWorkerPool,
  createWorkerPool,
  type WorkerPoolOptions,
} from '@markdown-next/parser';
import type { Root } from 'hast';

/**
 * useWorkerPool Hook 返回类型
 */
export interface UseWorkerPoolReturn {
  /**
   * 解析 Markdown 到 HTML
   */
  parseToHTML: (markdown: string) => Promise<string>;

  /**
   * 解析 Markdown 到 HAST
   */
  parseToHAST: (markdown: string) => Promise<Root>;

  /**
   * 批量解析 Markdown 到 HTML（并行）
   */
  batchParseToHTML: (markdowns: string[]) => Promise<string[]>;

  /**
   * 批量解析 Markdown 到 HAST（并行）
   */
  batchParseToHAST: (markdowns: string[]) => Promise<Root[]>;

  /**
   * 更新所有 Worker 的选项
   */
  updateOptions: (options: Partial<WorkerPoolOptions>) => Promise<void>;

  /**
   * 获取 Worker 池信息
   */
  getPoolInfo: () => {
    workerCount: number;
    maxWorkers: number;
    environment: 'browser' | 'node' | 'unknown';
    initialized: boolean;
  };

}

/**
 * 多线程 Markdown 解析器 Hook（使用 Worker 池）
 *
 * @param options Worker 池选项（包含解析器选项和 Worker 数量）
 * @returns UseWorkerPoolReturn
 *
 * @example
 * ```vue
 * <script setup>
 * import { useWorkerPool } from '@markdown-next/vue';
 *
 * const { parseToHTML, getPoolInfo } = useWorkerPool({
 *   workerCount: 4,
 *   extendedGrammar: ['gfm', 'mathjax']
 * });
 *
 * const html = await parseToHTML('# Hello World');
 * console.log(getPoolInfo()); // { workerCount: 4, ... }
 * </script>
 * ```
 */
export function useWorkerPool(options: WorkerPoolOptions = {}): UseWorkerPoolReturn {
  const pool = ref<ParserWorkerPool>(createWorkerPool(options));

  const parseToHTML = async (markdown: string): Promise<string> => {
    return pool.value.parseToHTML(markdown);
  };

  const parseToHAST = async (markdown: string): Promise<Root> => {
    return pool.value.parseToHAST(markdown);
  };

  const batchParseToHTML = async (markdowns: string[]): Promise<string[]> => {
    return pool.value.batchParseToHTML(markdowns);
  };

  const batchParseToHAST = async (markdowns: string[]): Promise<Root[]> => {
    return pool.value.batchParseToHAST(markdowns);
  };

  const updateOptions = async (newOptions: Partial<WorkerPoolOptions>): Promise<void> => {
    return pool.value.updateOptions(newOptions);
  };

  const getPoolInfo = () => {
    return pool.value.getPoolInfo();
  };

  // 组件卸载时销毁 Worker 池
  onBeforeUnmount(() => {
    pool.value.destroy();
  });

  return {
    parseToHTML,
    parseToHAST,
    batchParseToHTML,
    batchParseToHAST,
    updateOptions,
    getPoolInfo,
  };
}
