<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import EditorPane from './components/EditorPane.vue';
import LivePreviewPane from './components/LivePreviewPane.vue';
import CustomPreviewPane from './components/CustomPreviewPane.vue';
import { markdownSamples, type Locale } from './i18n';

const { t, locale } = useI18n();
const countPoll = 1;
const markdown = ref(markdownSamples[locale.value as Locale]);
const currentLocale = computed(() => locale.value as Locale);

const localeOptions = computed(() => [
  { value: 'zh', label: t('language.zh') },
  { value: 'en', label: t('language.en') },
]);

watch(locale, (next, prev) => {
  const prevSample = markdownSamples[prev as Locale];
  if (markdown.value === prevSample) {
    markdown.value = markdownSamples[next as Locale];
  }
});

const setLocale = (value: Locale) => {
  locale.value = value;
};
</script>

<template>
  <div class="page">
    <header class="hero">
      <div>
        <p class="eyebrow">{{ t('app.eyebrow') }}</p>
        <h1>{{ t('app.title') }}</h1>
        <p class="subtitle">{{ t('app.subtitle') }}</p>
      </div>
      <div class="hero-actions">
        <div class="language-switch">
          <span class="language-label">{{ t('language.label') }}</span>
          <div class="language-buttons">
            <button
              v-for="option in localeOptions"
              :key="option.value"
              type="button"
              class="language-button"
              :class="{ active: currentLocale === option.value }"
              :aria-pressed="currentLocale === option.value"
              @click="setLocale(option.value as Locale)"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
        <div class="badge">{{ t('app.badge') }}</div>
      </div>
    </header>

    <main class="workspace">
      <EditorPane v-model="markdown" />
      <LivePreviewPane :markdown="markdown" :worker-count="countPoll" />
      <CustomPreviewPane :markdown="markdown" :worker-count="countPoll" />
    </main>
  </div>
</template>

<style>
.page {
  display: flex;
  flex-direction: column;
  gap: 28px;
  min-height: 100vh;
  padding: 36px clamp(20px, 6vw, 72px) 64px;
}

.hero {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 28px 32px;
  border-radius: 24px;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0.82), rgba(255, 243, 224, 0.9));
  box-shadow: 0 18px 50px rgba(20, 12, 4, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.hero-actions {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.eyebrow {
  margin: 0 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  font-size: 12px;
  font-weight: 700;
  color: #7c3f00;
}

h1 {
  margin: 0;
  font-size: clamp(28px, 4vw, 44px);
  color: #1c1208;
}

.subtitle {
  margin: 10px 0 0;
  max-width: 520px;
  color: #4a3120;
  font-size: 16px;
  line-height: 1.6;
}

.language-switch {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 14px;
  background: rgba(255, 248, 236, 0.85);
  border: 1px solid rgba(124, 63, 0, 0.15);
}

.language-label {
  font-size: 12px;
  font-weight: 700;
  color: #7c3f00;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.language-buttons {
  display: flex;
  gap: 8px;
}

.language-button {
  border: 1px solid rgba(28, 18, 8, 0.2);
  background: #fffdf8;
  color: #5c3a1c;
  border-radius: 10px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.04em;
}

.language-button:hover {
  background: #fce6c8;
}

.language-button.active {
  background: #1b120a;
  color: #fff1dc;
  border-color: #1b120a;
}

.badge {
  align-self: flex-start;
  padding: 10px 16px;
  border-radius: 999px;
  background: #1b120a;
  color: #fff1dc;
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.workspace {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

.pane {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 24px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 16px 40px rgba(16, 12, 6, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.65);
  min-height: 520px;
}

.pane-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.pane-header h2 {
  margin: 0;
  font-size: 20px;
  color: #1f160e;
}

.pane-header p {
  margin: 6px 0 0;
  color: #6b4c35;
  font-size: 14px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.toolbar button {
  border: 1px solid rgba(28, 18, 8, 0.2);
  background: #fff8ec;
  color: #1c1208;
  border-radius: 10px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.toolbar button:hover {
  background: #fce6c8;
}

.editor {
  flex: 1;
  width: 100%;
  padding: 18px;
  border-radius: 16px;
  border: 1px solid rgba(28, 18, 8, 0.15);
  background: #fffdf8;
  font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, SFMono-Regular, Consolas, monospace;
  font-size: 14px;
  line-height: 1.7;
  color: #1f160e;
  resize: none;
  box-shadow: inset 0 1px 6px rgba(26, 20, 12, 0.08);
}

.editor:focus {
  outline: 2px solid rgba(199, 119, 42, 0.6);
}

.preview {
  flex: 1;
  padding: 12px 6px 0;
  overflow: auto;
  background: transparent;
}

.custom-preview-pane {
  grid-column: 1 / -1;
}

.preview-custom {
  padding: 12px 16px 0;
}

.preview-custom h2.custom-title {
  margin-top: 28px;
  padding-bottom: 6px;
  border-bottom: 2px solid rgba(247, 163, 70, 0.35);
  color: #6b3a0b;
  letter-spacing: 0.02em;
}

.preview-custom blockquote.custom-quote {
  margin: 18px 0;
  padding: 12px 18px;
  border-left: 4px solid #f2a357;
  background: linear-gradient(90deg, rgba(255, 239, 219, 0.7), rgba(255, 255, 255, 0.9));
  color: #5a3a1a;
  font-style: italic;
}

.preview-custom pre {
  padding: 14px 16px;
  border-radius: 12px;
  background: #f6f8fa;
  border: 1px solid rgba(27, 31, 36, 0.08);
  overflow: auto;
}

.status {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  background: rgba(255, 170, 86, 0.2);
  color: #b05a00;
}

@media (max-width: 1024px) {
  .hero {
    flex-direction: column;
  }

  .hero-actions {
    width: 100%;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .workspace {
    grid-template-columns: 1fr;
  }

  .pane {
    min-height: 420px;
  }
}
</style>
