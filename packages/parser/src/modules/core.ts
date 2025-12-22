import { ExtendsProps, RenderType } from '../types/props';
import { Processor, unified } from 'unified';
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
interface RenderProps {
  customTags: string[];
  extends: ExtendsProps[];
}
export const getParser = <T extends RenderType>(
  target: T,
  props: RenderProps
): T extends 'html'
  ? Processor<Root, Root, Root, Root, string>
  : Processor<Root, Root, Root, undefined, undefined> => {
  const { customTags } = props;
  let parser = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeConvertAbnormalTagsToText, customTags)
    .use(rehypeSanitize, createSanitizeSchema(customTags));
  parser = parser.use(rehypeMathJaxChtml, {});
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
