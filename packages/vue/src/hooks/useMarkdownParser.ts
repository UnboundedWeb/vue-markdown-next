import { createParser } from '@markdown-next/parser';
import type { ParserOptions } from '@markdown-next/parser';
import type { MarkdownRenderOptions, UseMarkdownResult } from '../types';
import type { ShallowRef, VNodeChild } from 'vue';
import { renderHastToVue } from '../render/hastToVue';
import { useMarkdownRender, type MaybeRef } from './useMarkdownRender';

export function useMarkdownParser(
  markdown: MaybeRef<string>,
  parserOptions?: ParserOptions,
  renderOptions?: MaybeRef<MarkdownRenderOptions | undefined>
): UseMarkdownResult<ShallowRef<VNodeChild | null>> {
  const parser = createParser(parserOptions ?? {});

  return useMarkdownRender(
    markdown,
    async (value, options) => {
      const tree = await parser.parseToHAST(value);
      return renderHastToVue(tree, options);
    },
    renderOptions
  );
}
