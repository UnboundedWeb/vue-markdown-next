import { expose } from 'comlink';
import { Root } from 'hast';
import { getParser } from './core';
import type { ParserOptions } from './parser';

/**
 * Worker 中的解析器服务
 */
class ParserWorkerService {
  private options: ParserOptions;

  constructor(options: ParserOptions = {}) {
    this.options = options;
  }

  /**
   * 解析 Markdown 到 HTML
   */
  async parseToHTML(markdown: string): Promise<string> {
    const processor = getParser('html', this.options);
    const result = await processor.process(markdown);
    return String(result);
  }

  /**
   * 解析 Markdown 到 HAST
   */
  async parseToHAST(markdown: string): Promise<Root> {
    const processor = getParser('hast', this.options);
    const tree = processor.parse(markdown);
    const result = await processor.run(tree);
    return result as Root;
  }

  /**
   * 更新选项
   */
  updateOptions(options: ParserOptions): void {
    this.options = options;
  }
}

// 暴露 Worker 服务
expose(ParserWorkerService);
