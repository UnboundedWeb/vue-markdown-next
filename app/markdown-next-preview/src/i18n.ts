import { createI18n } from 'vue-i18n';

export const markdownSamples = {
  zh: `# Markdown Next · Vue Preview

欢迎来到 \`packages/vue\` 的测试页面。这一页用来验证渲染器的稳定性与实时反馈。

## 为什么选择 markdown-next
- Vue 友好 支持自定义Vnode渲染节点，可拓展交互 / 样式
- 解析与渲染分离。支持组件式线程池管理
- 开箱即用，GitHub 风格主题直接可用
- 无CSS文依赖
- 默认支持数学公式渲染（worker内解析），支持Tex & Latex两种格式
- 默认支持gfm拓展markdown语法
- 默认安全：HTML 会先被解析，但最终只保留白名单允许的标签/属性，其它都会被过滤。
- 可自定义：通过 customTags 加入自定义标签名单，白名单内的标签会被正常渲染。

$ 10=y^2 $

## i18n 示例
点击右上角语言按钮可切换界面文本。此段示例不会覆盖已编辑内容。

## 示例代码
\`\`\`ts
import { MarkdownRenderer } from '@markdown-next/vue';
\`\`\`

> 左侧编辑，右侧立即渲染。试着修改标题或列表。
`,
  en: `# Markdown Next · Vue Preview

Welcome to the \`packages/vue\` test page. Use this page to validate rendering stability and instant feedback.

## Why markdown-next
- Vue friendly: customizable VNode render targets and extensible interactions
- Parsing and rendering are decoupled with a worker pool
- GitHub-style theme out of the box
- No CSS dependency
- Built-in math support (worker parsing), Tex & LaTeX formats
- GFM extension supported by default
- Safe by default: HTML is parsed but only whitelisted tags/attributes survive
- Fully customizable via \`customTags\`

$ 10=y^2 $

## i18n demo
Use the language switcher in the top-right to toggle UI text. This demo avoids overwriting edited content.

## Sample code
\`\`\`ts
import { MarkdownRenderer } from '@markdown-next/vue';
\`\`\`

> Edit on the left and see the render update instantly.
  `,
} as const;

export type Locale = keyof typeof markdownSamples;

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'en',
  fallbackLocale: 'en',
  escapeParameter: true,
  messages: {
    zh: {
      app: {
        eyebrow: 'packages/vue · playground',
        title: 'Markdown Next Preview',
        subtitle:
          '统一预览台：左侧保留编辑器测试，新增 OpenAI 流式演示页面用于验证 streamdown 行为。',
        badge: 'Test Suite',
      },
      navigation: {
        label: '页面模式',
        playground: '编辑器预览',
        stream: 'OpenAI 流式演示',
      },
      language: {
        label: '语言',
        zh: '中文',
        en: 'English',
      },
      playground: {
        wordCount: '词数',
        charCount: '字符数',
        workerCount: 'Worker 数',
      },
      editor: {
        title: 'Markdown 编辑器',
        description: '轻量自定义编辑器，保持输入响应迅速。',
        placeholder: '在这里输入 markdown...',
      },
      toolbar: {
        bold: '加粗',
        italic: '斜体',
        code: '代码',
        h1: 'H1',
        list: '列表',
      },
      preview: {
        title: '实时渲染',
        description: "由 {'@'}markdown-next/vue 渲染，带 GitHub 风格主题。",
      },
      customPreview: {
        title: '自定义渲染样式',
        description: '自定义组件 + Highlight.js 代码高亮。',
      },
      status: {
        live: 'Live',
        custom: 'Custom',
      },
      stream: {
        controlTitle: 'OpenAI 配置',
        controlDescription: '填写 API 参数并发起流式请求，右侧实时验证 markdown 渲染效果。',
        statusStreaming: 'Streaming',
        statusIdle: 'Idle',
        apiBaseUrl: 'API Base URL',
        modelName: '模型名称',
        apiKey: 'API Key',
        showKey: '显示',
        hideKey: '隐藏',
        temperature: 'Temperature',
        systemPrompt: 'System Prompt',
        userPrompt: 'User Prompt',
        run: '开始流式请求',
        stop: '停止',
        clear: '清空输出',
        securityHint: '提示：API Key 仅保留在当前页面内存，不会写入本地存储。',
        outputTitle: '实时渲染输出',
        outputDescription: '使用 @markdown-next/vue 的 streaming 模式渲染逐块增量内容。',
        chunkCount: 'Chunk 数',
        elapsedMs: '耗时(ms)',
        emptyState: '等待输出。先填写配置并点击“开始流式请求”。',
      },
    },
    en: {
      app: {
        eyebrow: 'packages/vue · playground',
        title: 'Markdown Next Preview',
        subtitle:
          'Unified preview lab: keep editor-driven testing and add an OpenAI streaming page to validate streamdown behavior.',
        badge: 'Test Suite',
      },
      navigation: {
        label: 'Page Mode',
        playground: 'Editor Preview',
        stream: 'OpenAI Stream Demo',
      },
      language: {
        label: 'Language',
        zh: '中文',
        en: 'English',
      },
      playground: {
        wordCount: 'Words',
        charCount: 'Chars',
        workerCount: 'Workers',
      },
      editor: {
        title: 'Markdown Editor',
        description: 'A lightweight editor with fast input response.',
        placeholder: 'Write markdown here...',
      },
      toolbar: {
        bold: 'Bold',
        italic: 'Italic',
        code: 'Code',
        h1: 'H1',
        list: 'List',
      },
      preview: {
        title: 'Live Render',
        description: "Rendered by {'@'}markdown-next/vue with a GitHub-style theme.",
      },
      customPreview: {
        title: 'Custom Render Styles',
        description: 'Custom components + Highlight.js syntax highlighting.',
      },
      status: {
        live: 'Live',
        custom: 'Custom',
      },
      stream: {
        controlTitle: 'OpenAI Configuration',
        controlDescription:
          'Fill API parameters and start streaming. Use the right panel to verify markdown rendering in real time.',
        statusStreaming: 'Streaming',
        statusIdle: 'Idle',
        apiBaseUrl: 'API Base URL',
        modelName: 'Model Name',
        apiKey: 'API Key',
        showKey: 'Show',
        hideKey: 'Hide',
        temperature: 'Temperature',
        systemPrompt: 'System Prompt',
        userPrompt: 'User Prompt',
        run: 'Start Stream',
        stop: 'Stop',
        clear: 'Clear Output',
        securityHint:
          'Note: API key stays in page memory only and is never persisted to local storage.',
        outputTitle: 'Live Render Output',
        outputDescription:
          'Renders incremental markdown blocks using @markdown-next/vue streaming mode.',
        chunkCount: 'Chunks',
        elapsedMs: 'Elapsed(ms)',
        emptyState: 'Waiting for output. Fill the form and click "Start Stream".',
      },
    },
  },
});
