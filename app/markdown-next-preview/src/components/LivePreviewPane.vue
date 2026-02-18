<script setup lang="ts">
import { MarkdownRenderer, MarkdownWorkerPoll } from '@markdown-next/vue';
import { useI18n } from 'vue-i18n';
import { defaultParserOptions } from '../constants/defaultParserOptions';

defineProps<{
  markdown: string;
  workerCount: number;
}>();

const { t } = useI18n();
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
    <MarkdownWorkerPoll :worker-count="workerCount" :parserOptions="defaultParserOptions">
      <MarkdownRenderer
        mode="streaming"
        :streamdown="{ parseIncompleteMarkdown: true }"
        class="preview"
        :markdown="markdown"
      />
    </MarkdownWorkerPoll>
  </section>
</template>
