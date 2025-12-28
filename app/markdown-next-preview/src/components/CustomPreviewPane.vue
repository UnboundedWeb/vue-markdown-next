<script setup lang="ts">
import { MarkdownRenderer, MarkdownWorkerPoll } from '@markdown-next/vue';
import type { ParserOptions } from '@markdown-next/parser';
import { CustomCodeRenderer, customComponents } from './customRenderers';
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
  <section class="pane preview-pane custom-preview-pane">
    <div class="pane-header">
      <div>
        <h2>{{ t('customPreview.title') }}</h2>
        <p>{{ t('customPreview.description') }}</p>
      </div>
      <div class="status">{{ t('status.custom') }}</div>
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
