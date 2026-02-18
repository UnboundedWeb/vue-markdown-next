<script setup lang="ts">
import { MarkdownRenderer, MarkdownWorkerPoll } from '@markdown-next/vue';
import { CustomCodeRenderer, customComponents } from './customRenderers';
import { useI18n } from 'vue-i18n';
import { defaultParserOptions } from '../constants/defaultParserOptions';

defineProps<{
  markdown: string;
  workerCount: number;
}>();

const { t } = useI18n();
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
      :parserOptions="defaultParserOptions"
      :components="customComponents"
      :codeRenderer="CustomCodeRenderer"
      mode="streaming"
    >
      <MarkdownRenderer class="preview preview-custom" :markdown="markdown" />
    </MarkdownWorkerPoll>
  </section>
</template>
