<script setup lang="ts">
import { MarkdownRenderer, MarkdownWorkerPoll } from '@markdown-next/vue';
import type { ParserOptions } from '@markdown-next/parser';
import { useI18n } from 'vue-i18n';

defineProps<{
  markdown: string;
  workerCount: number;
}>();

const { t } = useI18n();

const parserOptions: ParserOptions = {
  supportsLaTeX: true,
  extendedGrammar: ['gfm', 'mathjax'],
};
</script>

<template>
  <section class="pane preview-pane">
    <div class="pane-header">
      <div>
        <h2>{{ t('preview.title') }}</h2>
        <p>{{ t('preview.description') }}</p>
      </div>
      <div class="status">{{ t('status.live') }}</div>
    </div>
    <MarkdownWorkerPoll :worker-count="workerCount" :parserOptions="parserOptions">
      <MarkdownRenderer :dynamic="true" class="preview" :markdown="markdown" />
    </MarkdownWorkerPoll>
  </section>
</template>
