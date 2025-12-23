// 单线程解析器
export { Parser, createParser, type ParserOptions } from './modules/parser';

// 多线程解析器（Worker 池）
export {
  ParserWorkerPool,
  createWorkerPool,
  type WorkerPoolOptions,
} from './modules/parser.workerPool';

// 类型定义
export type { RenderType, ExtendsProps } from './types/props';
