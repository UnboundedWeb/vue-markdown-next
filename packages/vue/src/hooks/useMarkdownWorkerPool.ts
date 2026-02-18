import type { ParserWorkerPool } from '@markdown-next/parser';
import type { MarkdownRenderOptions, UseMarkdownResult } from '../types';
import { onBeforeUnmount } from 'vue';
import type { ShallowRef, VNodeChild } from 'vue';
import { createStreamdownRenderer } from '../streamdown/createStreamdownRenderer';
import { useMarkdownRender, type MaybeRef } from './useMarkdownRender';

export function useMarkdownWorkerPool(
  markdown: MaybeRef<string>,
  pool: ParserWorkerPool,
  renderOptions?: MaybeRef<MarkdownRenderOptions | undefined>
): UseMarkdownResult<ShallowRef<VNodeChild | null>> {
  const streamdown = createStreamdownRenderer({
    parseToHAST: (value: string) => pool.parseToHAST(value),
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
