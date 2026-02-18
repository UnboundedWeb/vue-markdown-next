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
    mode: {
      type: String as PropType<MarkdownRenderMode>,
      required: false,
      default: 'static',
    },
    streamdown: {
      type: Object as PropType<MarkdownStreamdownOptions>,
      required: false,
      default: undefined,
    },
    dynamic: {
      type: Boolean,
      required: false,
      default: undefined,
    },
    debounceMs: {
      type: Number,
      required: false,
      default: undefined,
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

| Prop            | Type                        | Required | Default     | Description                 |
| --------------- | --------------------------- | -------- | ----------- | --------------------------- |
| `markdown`      | `string`                    | Yes      | -           | Markdown content to render  |
| `parserOptions` | `ParserOptions`             | No       | `undefined` | Parser configuration        |
| `components`    | `MarkdownComponents`        | No       | `undefined` | Custom component overrides  |
| `codeRenderer`  | `MarkdownComponent`         | No       | `undefined` | Custom code renderer        |
| `mode`          | `'static' \| 'streaming'`   | No       | `'static'`  | Rendering mode              |
| `streamdown`    | `MarkdownStreamdownOptions` | No       | `undefined` | Streaming behavior options  |
| `dynamic`       | `boolean`                   | No       | mode-aware  | Whether to debounce updates |
| `debounceMs`    | `number`                    | No       | mode-aware  | Debounce delay (ms)         |
| `loadingSlot`   | `LoadingSlot`               | No       | `undefined` | Custom loading component    |

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
    mode: {
      type: String as PropType<MarkdownRenderMode>,
      required: false,
      default: undefined,
    },
    streamdown: {
      type: Object as PropType<MarkdownStreamdownOptions>,
      required: false,
      default: undefined,
    },
    dynamic: {
      type: Boolean,
      required: false,
      default: undefined,
    },
    debounceMs: {
      type: Number,
      required: false,
      default: undefined,
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

| Prop            | Type                        | Required | Default     | Description                            |
| --------------- | --------------------------- | -------- | ----------- | -------------------------------------- |
| `workerCount`   | `number`                    | Yes      | -           | Number of workers                      |
| `parserOptions` | `ParserOptions`             | No       | `undefined` | Parser configuration                   |
| `components`    | `MarkdownComponents`        | No       | `undefined` | Force component overrides for children |
| `codeRenderer`  | `MarkdownComponent`         | No       | `undefined` | Force code renderer for children       |
| `mode`          | `'static' \| 'streaming'`   | No       | `undefined` | Force rendering mode for children      |
| `streamdown`    | `MarkdownStreamdownOptions` | No       | `undefined` | Force streamdown behavior for children |
| `dynamic`       | `boolean`                   | No       | `undefined` | Force debounce scheduling behavior     |
| `debounceMs`    | `number`                    | No       | `undefined` | Force debounce delay (ms)              |
| `loadingSlot`   | `LoadingSlot`               | No       | `undefined` | Custom loading component               |

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
  { mode: 'streaming' }
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

const { content, loading, error } = useMarkdownWorkerPool(markdown, pool, {
  mode: 'streaming',
});

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

### MarkdownRenderMode

Rendering mode used by `MarkdownRenderer`.

```ts
type MarkdownRenderMode = 'static' | 'streaming';
```

- `static`: render the full markdown document as a single parse unit.
- `streaming`: streamdown mode, parse markdown by blocks and reuse unchanged blocks.

### MarkdownStreamdownOptions

Streamdown options used when `mode` is `streaming`.

```ts
interface MarkdownStreamdownOptions {
  /**
   * Repairs incomplete markdown markers while streaming.
   * @default true
   */
  parseIncompleteMarkdown?: boolean;
}
```

### MarkdownRenderOptions

Options for markdown rendering.

```ts
interface MarkdownRenderOptions {
  /**
   * Rendering mode.
   * @default 'static'
   */
  mode?: MarkdownRenderMode;

  /**
   * Streamdown options.
   */
  streamdown?: MarkdownStreamdownOptions;

  /**
   * Custom component overrides
   */
  components?: MarkdownComponents;

  /**
   * Custom code block renderer
   */
  codeRenderer?: MarkdownComponent;

  /**
   * Whether to debounce updates.
   * @default false in static mode, true in streaming mode
   */
  dynamic?: boolean;

  /**
   * Debounce delay in milliseconds.
   * @default 250 in static mode, 80 in streaming mode
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
  mode?: MarkdownRenderMode;
  streamdown?: MarkdownStreamdownOptions;
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
interface MarkdownWorkerPollProps extends MarkdownRenderOptions {
  parserOptions?: ParserOptions;
  workerCount?: number;
  customTags?: string[];
  extendedGrammar?: ParserOptions['extendedGrammar'];
  remarkPlugins?: ParserOptions['remarkPlugins'];
  rehypePlugins?: ParserOptions['rehypePlugins'];
  mathJaxConfig?: ParserOptions['mathJaxConfig'];
  supportsLaTeX?: ParserOptions['supportsLaTeX'];
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
