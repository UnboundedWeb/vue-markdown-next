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

export interface RenderProps {
  customTags?: string[];
  extendedGrammar?: ExtendsProps[];
  /**
   * Remark plugins appended before `remarkRehype` (process Markdown AST)
   */
  remarkPlugins?: PluggableList;
  /**
   * Rehype plugins appended after `rehypeRaw/rehypeSanitize` (process HTML AST)
   */
  rehypePlugins?: PluggableList;
  /**
   * MathJax config options (only effective when extendedGrammar includes 'mathjax')
   * @see https://docs.mathjax.org/en/latest/options/index.html
   */
  mathJaxConfig?: MathJaxOptions;
  /**
   * Whether to support LaTeX syntax (using \\( and \\[ as math delimiters)
   * When true, enables remarkMathDelimiters to parse LaTeX syntax
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

  // Append remark plugins before remarkRehype
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

  // Append rehype plugins after rehypeRaw/rehypeSanitize
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
