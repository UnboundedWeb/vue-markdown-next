# Vue 渲染器

`@markdown-next/vue` 包提供了用于渲染 markdown 内容的 Vue 3 组件。

## 核心概念

### 渲染架构

Vue 渲染器采用了模块化的架构设计，主要包含以下几个核心层次：

```
Markdown 文本
    ↓
Parser (将 Markdown 解析为 HAST)
    ↓
HAST (Hypertext Abstract Syntax Tree)
    ↓
hastToVue (将 HAST 转换为 Vue VNode)
    ↓
Vue VNode (渲染到 DOM)
```

#### 1. 解析层 (Parser Layer)

解析层负责将 Markdown 文本转换为 HAST（Hypertext Abstract Syntax Tree）。有两种解析方式：

- **直接解析**：使用 `useMarkdownParser` hook，在主线程中创建解析器实例
- **Worker Pool 解析**：使用 `useMarkdownWorkerPool` hook，在 Web Worker 中并行解析

```typescript
// 直接解析
const parser = createParser(parserOptions);
const tree = await parser.parseToHAST(markdown);

// Worker Pool 解析
const tree = await pool.parseToHAST(markdown);
```

#### 2. 转换层 (Transform Layer)

转换层通过 `hastToVue` 函数将 HAST 转换为 Vue 的 VNode：

```typescript
function renderHastToVue(tree: Root, options?: MarkdownRenderOptions): VNodeChild {
  const components = resolveComponents(options);
  return renderNode(tree, components);
}
```

**转换过程：**

1. **遍历 HAST 节点**：递归遍历 HAST 树的每个节点
2. **组件解析**：根据节点类型（element/text/root）选择对应的渲染方式
3. **Props 规范化**：将 HAST 的属性转换为 Vue 兼容的 props（className → class，htmlFor → for）
4. **样式合并**：将 GitHub 主题样式与用户自定义样式合并
5. **生成 VNode**：使用 Vue 的 `h()` 函数创建 VNode

#### 3. 组件系统 (Component System)

组件系统允许你自定义任何 HTML 元素的渲染方式：

```typescript
type MarkdownComponent = Component | FunctionalComponent | string;
type MarkdownComponents = Record<string, MarkdownComponent>;
```

**默认组件：**

渲染器为所有常用的 Markdown 元素提供了默认组件，这些组件自动应用 GitHub 风格的样式：

```typescript
const defaultComponents = {
  h1: createStyledTag('h1'),
  h2: createStyledTag('h2'),
  p: createStyledTag('p'),
  code: createCodeComponent(),
  // ... 其他元素
};
```

**组件解析优先级：**

1. 用户通过 `components` prop 提供的自定义组件
2. 用户通过 `codeRenderer` prop 提供的代码渲染器（仅限 `<code>` 元素）
3. 默认的样式组件
4. 原生 HTML 标签

#### 4. 按模式调度 (Static / Streaming)

调度默认值先由 `mode` 决定，再允许显式覆盖：

- `static` 模式：`dynamic` 默认 `false`，`debounceMs` 默认 `250`
- `streaming` 模式：`dynamic` 默认 `true`，`debounceMs` 默认 `80`

```typescript
const schedule = (value: string, options?: MarkdownRenderOptions): void => {
  const mode = options?.mode ?? 'static';
  const dynamic = options?.dynamic ?? mode === 'streaming';
  const debounceMs = options?.debounceMs ?? (mode === 'streaming' ? 80 : 250);

  if (timer != null) {
    clearTimeout(timer);
    timer = null;
  }

  if (dynamic) {
    timer = setTimeout(() => {
      void run(value, options);
    }, debounceMs);
    return;
  }

  void run(value, options);
};
```

**工作流程：**

1. 监听 markdown 内容和渲染选项变化
2. 基于 `mode` 计算调度默认值
3. 仅在启用 `dynamic` 时进行防抖
4. 使用 `taskId` 确保只有最新任务可以提交结果（避免竞态条件）

#### 5. Streamdown 块复用

当 `mode` 为 `streaming` 时，渲染器会从整篇解析切换到按块增量渲染：

```typescript
if (mode !== 'streaming') {
  cachedBlocks = [];
  const tree = await parser.parseToHAST(markdown);
  return renderHastToVue(tree, options);
}

const preprocessedMarkdown = preprocessStreamingMarkdown(markdown, options?.streamdown);
const blockSources = parseMarkdownIntoBlocks(preprocessedMarkdown);
cachedBlocks = await parseBlocksWithCache(blockSources, cachedBlocks, parser);
return h(
  Fragment,
  null,
  cachedBlocks.map((block) => renderHastToVue(block.tree, options))
);
```

`streamdown.parseIncompleteMarkdown` 默认是 `true`，会在流式内容尚未完整时修复未闭合的 markdown 标记，提升中间态可渲染性。

#### 6. Worker Pool 上下文 (Worker Pool Context)

`MarkdownWorkerPoll` 组件通过 Vue 的 `provide/inject` 机制为其子组件提供共享的 Worker Pool：

```typescript
// MarkdownWorkerPoll 提供上下文
provide(markdownWorkerContextKey, {
  pool, // Worker Pool 实例
  renderOptions, // 渲染选项
  forceRenderOptions, // 是否强制使用这些选项
});

// MarkdownRenderer 注入上下文
const context = inject(markdownWorkerContextKey, null);
```

**优势：**

- **资源共享**：多个 `MarkdownRenderer` 共享同一个 Worker Pool
- **性能优化**：避免为每个渲染器创建独立的 Worker
- **统一配置**：在 Pool 层级统一配置解析器选项和渲染选项

#### 7. 样式系统 (Style System)

渲染器采用内联样式系统，提供 GitHub 风格的默认主题：

```typescript
// 为每个标签创建样式组件
function createStyledTag(tag: string) {
  return (props: Record<string, unknown>) => {
    const { children, style, ...rest } = props;
    return h(
      tag,
      {
        ...rest,
        style: mergeStyle(githubTagStyles[tag], style),
      },
      children
    );
  };
}
```

**样式合并策略：**

1. 应用 GitHub 主题的基础样式（`githubTagStyles`）
2. 合并用户通过 `style` prop 提供的自定义样式
3. 用户样式优先级更高，可以覆盖默认样式

**特殊处理：**

- **代码块**：区分行内代码和块级代码，应用不同的样式
- **数学公式**：MathJax 标签自动被过滤，不应用自定义组件

#### 8. 错误处理 (Error Handling)

渲染器提供了多层次的错误处理：

```typescript
// 组件层错误捕获
onErrorCaptured((err) => {
  renderError.value = toError(err);
  return false; // 阻止错误继续传播
});

// Hook 层错误处理
try {
  const rendered = await render(value, options);
  content.value = rendered;
} catch (err) {
  error.value = toError(err);
}
```

**错误显示：**

当发生错误时，渲染器会显示一个友好的错误提示框，包含错误消息。

#### 9. 加载状态管理 (Loading State)

渲染器提供清晰的加载状态反馈：

```typescript
const showLoading = loading.value && !content.value && !error.value;
```

**显示逻辑：**

- 仅在首次加载时显示加载指示器
- 如果已有内容，更新时不显示加载指示器（避免闪烁）
- 错误状态优先于加载状态

## 组件

### MarkdownRenderer

用于渲染 markdown 内容的主要组件。

```vue
<script setup lang="ts">
import { MarkdownRenderer } from '@markdown-next/vue';
import { ref } from 'vue';

const markdown = ref('# 你好世界');
</script>

<template>
  <MarkdownRenderer :markdown="markdown" />
</template>
```

#### 属性

| 属性            | 类型                        | 默认值                                             | 说明                                                                  |
| --------------- | --------------------------- | -------------------------------------------------- | --------------------------------------------------------------------- |
| `markdown`      | `string`                    | **必需**                                           | 要渲染的 markdown 内容                                                |
| `parserOptions` | `ParserOptions`             | `undefined`                                        | 解析器选项，控制 Markdown 解析行为。[详见解析器选项说明](#解析器选项) |
| `components`    | `MarkdownComponents`        | `undefined`                                        | 自定义组件覆盖                                                        |
| `codeRenderer`  | `MarkdownComponent`         | `undefined`                                        | 自定义代码块渲染器                                                    |
| `mode`          | `'static' \| 'streaming'`   | `'static'`                                         | 渲染模式                                                              |
| `streamdown`    | `MarkdownStreamdownOptions` | `undefined`                                        | `streaming` 模式下的 streamdown 选项                                  |
| `dynamic`       | `boolean`                   | 与 mode 相关（static: `false`，streaming: `true`） | 是否启用防抖调度                                                      |
| `debounceMs`    | `number`                    | 与 mode 相关（static: `250`，streaming: `80`）     | 防抖延迟（毫秒）                                                      |
| `loadingSlot`   | `LoadingSlot`               | `undefined`                                        | 首次成功渲染前展示的自定义加载内容                                    |

#### 解析器选项

`parserOptions` 用于配置 Markdown 解析器的行为。完整的 API 文档请参考 [解析器文档](/v1/zh/guide/parser) 和 [Parser API](/v1/zh/api/parser)。

**主要配置项：**

```typescript
interface ParserOptions {
  // 扩展语法支持
  extendedGrammar?: Array<'gfm' | 'mathjax'>;

  // 是否支持 LaTeX 语法
  supportsLaTeX?: boolean;

  // 自定义允许的 HTML 标签
  customTags?: string[];

  // 自定义 remark 插件（处理 Markdown AST）
  remarkPlugins?: PluggableList;

  // 自定义 rehype 插件（处理 HTML AST）
  rehypePlugins?: PluggableList;

  // MathJax 配置（仅在启用 mathjax 时生效）
  mathJaxConfig?: MathJaxOptions;
}
```

**常用配置示例：**

```vue
<script setup lang="ts">
import { MarkdownRenderer } from '@markdown-next/vue';
import { ref } from 'vue';
import type { ParserOptions } from '@markdown-next/parser';

const markdown = ref('# 标题\n\n这是 **粗体** 文本。');

// 启用 GitHub Flavored Markdown
const parserOptions: ParserOptions = {
  extendedGrammar: ['gfm'],
};
</script>

<template>
  <MarkdownRenderer :markdown="markdown" :parserOptions="parserOptions" />
</template>
```

**启用数学公式支持：**

```typescript
const parserOptions: ParserOptions = {
  supportsLaTeX: true,
  extendedGrammar: ['mathjax'],
  mathJaxConfig: {
    tex: {
      inlineMath: [['$', '$']],
      displayMath: [['$$', '$$']],
    },
  },
};
```

**自定义允许的 HTML 标签：**

```typescript
const parserOptions: ParserOptions = {
  customTags: ['custom-element', 'my-component'],
};
```

::: tip 提示
`MarkdownRenderer` 组件在每次实例化时会创建一个新的解析器实例。如果需要在多个组件间共享解析器配置，请使用 `MarkdownWorkerPoll` 组件。
:::

#### 流式模式

对于逐步追加或 token-by-token 的内容（如 LLM 输出），建议使用 `streaming` 模式。该模式会启用 streamdown 块复用与 mode-aware 调度默认值：

```vue
<script setup lang="ts">
import { MarkdownRenderer } from '@markdown-next/vue';
import { ref } from 'vue';

const markdown = ref('');
</script>

<template>
  <MarkdownRenderer
    :markdown="markdown"
    mode="streaming"
    :streamdown="{ parseIncompleteMarkdown: true }"
  />
</template>
```

如果你需要稳定的整篇文档重算行为，使用 `mode="static"`（默认），或显式传入 `:dynamic` / `:debounceMs` 进行覆盖。

### MarkdownWorkerPoll

为子 `MarkdownRenderer` 组件提供 worker 池上下文的包装组件。

```vue
<script setup lang="ts">
import { MarkdownRenderer, MarkdownWorkerPoll } from '@markdown-next/vue';
import { ref } from 'vue';

const markdown1 = ref('# 文档 1');
const markdown2 = ref('# 文档 2');

const parserOptions = {
  extendedGrammar: ['gfm', 'mathjax'],
};
</script>

<template>
  <MarkdownWorkerPoll
    :worker-count="2"
    :parserOptions="parserOptions"
    mode="streaming"
    :streamdown="{ parseIncompleteMarkdown: true }"
  >
    <MarkdownRenderer :markdown="markdown1" />
    <MarkdownRenderer :markdown="markdown2" />
  </MarkdownWorkerPoll>
</template>
```

#### 属性

| 属性              | 类型                        | 默认值      | 说明                                                                                                                                                    |
| ----------------- | --------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `workerCount`     | `number`                    | **必需**    | Worker 线程数                                                                                                                                           |
| `parserOptions`   | `ParserOptions`             | `undefined` | 所有子组件的解析器选项。支持所有 `ParserOptions` 配置项，也可以单独配置特定选项（如 `customTags`、`extendedGrammar` 等）。[详见解析器选项](#解析器选项) |
| `components`      | `MarkdownComponents`        | `undefined` | 强制所有子组件使用自定义组件覆盖                                                                                                                        |
| `codeRenderer`    | `MarkdownComponent`         | `undefined` | 强制所有子组件使用自定义代码渲染器                                                                                                                      |
| `mode`            | `'static' \| 'streaming'`   | `undefined` | 强制所有子组件使用渲染模式                                                                                                                              |
| `streamdown`      | `MarkdownStreamdownOptions` | `undefined` | 强制所有子组件使用 streamdown 选项                                                                                                                      |
| `dynamic`         | `boolean`                   | `undefined` | 强制所有子组件使用调度策略                                                                                                                              |
| `debounceMs`      | `number`                    | `undefined` | 强制所有子组件使用防抖延迟（毫秒）                                                                                                                      |
| `loadingSlot`     | `LoadingSlot`               | `undefined` | 强制所有子组件使用加载插槽                                                                                                                              |
| `customTags`      | `string[]`                  | `undefined` | 自定义允许的 HTML 标签（会合并到 `parserOptions` 中）                                                                                                   |
| `extendedGrammar` | `Array<'gfm' \| 'mathjax'>` | `undefined` | 扩展语法支持（会合并到 `parserOptions` 中）                                                                                                             |
| `remarkPlugins`   | `PluggableList`             | `undefined` | 自定义 remark 插件（会合并到 `parserOptions` 中）                                                                                                       |
| `rehypePlugins`   | `PluggableList`             | `undefined` | 自定义 rehype 插件（会合并到 `parserOptions` 中）                                                                                                       |
| `mathJaxConfig`   | `MathJaxOptions`            | `undefined` | MathJax 配置（会合并到 `parserOptions` 中）                                                                                                             |

::: tip 提示
`MarkdownWorkerPoll` 提供了两种方式配置解析器选项：

1. 通过 `parserOptions` 属性传递完整的解析器配置对象
2. 通过单独的属性（如 `customTags`、`extendedGrammar` 等）配置特定选项

这两种方式可以同时使用，单独的属性会覆盖 `parserOptions` 中的相应配置。

当在 `MarkdownWorkerPoll` 上设置 `mode` / `streamdown` / `dynamic` / `debounceMs` / `loadingSlot` 时，子 `MarkdownRenderer` 会被强制使用这些渲染参数。
:::

## 自定义组件(自定义样式)

使用自定义 Vue 组件覆盖默认的 Github 样式的 HTML 元素渲染：

```vue
<script setup lang="ts">
import { MarkdownRenderer } from '@markdown-next/vue';
import { ref, h } from 'vue';
import type { MarkdownComponents } from '@markdown-next/vue';

const markdown = ref('# 自定义标题\n\n> 这是引用');

const components: MarkdownComponents = {
  h1: (props, { slots }) =>
    h('h1', { class: 'custom-h1', style: { color: 'blue' } }, slots.default?.()),
  blockquote: (props, { slots }) => h('div', { class: 'custom-quote' }, slots.default?.()),
};
</script>

<template>
  <MarkdownRenderer :markdown="markdown" :components="components" />
</template>

<style>
.custom-h1 {
  font-size: 2.5rem;
  border-bottom: 2px solid #e67e22;
}

.custom-quote {
  padding: 1rem;
  border-left: 4px solid #f39c12;
  background: #fff8e1;
}
</style>
```

## 代码渲染器

自定义代码块渲染以实现语法高亮：

```vue
<script setup lang="ts">
import { MarkdownRenderer } from '@markdown-next/vue';
import { ref, h } from 'vue';
import type { MarkdownComponent } from '@markdown-next/vue';
import hljs from 'highlight.js';

const markdown = ref(`
\`\`\`javascript
const hello = 'world';
console.log(hello);
\`\`\`
`);

const codeRenderer: MarkdownComponent = (props) => {
  const code = props.children?.[0]?.children?.[0]?.value || '';
  const lang = props.className?.[0]?.replace('language-', '') || 'plaintext';

  const highlighted = hljs.highlight(code, { language: lang }).value;

  return h('pre', [
    h('code', {
      class: `language-${lang}`,
      innerHTML: highlighted,
    }),
  ]);
};
</script>

<template>
  <MarkdownRenderer :markdown="markdown" :codeRenderer="codeRenderer" />
</template>
```

## 组合式函数

### useMarkdownParser

如需更多控制，直接使用组合式函数：

```vue
<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useMarkdownParser } from '@markdown-next/vue';

const markdown = ref('# 你好');
const parserOptions = {
  extendedGrammar: ['gfm'],
};

const { content, loading, error } = useMarkdownParser(markdown, parserOptions, { dynamic: true });

watchEffect(() => {
  if (error.value) {
    console.error('解析错误：', error.value);
  }
});
</script>

<template>
  <div>
    <div v-if="loading">加载中...</div>
    <div v-else-if="error">错误：{{ error.message }}</div>
    <component v-else :is="content" />
  </div>
</template>
```

### useMarkdownWorkerPool

直接使用 worker 池：

```ts
import { ref } from 'vue';
import { useMarkdownWorkerPool } from '@markdown-next/vue';
import { MarkdownWorkerPool } from '@markdown-next/parser';

const pool = new MarkdownWorkerPool({ workerCount: 2 });
const markdown = ref('# 你好');

const { content, loading, error } = useMarkdownWorkerPool(markdown, pool, {
  mode: 'streaming',
});
```

## 数学公式渲染

MarkdownRenderer 支持使用 MathJax 渲染 LaTeX 数学公式。

### 基础配置

要启用数学公式支持，需要配置解析器选项：

```vue
<script setup lang="ts">
import { MarkdownRenderer } from '@markdown-next/vue';
import { ref } from 'vue';
import type { ParserOptions } from '@markdown-next/parser';

const markdown = ref(`
# 数学公式示例

行内公式：质能方程 $E = mc^2$ 描述了质量和能量的关系。

块级公式：

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$
`);

const parserOptions: ParserOptions = {
  supportsLaTeX: true,
  extendedGrammar: ['mathjax'],
};
</script>

<template>
  <MarkdownRenderer :markdown="markdown" :parserOptions="parserOptions" />
</template>
```

### 支持的公式类型

**行内公式**：使用单个 `$` 符号包裹

```markdown
爱因斯坦的质能方程 $E = mc^2$ 很著名。
```

**块级公式**：使用双 `$$` 符号包裹

```markdown
$$
\frac{d}{dx}\left( \int_{0}^{x} f(u)\,du\right)=f(x)
$$
```

### 复杂公式示例

```vue
<script setup lang="ts">
import { MarkdownRenderer } from '@markdown-next/vue';
import { ref } from 'vue';

const markdown = ref(`
### 矩阵

$$
\\begin{pmatrix}
a & b \\\\
c & d
\\end{pmatrix}
$$

### 多行对齐公式

$$
\\begin{aligned}
f(x) &= (x+a)(x+b) \\\\
&= x^2 + (a+b)x + ab
\\end{aligned}
$$

### 分段函数

$$
f(x) = \\begin{cases}
x^2 & \\text{if } x \\geq 0 \\\\
-x^2 & \\text{if } x < 0
\\end{cases}
$$
`);

const parserOptions = {
  supportsLaTeX: true,
  extendedGrammar: ['mathjax'],
};
</script>

<template>
  <MarkdownRenderer :markdown="markdown" :parserOptions="parserOptions" />
</template>
```

查看 [数学公式示例](/v1/zh/examples/math) 了解更多复杂用法和交互式编辑器。
