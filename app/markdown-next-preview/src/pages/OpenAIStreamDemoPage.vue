<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { MarkdownRenderer, MarkdownWorkerPoll } from '@markdown-next/vue';
import { defaultParserOptions } from '../constants/defaultParserOptions';
import { useOpenAIChatStream } from '../composables/useOpenAIChatStream';

const { t } = useI18n();
const apiBaseUrl = ref('https://api.openai.com/v1');
const apiKey = ref('');
const model = ref('gpt-4.1-mini');
const systemPrompt = ref('You are a concise assistant. Always respond in markdown.');
const userPrompt = ref(
  '写一段带有二级标题、列表、代码块和数学公式的中文 markdown，主题是“流式渲染测试”。'
);
const temperature = ref(0.7);
const showApiKey = ref(false);

const { output, isStreaming, error, chunkCount, elapsedMs, start, stop, clear } =
  useOpenAIChatStream();

const hasOutput = computed(() => output.value.trim().length > 0);

const runStream = async (): Promise<void> => {
  await start({
    apiBaseUrl: apiBaseUrl.value,
    apiKey: apiKey.value,
    model: model.value,
    systemPrompt: systemPrompt.value,
    userPrompt: userPrompt.value,
    temperature: temperature.value,
  });
};

const clearOutput = (): void => {
  clear();
};
</script>

<template>
  <div class="stream-layout">
    <section class="pane stream-control-pane">
      <div class="pane-header">
        <div>
          <h2>{{ t('stream.controlTitle') }}</h2>
          <p>{{ t('stream.controlDescription') }}</p>
        </div>
        <div class="status" :class="{ active: isStreaming }">
          {{ isStreaming ? t('stream.statusStreaming') : t('stream.statusIdle') }}
        </div>
      </div>

      <form class="stream-form" @submit.prevent="runStream">
        <label class="field">
          <span>{{ t('stream.apiBaseUrl') }}</span>
          <input
            v-model="apiBaseUrl"
            type="url"
            autocomplete="off"
            placeholder="https://api.openai.com/v1"
          />
        </label>

        <label class="field">
          <span>{{ t('stream.modelName') }}</span>
          <input v-model="model" type="text" autocomplete="off" placeholder="gpt-4.1-mini" />
        </label>

        <label class="field">
          <span>{{ t('stream.apiKey') }}</span>
          <div class="field-inline">
            <input
              v-model="apiKey"
              :type="showApiKey ? 'text' : 'password'"
              autocomplete="off"
              placeholder="sk-..."
            />
            <button type="button" class="toggle-button" @click="showApiKey = !showApiKey">
              {{ showApiKey ? t('stream.hideKey') : t('stream.showKey') }}
            </button>
          </div>
        </label>

        <label class="field">
          <span>{{ t('stream.temperature') }}: {{ temperature.toFixed(1) }}</span>
          <input v-model.number="temperature" type="range" min="0" max="2" step="0.1" />
        </label>

        <label class="field">
          <span>{{ t('stream.systemPrompt') }}</span>
          <textarea v-model="systemPrompt" rows="3" />
        </label>

        <label class="field">
          <span>{{ t('stream.userPrompt') }}</span>
          <textarea v-model="userPrompt" rows="8" />
        </label>

        <div class="actions">
          <button type="submit" class="primary" :disabled="isStreaming">
            {{ t('stream.run') }}
          </button>
          <button type="button" :disabled="!isStreaming" @click="stop">
            {{ t('stream.stop') }}
          </button>
          <button type="button" :disabled="isStreaming && !hasOutput" @click="clearOutput">
            {{ t('stream.clear') }}
          </button>
        </div>
      </form>

      <p class="hint">{{ t('stream.securityHint') }}</p>
    </section>

    <section class="pane stream-output-pane">
      <div class="pane-header">
        <div>
          <h2>{{ t('stream.outputTitle') }}</h2>
          <p>{{ t('stream.outputDescription') }}</p>
        </div>
      </div>

      <div class="stream-stats">
        <span>{{ t('stream.chunkCount') }}: {{ chunkCount }}</span>
        <span>{{ t('stream.elapsedMs') }}: {{ elapsedMs }}</span>
      </div>

      <p v-if="error" class="error-box">{{ error }}</p>

      <div v-if="hasOutput" class="preview-shell">
        <MarkdownWorkerPoll :worker-count="1" :parserOptions="defaultParserOptions">
          <MarkdownRenderer
            class="preview stream-preview"
            mode="streaming"
            :streamdown="{ parseIncompleteMarkdown: true }"
            :markdown="output"
          />
        </MarkdownWorkerPoll>
      </div>
      <div v-else class="empty-state">
        <p>{{ t('stream.emptyState') }}</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.stream-layout {
  display: grid;
  grid-template-columns: minmax(320px, 420px) minmax(0, 1fr);
  gap: 24px;
}

.stream-control-pane {
  min-height: 640px;
}

.stream-output-pane {
  min-height: 640px;
}

.stream-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field span {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.field input,
.field textarea {
  width: 100%;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--surface-panel);
  padding: 10px 12px;
  font: inherit;
  color: var(--text-primary);
}

.field textarea {
  line-height: 1.5;
  resize: vertical;
}

.field input:focus,
.field textarea:focus {
  outline: 2px solid var(--focus-ring);
  border-color: transparent;
}

.field-inline {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
}

.toggle-button {
  white-space: nowrap;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 6px;
}

.actions button {
  border: 1px solid var(--border-color);
  background: #fefaf3;
  color: var(--text-primary);
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.actions button.primary {
  background: #1e1a12;
  border-color: #1e1a12;
  color: #fff3d8;
}

.actions button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.hint {
  margin: 12px 0 0;
  color: var(--text-muted);
  font-size: 12px;
}

.stream-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.stream-stats span {
  border: 1px solid var(--border-color);
  background: var(--card-highlight);
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 12px;
  color: var(--text-muted);
}

.error-box {
  margin: 10px 0 0;
  border: 1px solid #f5aaa3;
  border-radius: 10px;
  background: #fff0ee;
  color: #b5221d;
  padding: 10px 12px;
  font-size: 13px;
  white-space: pre-wrap;
}

.preview-shell {
  flex: 1;
  min-height: 0;
  border-radius: 14px;
  border: 1px solid var(--border-color);
  background: #fffdf8;
  padding: 8px 12px 16px;
  overflow: auto;
}

.stream-preview {
  min-height: 480px;
}

.empty-state {
  display: grid;
  place-items: center;
  flex: 1;
  min-height: 320px;
  border: 1px dashed var(--border-color);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.66);
  color: var(--text-muted);
}

@media (max-width: 1100px) {
  .stream-layout {
    grid-template-columns: 1fr;
  }

  .stream-control-pane,
  .stream-output-pane {
    min-height: unset;
  }
}
</style>
