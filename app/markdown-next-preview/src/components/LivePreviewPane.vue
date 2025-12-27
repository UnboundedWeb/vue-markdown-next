<script setup lang="ts">
import { MarkdownRenderer, MarkdownWorkerPoll } from '@markdown-next/vue';
import type { ParserOptions } from '@markdown-next/parser';

defineProps<{
  markdown: string;
  workerCount: number;
}>();

const parserOptions: ParserOptions = {
  supportsLaTeX: true,
  extendedGrammar: ['gfm', 'mathjax'],
};
</script>

<template>
  <section class="pane preview-pane">
    <div class="pane-header">
      <div>
        <h2>实时渲染</h2>
        <p>由 @markdown-next/vue 渲染，带 GitHub 风格主题。</p>
      </div>
      <div class="status">Live</div>
    </div>
    <MarkdownWorkerPoll :worker-count="workerCount" :parserOptions="parserOptions">
      <MarkdownRenderer :dynamic="true" class="preview" :markdown="markdown" />
    </MarkdownWorkerPoll>
  </section>
</template>
