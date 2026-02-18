import { createApp, defineComponent, h, ref } from 'vue';
import type { ParserWorkerPool } from '@markdown-next/parser';
import { MarkdownRenderer, MarkdownWorkerPoll } from '@markdown-next/vue';

const App = defineComponent({
  name: 'E2EReadyHarness',
  setup() {
    const readyState = ref<'pending' | 'ready'>('pending');
    const stats = ref('');
    const readyError = ref('');

    const onReady = (pool: ParserWorkerPool): void => {
      try {
        readyState.value = 'ready';
        stats.value = JSON.stringify(pool.getStats());
      } catch (error) {
        readyError.value = error instanceof Error ? error.message : String(error);
      }
    };

    return () =>
      h('main', { style: 'padding: 12px; font-family: ui-sans-serif, system-ui;' }, [
        h('p', { id: 'ready-state' }, readyState.value),
        h('p', { id: 'stats-json' }, stats.value),
        h('p', { id: 'ready-error' }, readyError.value),
        h(
          MarkdownWorkerPoll,
          {
            workerCount: 1,
            parserOptions: { extendedGrammar: ['gfm'] },
            onReady,
          },
          {
            default: () =>
              h(MarkdownRenderer, {
                markdown: '# Worker Ready Event',
                dynamic: true,
              }),
          }
        ),
      ]);
  },
});

createApp(App).mount('#app');
