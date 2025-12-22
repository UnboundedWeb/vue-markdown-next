// 创建 sanitize 配置
import { defaultSchema } from 'rehype-sanitize';
import { MATHML_ATTRIBUTES, MATHML_TAG_NAMES } from '../consts/tagFilter';

export const createSanitizeSchema = (customTags: string[] = []): typeof defaultSchema => ({
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames || []), ...MATHML_TAG_NAMES, ...customTags],
  attributes: {
    ...defaultSchema.attributes,

    // Allow src attribute for img tags with file:// protocol and other protocols
    img: ['src', 'alt', 'title', 'width', 'height', 'style', 'class'],
    // The `language-*` regex is allowed by default.
    code: [['className', /^language-./, 'math-inline', 'math-display']],
    ...MATHML_ATTRIBUTES,
    // Add basic attributes for custom tags
    ...customTags.reduce(
      (acc, tag) => {
        acc[tag] = ['class', 'className', 'style', 'id', 'prop', 'src'];
        return acc;
      },
      {} as Record<string, string[]>
    ),
  },
  protocols: {
    ...defaultSchema.protocols,
    src: ['http', 'https', 'data', 'file'],
  },
});
