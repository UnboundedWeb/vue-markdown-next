# @markdown-next/vue

Vue 3 components and composables for rendering markdown.

## Components

### MarkdownRenderer

Main component for rendering markdown content.

```ts
defineComponent({
  name: 'MarkdownRenderer',
  props: {
    markdown: {
      type: String,
      required: true,
    },
    parserOptions: {
      type: Object as PropType<ParserOptions>,
      required: false,
      default: undefined,
    },
    components: {
      type: Object as PropType<MarkdownComponents>,
      required: false,
      default: undefined,
    },
    codeRenderer: {
      type: [Object, Function, String] as PropType<MarkdownComponent>,
      required: false,
      default: undefined,
    },
    dynamic: {
      type: Boolean,
      default: false,
    },
    debounceMs: {
      type: Number,
      default: 250,
    },
    loadingSlot: {
      type: [Object, Function] as PropType<LoadingSlot>,
      required: false,
      default: undefined,
    },
  },
});
```

**Props:**

| Prop            | Type                 | Required | Default     | Description                |
| --------------- | -------------------- | -------- | ----------- | -------------------------- |
| `markdown`      | `string`             | Yes      | -           | Markdown content to render |
| `parserOptions` | `ParserOptions`      | No       | `undefined` | Parser configuration       |
| `components`    | `MarkdownComponents` | No       | `undefined` | Custom component overrides |
| `codeRenderer`  | `MarkdownComponent`  | No       | `undefined` | Custom code renderer       |
| `dynamic`       | `boolean`            | No       | `false`     | Enable reactive updates    |
| `debounceMs`    | `number`             | No       | `250`       | Debounce delay (ms)        |
| `loadingSlot`   | `LoadingSlot`        | No       | `undefined` | Custom loading component   |

**Emits:**

None

**Slots:**

None

### MarkdownWorkerPoll

Wrapper component providing worker pool context.

```ts
defineComponent({
  name: 'MarkdownWorkerPoll',
  props: {
    workerCount: {
      type: Number,
      default: 1,
    },
    parserOptions: {
      type: Object as PropType<ParserOptions>,
      default: undefined,
    },
    renderOptions: {
      type: Object as PropType<MarkdownRenderOptions>,
      default: undefined,
    },
    forceRenderOptions: {
      type: Boolean,
      default: false,
    },
    loadingSlot: {
      type: [Object, Function] as PropType<LoadingSlot>,
      required: false,
      default: undefined,
    },
  },
});
```

**Props:**

| Prop                 | Type                    | Required | Default     | Description               |
| -------------------- | ----------------------- | -------- | ----------- | ------------------------- |
| `workerCount`        | `number`                | No       | `1`         | Number of workers         |
| `parserOptions`      | `ParserOptions`         | No       | `undefined` | Parser configuration      |
| `renderOptions`      | `MarkdownRenderOptions` | No       | `undefined` | Render options            |
| `forceRenderOptions` | `boolean`               | No       | `false`     | Force options on children |
| `loadingSlot`        | `LoadingSlot`           | No       | `undefined` | Custom loading component  |

**Slots:**

| Slot      | Props | Description                              |
| --------- | ----- | ---------------------------------------- |
| `default` | -     | Content with MarkdownRenderer components |

## Composables

### useMarkdownParser

Parse and render markdown content.

```ts
function useMarkdownParser(
  markdown: Ref<string>,
  parserOptions?: ParserOptions,
  renderOptions?: MarkdownRenderOptions
): UseMarkdownResult;
```

**Parameters:**

- `markdown`: Reactive markdown content
- `parserOptions`: Parser configuration
- `renderOptions`: Rendering options

**Returns:**

```ts
interface UseMarkdownResult {
  /**
   * Rendered VNode content
   */
  content: Ref<VNode | null>;

  /**
   * Loading state
   */
  loading: Ref<boolean>;

  /**
   * Error state
   */
  error: Ref<Error | null>;
}
```

**Example:**

```ts
import { ref } from 'vue';
import { useMarkdownParser } from '@markdown-next/vue';

const markdown = ref('# Hello World');

const { content, loading, error } = useMarkdownParser(
  markdown,
  { extendedGrammar: ['gfm'] },
  { dynamic: true }
);
```

### useMarkdownWorkerPool

Parse markdown using a worker pool.

```ts
function useMarkdownWorkerPool(
  markdown: Ref<string>,
  pool: MarkdownWorkerPool,
  renderOptions?: MarkdownRenderOptions
): UseMarkdownResult;
```

**Parameters:**

- `markdown`: Reactive markdown content
- `pool`: Worker pool instance
- `renderOptions`: Rendering options

**Returns:** `UseMarkdownResult`

**Example:**

```ts
import { ref } from 'vue';
import { useMarkdownWorkerPool } from '@markdown-next/vue';
import { MarkdownWorkerPool } from '@markdown-next/parser';

const pool = new MarkdownWorkerPool({ workerCount: 2 });
const markdown = ref('# Hello');

const { content, loading, error } = useMarkdownWorkerPool(markdown, pool, { dynamic: true });

// Remember to terminate the pool
onUnmounted(() => {
  pool.terminate();
});
```

## Types

### MarkdownComponents

Custom component map for overriding default HTML elements.

```ts
type MarkdownComponents = {
  [K in keyof HTMLElementTagNameMap]?: MarkdownComponent;
};
```

**Example:**

```ts
import { h } from 'vue';
import type { MarkdownComponents } from '@markdown-next/vue';

const components: MarkdownComponents = {
  h1: (props, { slots }) => h('h1', { class: 'custom-heading' }, slots.default?.()),
  a: (props, { slots }) =>
    h(
      'a',
      {
        ...props,
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      slots.default?.()
    ),
};
```

### MarkdownComponent

Component function for custom rendering.

```ts
type MarkdownComponent =
  | Component
  | ((props: Record<string, unknown>, context: { slots: Slots }) => VNode)
  | string;
```

### LoadingSlot

Custom loading state component or function.

```ts
type LoadingSlot = Component | FunctionalComponent | (() => VNodeChild);
```

Used to customize the loading state displayed while markdown content is being parsed. Can be a Vue component, functional component, or a function that returns a VNode.

### MarkdownRenderOptions

Options for markdown rendering.

```ts
interface MarkdownRenderOptions {
  /**
   * Custom component overrides
   */
  components?: MarkdownComponents;

  /**
   * Custom code block renderer
   */
  codeRenderer?: MarkdownComponent;

  /**
   * Enable reactive updates
   * @default false
   */
  dynamic?: boolean;

  /**
   * Debounce delay in milliseconds
   * @default 250
   */
  debounceMs?: number;

  /**
   * Custom loading state component
   */
  loadingSlot?: LoadingSlot;
}
```

### MarkdownRendererProps

Props interface for MarkdownRenderer component.

```ts
interface MarkdownRendererProps {
  markdown: string;
  parserOptions?: ParserOptions;
  components?: MarkdownComponents;
  codeRenderer?: MarkdownComponent;
  dynamic?: boolean;
  debounceMs?: number;
  loadingSlot?: LoadingSlot;
}
```

### MarkdownWorkerPollProps

Props interface for MarkdownWorkerPoll component.

```ts
interface MarkdownWorkerPollProps {
  workerCount?: number;
  parserOptions?: ParserOptions;
  renderOptions?: MarkdownRenderOptions;
  forceRenderOptions?: boolean;
  components?: MarkdownComponents;
  codeRenderer?: MarkdownComponent;
  dynamic?: boolean;
  debounceMs?: number;
  loadingSlot?: LoadingSlot;
}
```

## Context

### markdownWorkerContextKey

Injection key for worker pool context.

```ts
const markdownWorkerContextKey: InjectionKey<MarkdownWorkerContext>;
```

**Usage:**

```ts
import { inject } from 'vue';
import { markdownWorkerContextKey } from '@markdown-next/vue';

const context = inject(markdownWorkerContextKey);
if (context) {
  console.log('Worker pool available');
}
```

## Utility Functions

### toError

Converts unknown error to Error instance.

```ts
function toError(err: unknown): Error;
```

## Styles

### githubContainerStyle

Default GitHub-flavored styling for markdown container.

```ts
const githubContainerStyle: StyleValue;
```

This provides GitHub-like styling for:

- Typography (headings, paragraphs, lists)
- Code blocks
- Tables
- Blockquotes
- Links
- Images

**Override:**

```vue
<template>
  <MarkdownRenderer :markdown="markdown" :style="customStyle" />
</template>

<script setup lang="ts">
const customStyle = {
  fontFamily: 'Your Font',
  fontSize: '16px',
  lineHeight: '1.6',
};
</script>
```
