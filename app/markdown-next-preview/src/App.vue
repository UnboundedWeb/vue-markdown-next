<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Locale } from './i18n';
import MarkdownPlaygroundPage from './pages/MarkdownPlaygroundPage.vue';
import OpenAIStreamDemoPage from './pages/OpenAIStreamDemoPage.vue';

type PreviewPage = 'playground' | 'stream';

const { t, locale } = useI18n();
const currentLocale = computed(() => locale.value as Locale);

const resolvePageFromHash = (): PreviewPage => {
  if (typeof window === 'undefined') return 'playground';
  return window.location.hash === '#stream' ? 'stream' : 'playground';
};

const currentPage = ref<PreviewPage>(resolvePageFromHash());

const syncPageFromHash = (): void => {
  currentPage.value = resolvePageFromHash();
};

onMounted(() => {
  syncPageFromHash();
  window.addEventListener('hashchange', syncPageFromHash);
});

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', syncPageFromHash);
});

const setPage = (page: PreviewPage): void => {
  currentPage.value = page;
  if (typeof window === 'undefined') return;
  const nextHash = page === 'stream' ? '#stream' : '#playground';
  if (window.location.hash !== nextHash) {
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${window.location.search}${nextHash}`
    );
  }
};

const pageTabs = computed(() => [
  { value: 'playground' as const, label: t('navigation.playground') },
  { value: 'stream' as const, label: t('navigation.stream') },
]);

const localeOptions = computed(() => [
  { value: 'zh', label: t('language.zh') },
  { value: 'en', label: t('language.en') },
]);

const setLocale = (value: Locale): void => {
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
        <div class="page-tabs" role="tablist" :aria-label="t('navigation.label')">
          <button
            v-for="tab in pageTabs"
            :key="tab.value"
            class="page-tab"
            :class="{ active: currentPage === tab.value }"
            type="button"
            role="tab"
            :aria-selected="currentPage === tab.value"
            @click="setPage(tab.value)"
          >
            {{ tab.label }}
          </button>
        </div>
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

    <MarkdownPlaygroundPage v-if="currentPage === 'playground'" />
    <OpenAIStreamDemoPage v-else />
  </div>
</template>

<style>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 100vh;
  padding: 32px clamp(18px, 4vw, 52px) 56px;
}

.hero {
  display: flex;
  justify-content: space-between;
  gap: 22px;
  padding: 24px 28px;
  border-radius: 22px;
  background: linear-gradient(
    128deg,
    rgba(255, 255, 255, 0.88) 0%,
    rgba(255, 242, 224, 0.94) 48%,
    rgba(255, 231, 204, 0.95) 100%
  );
  box-shadow: 0 16px 36px rgba(38, 20, 2, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.9);
}

.hero-actions {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 11px;
  font-weight: 700;
  color: #7b3b00;
}

h1 {
  margin: 6px 0 0;
  font-size: clamp(26px, 3.2vw, 40px);
  color: var(--text-primary);
}

.subtitle {
  margin: 8px 0 0;
  max-width: 660px;
  color: var(--text-muted);
  font-size: 15px;
}

.page-tabs {
  margin-top: 16px;
  display: inline-flex;
  gap: 8px;
  padding: 6px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid var(--border-color);
}

.page-tab {
  border: 1px solid transparent;
  background: transparent;
  color: #5b3b22;
  border-radius: 10px;
  padding: 7px 12px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.page-tab.active {
  background: #19140e;
  border-color: #19140e;
  color: #ffeecf;
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
  padding: 10px 14px;
  border-radius: 999px;
  background: #1b120a;
  color: #fff1dc;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.pane {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 22px;
  border-radius: 18px;
  background: var(--surface-card);
  box-shadow: 0 14px 36px rgba(16, 12, 6, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.8);
  min-height: 480px;
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
  color: var(--text-muted);
  font-size: 14px;
}

.status {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: #ffe5c6;
  color: #934604;
}

.status.active {
  background: #1f1a12;
  color: #ffe7c0;
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
  border: 1px solid var(--border-color);
  background: #fffdf8;
  font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, SFMono-Regular, Consolas, monospace;
  font-size: 14px;
  line-height: 1.7;
  color: #1f160e;
  resize: none;
  box-shadow: inset 0 1px 6px rgba(26, 20, 12, 0.08);
}

.editor:focus {
  outline: 2px solid var(--focus-ring);
}

.preview {
  flex: 1;
  padding: 10px 4px 0;
  overflow: auto;
  background: transparent;
}

.preview-custom {
  padding: 12px 16px 0;
}

.preview-custom h2.custom-title {
  margin-top: 28px;
  padding-bottom: 6px;
  border-bottom: 2px solid rgba(247, 163, 70, 0.35);
  color: #6b3a0b;
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

.custom-preview-pane {
  grid-column: 1 / -1;
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

  .pane {
    min-height: 420px;
  }
}
</style>
