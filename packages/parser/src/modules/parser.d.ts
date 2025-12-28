import { Root } from 'hast';
import type { RenderProps as ParserOptions } from './core';
export { ParserOptions };
/**
 * 单线程 Markdown 解析器
 */
export declare class Parser {
  private options;
  constructor(options?: ParserOptions);
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
   * 批量解析 Markdown 到 HTML
   * @param markdowns Markdown 字符串数组
   * @returns HTML 字符串数组
   */
  batchParseToHTML(markdowns: string[]): Promise<string[]>;
  /**
   * 批量解析 Markdown 到 HAST
   * @param markdowns Markdown 字符串数组
   * @returns HAST Root 节点数组
   */
  batchParseToHAST(markdowns: string[]): Promise<Root[]>;
}
/**
 * 创建单线程解析器实例
 * @param options 解析器选项
 * @returns Parser 实例
 */
export declare function createParser(options?: ParserOptions): Parser;
//# sourceMappingURL=parser.d.ts.map
