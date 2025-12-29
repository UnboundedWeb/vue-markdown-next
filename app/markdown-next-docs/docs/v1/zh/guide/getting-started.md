# 快速开始

欢迎使用 Markdown Next！本指南将帮助你快速上手 markdown 解析器和 Vue 渲染器。

## 什么是 Markdown Next？

Markdown Next 是一个为 Vue 3 应用打造的高性能 markdown 解析和渲染解决方案。它包含两个包：

- **@markdown-next/parser**：核心 markdown 解析器，支持 GFM、MathJax 和 Worker 池
- **@markdown-next/vue**：用于渲染解析后的 markdown 的 Vue 3 组件

## 快速上手

### 安装

::: code-group

```bash [npm]
npm install @markdown-next/parser @markdown-next/vue
```

```bash [pnpm]
pnpm add @markdown-next/parser @markdown-next/vue
```

```bash [yarn]
yarn add @markdown-next/parser @markdown-next/vue
```

:::

### 基础用法

下面是使用 `MarkdownRenderer` 组件的简单示例：

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { MarkdownRenderer } from '@markdown-next/vue';

const markdown = ref('# 你好世界\n\n这是 **markdown**！');
</script>

<template>
  <MarkdownRenderer :markdown="markdown" />
</template>
```

### 配置解析器选项

你可以自定义解析器行为：

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { MarkdownRenderer } from '@markdown-next/vue';
import type { ParserOptions } from '@markdown-next/parser';

const markdown = ref(`
# 数学公式示例

行内公式：$E = mc^2$

块级公式：
$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

Latex行内公式：\(E = mc^2\)

Latex块级公式：
\[
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
\]
`);

const parserOptions: ParserOptions = {
  supportsLaTeX: true,
  extendedGrammar: ['gfm', 'mathjax'],
};
</script>

<template>
  <MarkdownRenderer :markdown="markdown" :parserOptions="parserOptions" />
</template>
```

## 下一步

- 了解 [解析器配置](/v1/zh/guide/parser)
- 探索 [Vue 渲染器选项](/v1/zh/guide/vue-renderer)
- 查看 [示例](/v1/zh/examples/basic)
