import type { Root } from 'hast';
import type { VNodeChild } from 'vue';
import type { MarkdownRenderOptions } from '../types';

export interface StreamdownHASTParser {
  parseToHAST(markdown: string): Promise<Root>;
}

export interface StreamdownRenderer {
  render(markdown: string, options?: MarkdownRenderOptions): Promise<VNodeChild>;
  reset(): void;
}

export type MarkdownRenderCallback = StreamdownRenderer['render'];
