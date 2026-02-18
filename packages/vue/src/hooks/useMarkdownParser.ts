import { createParser } from '@markdown-next/parser';
import type { ParserOptions } from '@markdown-next/parser';
import type { MarkdownRenderOptions, UseMarkdownResult } from '../types';
import { onBeforeUnmount } from 'vue';
import type { ShallowRef, VNodeChild } from 'vue';
import { createStreamdownRenderer } from '../streamdown/createStreamdownRenderer';
import { useMarkdownRender, type MaybeRef } from './useMarkdownRender';

export function useMarkdownParser(
  markdown: MaybeRef<string>,
  parserOptions?: ParserOptions,
  renderOptions?: MaybeRef<MarkdownRenderOptions | undefined>
): UseMarkdownResult<ShallowRef<VNodeChild | null>> {
  const parser = createParser(parserOptions ?? {});
  const streamdown = createStreamdownRenderer({
    parseToHAST: (value: string) => parser.parseToHAST(value),
  });

  onBeforeUnmount(() => {
    streamdown.reset();
  });

  return useMarkdownRender(
    markdown,
    (value, options) => streamdown.render(value, options),
    renderOptions
  );
}
