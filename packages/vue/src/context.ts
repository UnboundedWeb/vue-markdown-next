import type { ComputedRef, InjectionKey } from 'vue';
import type { ParserWorkerPool } from '@markdown-next/parser';
import type { MarkdownRenderOptions } from './types';

export interface MarkdownWorkerContext {
  pool: ParserWorkerPool;
  renderOptions: ComputedRef<MarkdownRenderOptions | undefined>;
  forceRenderOptions: ComputedRef<boolean>;
}

export const markdownWorkerContextKey: InjectionKey<MarkdownWorkerContext> =
  Symbol('MarkdownWorkerPoll');
