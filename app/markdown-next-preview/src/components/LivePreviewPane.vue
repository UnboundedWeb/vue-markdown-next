<script setup lang="ts">
import { MarkdownRenderer } from '@markdown-next/vue';
import { useI18n } from 'vue-i18n';
import { defaultParserOptions } from '../constants/defaultParserOptions';

defineProps<{
  markdown: string;
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

    <MarkdownRenderer
      mode="streaming"
      :streamdown="{ parseIncompleteMarkdown: true }"
      :parserOptions="defaultParserOptions"
      class="preview"
      :markdown="markdown"
    />
  </section>
</template>
