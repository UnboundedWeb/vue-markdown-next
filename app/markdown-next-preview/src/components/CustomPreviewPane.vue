<script setup lang="ts">
import { MarkdownRenderer, MarkdownWorkerPoll } from '@markdown-next/vue';
import type { ParserOptions } from '@markdown-next/parser';
import { CustomCodeRenderer, customComponents } from './customRenderers';

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
  <section class="pane preview-pane custom-preview-pane">
    <div class="pane-header">
      <div>
        <h2>自定义渲染样式</h2>
        <p>自定义组件 + Highlight.js 代码高亮。</p>
      </div>
      <div class="status">Custom</div>
    </div>
    <MarkdownWorkerPoll
      :worker-count="workerCount"
      :parserOptions="parserOptions"
      :components="customComponents"
      :codeRenderer="CustomCodeRenderer"
    >
      <MarkdownRenderer :dynamic="true" class="preview preview-custom" :markdown="markdown" />
    </MarkdownWorkerPoll>
  </section>
</template>
