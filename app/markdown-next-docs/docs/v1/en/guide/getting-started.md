# Getting Started

Welcome to Markdown Next! This guide will help you get started with using the markdown parser and Vue renderer.

## What is Markdown Next?

Markdown Next is a high-performance markdown parsing and rendering solution for Vue 3 applications. It consists of two packages:

- **@markdown-next/parser**: Core markdown parser with support for GFM, MathJax, and worker pools
- **@markdown-next/vue**: Vue 3 components for rendering parsed markdown

## Quick Start

### Installation

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

### Basic Usage

Here's a simple example of using the `MarkdownRenderer` component:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { MarkdownRenderer } from '@markdown-next/vue';

const markdown = ref('# Hello World\n\nThis is **markdown**!');
</script>

<template>
  <MarkdownRenderer :markdown="markdown" />
</template>
```

### With Parser Options

You can customize the parser behavior:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { MarkdownRenderer } from '@markdown-next/vue';
import type { ParserOptions } from '@markdown-next/parser';

const markdown = ref(`
# Math Example

Inline math: $E = mc^2$

Block math:
$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$
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

## Next Steps

- Learn about [Parser configuration](/v1/en/guide/parser)
- Explore [Vue Renderer options](/v1/en/guide/vue-renderer)
- Check out [Examples](/v1/en/examples/basic)
