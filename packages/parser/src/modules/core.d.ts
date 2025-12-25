import { ExtendsProps, RenderType } from '../types/props';
import { PluggableList, Processor } from 'unified';
import { Root } from 'hast';
import type { Options as MathJaxOptions } from 'rehype-mathjax/chtml';
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
export declare const getParser: <T extends RenderType>(
  target: T,
  option: RenderProps
) => T extends 'html'
  ? Processor<Root, Root, Root, Root, string>
  : Processor<Root, Root, Root, undefined, undefined>;
//# sourceMappingURL=core.d.ts.map
