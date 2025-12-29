import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import { MarkdownRenderer, MarkdownWorkerPoll } from '@markdown-next/vue';
import './custom.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Register markdown-next components globally
    app.component('MarkdownRenderer', MarkdownRenderer);
    app.component('MarkdownWorkerPoll', MarkdownWorkerPoll);
  },
} satisfies Theme;
