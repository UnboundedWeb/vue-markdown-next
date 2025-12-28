import { Root } from 'hast';
import { getParser } from './core';
import type { RenderProps as ParserOptions } from './core';
export { ParserOptions };
/**
 * 单线程 Markdown 解析器
 */
export class Parser {
  private options: ParserOptions;

  constructor(options: ParserOptions = {}) {
    this.options = options;
  }

  /**
   * 解析 Markdown 到 HTML
   * @param markdown Markdown 字符串
   * @returns HTML 字符串
   */
  async parseToHTML(markdown: string): Promise<string> {
    const processor = getParser('html', this.options);
    const result = await processor.process(markdown);
    return String(result);
  }

  /**
   * 解析 Markdown 到 HAST
   * @param markdown Markdown 字符串
   * @returns HAST Root 节点
   */
  async parseToHAST(markdown: string): Promise<Root> {
    const processor = getParser('hast', this.options);
    const tree = processor.parse(markdown);
    const result = await processor.run(tree);
    return result as Root;
  }

  /**
   * 批量解析 Markdown 到 HTML
   * @param markdowns Markdown 字符串数组
   * @returns HTML 字符串数组
   */
  async batchParseToHTML(markdowns: string[]): Promise<string[]> {
    const processor = getParser('html', this.options);
    return Promise.all(
      markdowns.map(async (md) => {
        const result = await processor.process(md);
        return String(result);
      })
    );
  }

  /**
   * 批量解析 Markdown 到 HAST
   * @param markdowns Markdown 字符串数组
   * @returns HAST Root 节点数组
   */
  async batchParseToHAST(markdowns: string[]): Promise<Root[]> {
    const processor = getParser('hast', this.options);
    return Promise.all(
      markdowns.map(async (md) => {
        const tree = processor.parse(md);
        const result = await processor.run(tree);
        return result as Root;
      })
    );
  }
}

/**
 * 创建单线程解析器实例
 * @param options 解析器选项
 * @returns Parser 实例
 */
export function createParser(options: ParserOptions = {}): Parser {
  return new Parser(options);
}
