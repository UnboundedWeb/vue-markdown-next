import type { ParserWorkerPool } from '@markdown-next/parser';
import type { MarkdownRenderOptions, UseMarkdownResult } from '../types';
import type { ShallowRef, VNodeChild } from 'vue';
import { renderHastToVue } from '../render/hastToVue';
import { useMarkdownRender, type MaybeRef } from './useMarkdownRender';

export function useMarkdownWorkerPool(
  markdown: MaybeRef<string>,
  pool: ParserWorkerPool,
  renderOptions?: MaybeRef<MarkdownRenderOptions | undefined>
): UseMarkdownResult<ShallowRef<VNodeChild | null>> {
  return useMarkdownRender(
    markdown,
    async (value, options) => {
      const tree = await pool.parseToHAST(value);
      return renderHastToVue(tree, options);
    },
    renderOptions
  );
}
