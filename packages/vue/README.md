# @markdown-next/vue

Vue 3 components and composables for rendering Markdown with support for both single-threaded and multi-threaded (Worker Pool) parsing.

## Features

- 🚀 **Single-threaded and Multi-threaded modes** - Use Worker Pool for better performance
- 🎨 **Custom Component Mapping** - Replace HTML tags with custom Vue components
- 📦 **Type-safe** - Full TypeScript support
- ⚡ **Vue 3 Composition API** - Modern Vue 3 hooks and components
- 🔧 **Extensible** - Support for GFM, MathJax, and custom plugins
- 🎯 **Error Boundary** - Built-in error handling
- ⏳ **Loading State** - Customizable loading component

## Installation

```bash
npm install @markdown-next/vue @markdown-next/parser
```

## Usage

### Single-threaded Mode

```vue
<script setup lang="ts">
import { MarkdownRenderer } from '@markdown-next/vue';

const markdown = '# Hello World\n\nThis is **bold** text.';
</script>

<template>
  <MarkdownRenderer
    :content="markdown"
    :extended-grammar="['gfm']"
  />
</template>
```

### Multi-threaded Mode (Worker Pool)

```vue
<script setup lang="ts">
import { WorkerPoolProvider, MarkdownRenderer } from '@markdown-next/vue';

const markdown = '# Hello World\n\nThis is **bold** text.';
</script>

<template>
  <WorkerPoolProvider :worker-count="4" :extended-grammar="['gfm']">
    <MarkdownRenderer :content="markdown" />
  </WorkerPoolProvider>
</template>
```

### Custom Component Mapping

```vue
<script setup lang="ts">
import { MarkdownRenderer } from '@markdown-next/vue';
import { defineComponent, h } from 'vue';

const CustomEm = defineComponent({
  setup(props, { slots }) {
    return () => h('i', { style: { color: 'red' } }, slots.default?.());
  }
});

const components = {
  // Map h1 to h2
  h1: 'h2',

  // Use custom component for em tags
  em: CustomEm,

  // Use render function
  strong(props) {
    const { node, ...rest } = props;
    return h('strong', { style: { color: 'blue' }, ...rest }, props.children);
  }
};

const markdown = '# Heading\n\n*italic* and **bold**';
</script>

<template>
  <MarkdownRenderer
    :content="markdown"
    :components="components"
  />
</template>
```

### Using Hooks

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useParser } from '@markdown-next/vue';

const { parseToHTML } = useParser({
  extendedGrammar: ['gfm', 'mathjax']
});

const markdown = ref('# Hello World');
const html = ref('');

const render = async () => {
  html.value = await parseToHTML(markdown.value);
};

render();
</script>

<template>
  <div v-html="html"></div>
</template>
```

### Using Worker Pool Hook

```vue
<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue';
import { useWorkerPool } from '@markdown-next/vue';

const { parseToHTML, getPoolInfo, pool } = useWorkerPool({
  workerCount: 4,
  extendedGrammar: ['gfm']
});

const markdown = ref('# Hello World');
const html = ref('');

const render = async () => {
  html.value = await parseToHTML(markdown.value);
};

render();

console.log(getPoolInfo()); // { workerCount: 4, maxWorkers: 8, ... }
</script>

<template>
  <div v-html="html"></div>
</template>
```

## API

### Components

#### `MarkdownRenderer`

Renders Markdown content as Vue VNode.

**Props:**
- `content` (string, required) - Markdown content
- `components` (ComponentsMap) - Custom component mapping
- `loadingComponent` (Component) - Custom loading component
- `errorComponent` (Component) - Custom error component
- `customTags` (string[]) - Custom HTML tags (single-threaded only)
- `extendedGrammar` (Array<'gfm' | 'mathjax'>) - Extended grammar (single-threaded only)
- `remarkPlugins` (PluggableList) - Remark plugins (single-threaded only)
- `rehypePlugins` (PluggableList) - Rehype plugins (single-threaded only)
- `mathJaxConfig` (object) - MathJax config (single-threaded only)
- `supportsLaTeX` (boolean) - LaTeX syntax support (single-threaded only)

#### `WorkerPoolProvider`

Manages a global Worker pool for multi-threaded parsing.

**Props:**
- `workerCount` (number) - Number of workers
- `customTags` (string[]) - Custom HTML tags
- `extendedGrammar` (Array<'gfm' | 'mathjax'>) - Extended grammar
- `remarkPlugins` (PluggableList) - Remark plugins
- `rehypePlugins` (PluggableList) - Rehype plugins
- `mathJaxConfig` (object) - MathJax config
- `supportsLaTeX` (boolean) - LaTeX syntax support

### Hooks

#### `useParser(options?: ParserOptions)`

Creates a single-threaded Markdown parser.

**Returns:**
- `parseToHTML(markdown: string): Promise<string>`
- `parseToHAST(markdown: string): Promise<Root>`
- `batchParseToHTML(markdowns: string[]): Promise<string[]>`
- `batchParseToHAST(markdowns: string[]): Promise<Root[]>`
- `parser: Ref<Parser>`

#### `useWorkerPool(options?: WorkerPoolOptions)`

Creates a multi-threaded Markdown parser with Worker pool.

**Returns:**
- `parseToHTML(markdown: string): Promise<string>`
- `parseToHAST(markdown: string): Promise<Root>`
- `batchParseToHTML(markdowns: string[]): Promise<string[]>`
- `batchParseToHAST(markdowns: string[]): Promise<Root[]>`
- `updateOptions(options: Partial<WorkerPoolOptions>): Promise<void>`
- `getPoolInfo(): PoolInfo`
- `pool: Ref<ParserWorkerPool>`

#### `useWorkerPoolContext()`

Gets the Worker pool context from parent `WorkerPoolProvider`.

**Returns:** `{ pool: ParserWorkerPool, options: ParserOptions } | null`

## License

MIT
