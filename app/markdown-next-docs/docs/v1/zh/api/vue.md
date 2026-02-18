# @markdown-next/vue

用于渲染 markdown 的 Vue 3 组件和组合式函数。

## 组件

### MarkdownRenderer

用于渲染 markdown 内容的主要组件。

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

**属性：**

| 属性            | 类型                        | 必需 | 默认值       | 说明                   |
| --------------- | --------------------------- | ---- | ------------ | ---------------------- |
| `markdown`      | `string`                    | 是   | -            | 要渲染的 markdown 内容 |
| `parserOptions` | `ParserOptions`             | 否   | `undefined`  | 解析器配置             |
| `components`    | `MarkdownComponents`        | 否   | `undefined`  | 自定义组件覆盖         |
| `codeRenderer`  | `MarkdownComponent`         | 否   | `undefined`  | 自定义代码渲染器       |
| `mode`          | `'static' \| 'streaming'`   | 否   | `'static'`   | 渲染模式               |
| `streamdown`    | `MarkdownStreamdownOptions` | 否   | `undefined`  | 流式渲染行为选项       |
| `dynamic`       | `boolean`                   | 否   | 与 mode 相关 | 是否开启防抖调度       |
| `debounceMs`    | `number`                    | 否   | 与 mode 相关 | 防抖延迟（毫秒）       |
| `loadingSlot`   | `LoadingSlot`               | 否   | `undefined`  | 自定义加载状态组件     |

**事件：**

无

**插槽：**

无

### MarkdownWorkerPoll

提供 worker 池上下文的包装组件。

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

**属性：**

| 属性            | 类型                        | 必需 | 默认值      | 说明                           |
| --------------- | --------------------------- | ---- | ----------- | ------------------------------ |
| `workerCount`   | `number`                    | 是   | -           | Worker 数量                    |
| `parserOptions` | `ParserOptions`             | 否   | `undefined` | 解析器配置                     |
| `components`    | `MarkdownComponents`        | 否   | `undefined` | 强制子组件使用自定义组件       |
| `codeRenderer`  | `MarkdownComponent`         | 否   | `undefined` | 强制子组件使用代码渲染器       |
| `mode`          | `'static' \| 'streaming'`   | 否   | `undefined` | 强制子组件使用渲染模式         |
| `streamdown`    | `MarkdownStreamdownOptions` | 否   | `undefined` | 强制子组件使用流式渲染行为配置 |
| `dynamic`       | `boolean`                   | 否   | `undefined` | 强制子组件使用防抖调度策略     |
| `debounceMs`    | `number`                    | 否   | `undefined` | 强制子组件使用防抖延迟（毫秒） |
| `loadingSlot`   | `LoadingSlot`               | 否   | `undefined` | 自定义加载状态组件             |

**插槽：**

| 插槽      | 属性 | 说明                             |
| --------- | ---- | -------------------------------- |
| `default` | -    | 包含 MarkdownRenderer 组件的内容 |

## 组合式函数

### useMarkdownParser

解析和渲染 markdown 内容。

```ts
function useMarkdownParser(
  markdown: Ref<string>,
  parserOptions?: ParserOptions,
  renderOptions?: MarkdownRenderOptions
): UseMarkdownResult;
```

**参数：**

- `markdown`: 响应式的 markdown 内容
- `parserOptions`: 解析器配置
- `renderOptions`: 渲染选项

**返回：**

```ts
interface UseMarkdownResult {
  /**
   * 渲染的 VNode 内容
   */
  content: Ref<VNode | null>;

  /**
   * 加载状态
   */
  loading: Ref<boolean>;

  /**
   * 错误状态
   */
  error: Ref<Error | null>;
}
```

**示例：**

```ts
import { ref } from 'vue';
import { useMarkdownParser } from '@markdown-next/vue';

const markdown = ref('# 你好世界');

const { content, loading, error } = useMarkdownParser(
  markdown,
  { extendedGrammar: ['gfm'] },
  { mode: 'streaming' }
);
```

### useMarkdownWorkerPool

使用 worker 池解析 markdown。

```ts
function useMarkdownWorkerPool(
  markdown: Ref<string>,
  pool: MarkdownWorkerPool,
  renderOptions?: MarkdownRenderOptions
): UseMarkdownResult;
```

**参数：**

- `markdown`: 响应式的 markdown 内容
- `pool`: Worker 池实例
- `renderOptions`: 渲染选项

**返回：** `UseMarkdownResult`

**示例：**

```ts
import { ref } from 'vue';
import { useMarkdownWorkerPool } from '@markdown-next/vue';
import { MarkdownWorkerPool } from '@markdown-next/parser';

const pool = new MarkdownWorkerPool({ workerCount: 2 });
const markdown = ref('# 你好');

const { content, loading, error } = useMarkdownWorkerPool(markdown, pool, {
  mode: 'streaming',
});

// 记得终止池
onUnmounted(() => {
  pool.terminate();
});
```

## 类型

### MarkdownComponents

用于覆盖默认 HTML 元素的自定义组件映射。

```ts
type MarkdownComponents = {
  [K in keyof HTMLElementTagNameMap]?: MarkdownComponent;
};
```

**示例：**

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

自定义渲染的组件函数。

```ts
type MarkdownComponent =
  | Component
  | ((props: Record<string, unknown>, context: { slots: Slots }) => VNode)
  | string;
```

### LoadingSlot

自定义加载状态的组件或函数。

```ts
type LoadingSlot = Component | FunctionalComponent | (() => VNodeChild);
```

用于自定义 markdown 内容加载时显示的加载状态。可以是 Vue 组件、函数式组件或返回 VNode 的函数。

### MarkdownRenderMode

`MarkdownRenderer` 的渲染模式。

```ts
type MarkdownRenderMode = 'static' | 'streaming';
```

- `static`：整体解析整篇 markdown。
- `streaming`：streamdown 模式，按块解析并复用未变化的块。

### MarkdownStreamdownOptions

`mode` 为 `streaming` 时使用的流式渲染选项。

```ts
interface MarkdownStreamdownOptions {
  /**
   * 在流式渲染时修复未闭合的 markdown 标记。
   * @default true
   */
  parseIncompleteMarkdown?: boolean;
}
```

### MarkdownRenderOptions

markdown 渲染选项。

```ts
interface MarkdownRenderOptions {
  /**
   * 渲染模式。
   * @default 'static'
   */
  mode?: MarkdownRenderMode;

  /**
   * streamdown 选项。
   */
  streamdown?: MarkdownStreamdownOptions;

  /**
   * 自定义组件覆盖
   */
  components?: MarkdownComponents;

  /**
   * 自定义代码块渲染器
   */
  codeRenderer?: MarkdownComponent;

  /**
   * 是否开启防抖调度。
   * @default static 模式为 false，streaming 模式为 true
   */
  dynamic?: boolean;

  /**
   * 防抖延迟（毫秒）。
   * @default static 模式为 250，streaming 模式为 80
   */
  debounceMs?: number;

  /**
   * 自定义加载状态组件
   */
  loadingSlot?: LoadingSlot;
}
```

### MarkdownRendererProps

MarkdownRenderer 组件的属性接口。

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

MarkdownWorkerPoll 组件的属性接口。

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

Worker 池上下文的注入键。

```ts
const markdownWorkerContextKey: InjectionKey<MarkdownWorkerContext>;
```

**使用：**

```ts
import { inject } from 'vue';
import { markdownWorkerContextKey } from '@markdown-next/vue';

const context = inject(markdownWorkerContextKey);
if (context) {
  console.log('Worker 池可用');
}
```

## 工具函数

### toError

将未知错误转换为 Error 实例。

```ts
function toError(err: unknown): Error;
```

## 样式

### githubContainerStyle

markdown 容器的默认 GitHub 风格样式。

```ts
const githubContainerStyle: StyleValue;
```

这提供了 GitHub 风格的样式，用于：

- 排版（标题、段落、列表）
- 代码块
- 表格
- 引用
- 链接
- 图片

**覆盖：**

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
