import { ExtendsProps, RenderType } from '../types/props';
import { PluggableList, Processor, unified } from 'unified';
import { Root } from 'hast';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkMath from 'remark-math';
import rehypeSanitize from 'rehype-sanitize';
import rehypeRaw from 'rehype-raw';
import { createSanitizeSchema } from '../utils/createSanitizeSchema';
import { rehypeConvertAbnormalTagsToText } from '../plugin/rehypeConvertAbnormalTagsToText';
import rehypeMathJaxChtml from 'rehype-mathjax/chtml';
import type { Options as MathJaxOptions } from 'rehype-mathjax/chtml';
import { DEFAULT_MATHJAX_CONFIG } from '../consts/mathjaxdefaultConfig';
import { remarkMathDelimiters } from '../plugin/remarkMathDelimiters';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyProcessor = Processor<any, any, any, any, any>;

interface RenderProps {
  customTags?: string[];
  extendedGrammar?: ExtendsProps[];
  /**
   * 在 `remarkRehype` 之前追加的 remark 插件（处理 Markdown AST）
   */
  remarkPlugins?: PluggableList;
  /**
   * 在 `rehypeRaw/rehypeSanitize` 之后追加的 rehype 插件（处理 HTML AST）
   */
  rehypePlugins?: PluggableList;
  /**
   * MathJax 配置选项（仅在 extendedGrammar 包含 'mathjax' 时生效）
   * @see https://docs.mathjax.org/en/latest/options/index.html
   */
  mathJaxConfig?: MathJaxOptions;
  /**
   * 是否支持 LaTeX 语法（使用 \( 和 \[ 作为数学公式分隔符）
   * 当设置为 true 时，会启用 remarkMathDelimiters 插件来解析 LaTeX 语法
   * @default false
   */
  supportsLaTeX?: boolean;
}
export const getParser = <T extends RenderType>(
  target: T,
  option: RenderProps
): T extends 'html'
  ? Processor<Root, Root, Root, Root, string>
  : Processor<Root, Root, Root, undefined, undefined> => {
  const {
    customTags = [],
    remarkPlugins = [],
    rehypePlugins = [],
    extendedGrammar = [],
    mathJaxConfig,
    supportsLaTeX = false,
  } = option;
  const extendedGrammarSet = new Set(extendedGrammar);
  let parser: AnyProcessor = unified().use(remarkParse) as AnyProcessor;
  if (extendedGrammarSet.has('gfm')) parser = parser.use(remarkGfm);
  if (extendedGrammarSet.has('mathjax')) {
    if (supportsLaTeX) {
      parser = parser.use(remarkMathDelimiters);
    }
    parser = parser.use(remarkMath);
  }

  // 在 remarkRehype 之前追加 remark 插件
  if (remarkPlugins.length > 0) {
    parser = parser.use(remarkPlugins);
  }

  parser = parser
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeConvertAbnormalTagsToText, customTags)
    .use(rehypeSanitize, createSanitizeSchema(customTags));

  if (extendedGrammarSet.has('mathjax')) {
    const mergedConfig: MathJaxOptions = mathJaxConfig ?? DEFAULT_MATHJAX_CONFIG;
    parser = parser.use(rehypeMathJaxChtml, mergedConfig);
  }

  // 在 rehypeRaw/rehypeSanitize 之后追加 rehype 插件
  if (rehypePlugins.length > 0) {
    parser = parser.use(rehypePlugins);
  }

  if (target === 'html') {
    return parser.use(rehypeStringify, {
      allowDangerousHtml: true,
    }) as T extends 'html'
      ? Processor<Root, Root, Root, Root, string>
      : Processor<Root, Root, Root, undefined, undefined>;
  }
  return parser as T extends 'html'
    ? Processor<Root, Root, Root, Root, string>
    : Processor<Root, Root, Root, undefined, undefined>;
};
