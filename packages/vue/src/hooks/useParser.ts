import { ref, onBeforeUnmount } from 'vue';
import { Parser, createParser, type ParserOptions } from '@markdown-next/parser';
import type { Root } from 'hast';

/**
 * useParser Hook 返回类型
 */
export interface UseParserReturn {
  /**
   * 解析 Markdown 到 HTML
   */
  parseToHTML: (markdown: string) => Promise<string>;

  /**
   * 解析 Markdown 到 HAST
   */
  parseToHAST: (markdown: string) => Promise<Root>;

  /**
   * 批量解析 Markdown 到 HTML
   */
  batchParseToHTML: (markdowns: string[]) => Promise<string[]>;

  /**
   * 批量解析 Markdown 到 HAST
   */
  batchParseToHAST: (markdowns: string[]) => Promise<Root[]>;

}

/**
 * 单线程 Markdown 解析器 Hook
 *
 * @param options 解析器选项
 * @returns UseParserReturn
 *
 * @example
 * ```vue
 * <script setup>
 * import { useParser } from '@markdown-next/vue';
 *
 * const { parseToHTML } = useParser({
 *   extendedGrammar: ['gfm', 'mathjax']
 * });
 *
 * const html = await parseToHTML('# Hello World');
 * </script>
 * ```
 */
export function useParser(options: ParserOptions = {}): UseParserReturn {
  const parser = ref<Parser>(createParser(options));

  const parseToHTML = async (markdown: string): Promise<string> => {
    return parser.value.parseToHTML(markdown);
  };

  const parseToHAST = async (markdown: string): Promise<Root> => {
    return parser.value.parseToHAST(markdown);
  };

  const batchParseToHTML = async (markdowns: string[]): Promise<string[]> => {
    return parser.value.batchParseToHTML(markdowns);
  };

  const batchParseToHAST = async (markdowns: string[]): Promise<Root[]> => {
    return parser.value.batchParseToHAST(markdowns);
  };

  // 组件卸载时清理（虽然单线程解析器没有需要清理的资源，但保持接口一致）
  onBeforeUnmount(() => {
    // 单线程解析器无需清理
  });

  return {
    parseToHTML,
    parseToHAST,
    batchParseToHTML,
    batchParseToHAST,
  };
}
