import type { ParserOptions } from '@markdown-next/parser';

export const defaultParserOptions: ParserOptions = {
  supportsLaTeX: true,
  extendedGrammar: ['gfm', 'mathjax'],
};
