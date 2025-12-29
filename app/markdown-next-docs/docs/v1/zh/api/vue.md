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
    dynamic: {
      type: Boolean,
      default: false,
    },
    debounceMs: {
      type: Number,
      default: 250,
    },
  },
});
```

**属性：**

| 属性            | 类型                 | 必需 | 默认值      | 说明                   |
| --------------- | -------------------- | ---- | ----------- | ---------------------- |
| `markdown`      | `string`             | 是   | -           | 要渲染的 markdown 内容 |
| `parserOptions` | `ParserOptions`      | 否   | `undefined` | 解析器配置             |
| `components`    | `MarkdownComponents` | 否   | `undefined` | 自定义组件覆盖         |
| `codeRenderer`  | `MarkdownComponent`  | 否   | `undefined` | 自定义代码渲染器       |
| `dynamic`       | `boolean`            | 否   | `false`     | 启用响应式更新         |
| `debounceMs`    | `number`             | 否   | `250`       | 防抖延迟（毫秒）       |

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
  },
});
```

**属性：**

| 属性                 | 类型                    | 必需 | 默认值      | 说明               |
| -------------------- | ----------------------- | ---- | ----------- | ------------------ |
| `workerCount`        | `number`                | 否   | `1`         | Worker 数量        |
| `parserOptions`      | `ParserOptions`         | 否   | `undefined` | 解析器配置         |
| `renderOptions`      | `MarkdownRenderOptions` | 否   | `undefined` | 渲染选项           |
| `forceRenderOptions` | `boolean`               | 否   | `false`     | 强制子组件使用选项 |

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
  { dynamic: true }
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

const { content, loading, error } = useMarkdownWorkerPool(markdown, pool, { dynamic: true });

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

### MarkdownRenderOptions

markdown 渲染选项。

```ts
interface MarkdownRenderOptions {
  /**
   * 自定义组件覆盖
   */
  components?: MarkdownComponents;

  /**
   * 自定义代码块渲染器
   */
  codeRenderer?: MarkdownComponent;

  /**
   * 启用响应式更新
   * @default false
   */
  dynamic?: boolean;

  /**
   * 防抖延迟（毫秒）
   * @default 250
   */
  debounceMs?: number;
}
```

### MarkdownRendererProps

MarkdownRenderer 组件的属性接口。

```ts
interface MarkdownRendererProps {
  markdown: string;
  parserOptions?: ParserOptions;
  components?: MarkdownComponents;
  codeRenderer?: MarkdownComponent;
  dynamic?: boolean;
  debounceMs?: number;
}
```

### MarkdownWorkerPollProps

MarkdownWorkerPoll 组件的属性接口。

```ts
interface MarkdownWorkerPollProps {
  workerCount?: number;
  parserOptions?: ParserOptions;
  renderOptions?: MarkdownRenderOptions;
  forceRenderOptions?: boolean;
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
