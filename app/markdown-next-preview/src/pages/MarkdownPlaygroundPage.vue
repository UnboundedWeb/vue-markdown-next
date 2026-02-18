<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import EditorPane from '../components/EditorPane.vue';
import LivePreviewPane from '../components/LivePreviewPane.vue';
import CustomPreviewPane from '../components/CustomPreviewPane.vue';
import { markdownSamples, type Locale } from '../i18n';

const { locale, t } = useI18n();
const markdown = ref(markdownSamples[locale.value as Locale]);

watch(locale, (next, prev) => {
  const previousSample = markdownSamples[prev as Locale];
  if (markdown.value === previousSample) {
    markdown.value = markdownSamples[next as Locale];
  }
});

const wordCount = computed(() => {
  const trimmed = markdown.value.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
});

const charCount = computed(() => markdown.value.length);
</script>

<template>
  <section class="workspace-meta">
    <span>{{ t('playground.wordCount') }}: {{ wordCount }}</span>
    <span>{{ t('playground.charCount') }}: {{ charCount }}</span>
  </section>

  <main class="workspace">
    <EditorPane v-model="markdown" />
    <LivePreviewPane :markdown="markdown" />
    <CustomPreviewPane :markdown="markdown" />
  </main>
</template>

<style scoped>
.workspace-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.workspace-meta span {
  border: 1px solid var(--border-color);
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  background: var(--card-highlight);
  color: var(--text-muted);
}

.workspace {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

@media (max-width: 1024px) {
  .workspace {
    grid-template-columns: 1fr;
  }
}
</style>
