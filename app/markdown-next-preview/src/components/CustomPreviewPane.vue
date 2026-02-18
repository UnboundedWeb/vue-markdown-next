<script setup lang="ts">
import { MarkdownRenderer } from '@markdown-next/vue';
import { CustomCodeRenderer, customComponents } from './customRenderers';
import { useI18n } from 'vue-i18n';
import { defaultParserOptions } from '../constants/defaultParserOptions';

defineProps<{
  markdown: string;
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

    <MarkdownRenderer
      class="preview preview-custom"
      mode="streaming"
      :streamdown="{ parseIncompleteMarkdown: true }"
      :parserOptions="defaultParserOptions"
      :components="customComponents"
      :codeRenderer="CustomCodeRenderer"
      :markdown="markdown"
    />
  </section>
</template>
