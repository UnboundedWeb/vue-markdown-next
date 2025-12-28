import type { Component, FunctionalComponent, Ref } from 'vue';
import type { ParserOptions } from '@markdown-next/parser';

export type MarkdownComponent = Component | FunctionalComponent | string;
export type MarkdownComponents = Record<string, MarkdownComponent>;

export interface MarkdownRenderOptions {
  components?: MarkdownComponents;
  codeRenderer?: MarkdownComponent;
  dynamic?: boolean;
  debounceMs?: number;
}

export interface MarkdownRendererProps extends MarkdownRenderOptions {
  markdown: string;
  parserOptions?: ParserOptions;
}

export interface MarkdownWorkerPollProps extends MarkdownRenderOptions {
  parserOptions?: ParserOptions;
  workerCount?: number;
  customTags?: string[];
  extendedGrammar?: ParserOptions['extendedGrammar'];
  remarkPlugins?: ParserOptions['remarkPlugins'];
  rehypePlugins?: ParserOptions['rehypePlugins'];
  mathJaxConfig?: ParserOptions['mathJaxConfig'];
  supportsLaTeX?: ParserOptions['supportsLaTeX'];
}

export interface UseMarkdownResult<T> {
  content: T;
  loading: Ref<boolean>;
  error: Ref<Error | null>;
}
