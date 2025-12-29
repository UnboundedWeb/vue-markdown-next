# 解析器

`@markdown-next/parser` 包使用 unified/remark/rehype 生态系统提供核心 markdown 解析功能。

## 核心概念

### 什么是解析器？

解析器是将 Markdown 文本转换为可渲染格式的核心组件。`@markdown-next/parser` 提供了两种解析器实现：

1. **单线程解析器 (`Parser`)**：在主线程中同步处理，适合简单场景
2. **多线程解析器 (`ParserWorkerPool`)**：使用 Web Workers 或 Worker Threads 并行处理，适合高性能场景

### 解析流程

Markdown 解析经过以下阶段：

```
Markdown → mdast (Markdown AST) → hast (HTML AST) → HTML 字符串 或 HAST 对象
```

- **remark 插件**在 mdast 阶段处理 Markdown 结构
- **rehype 插件**在 hast 阶段处理 HTML 结构
- 最终输出 HTML 字符串或 HAST 对象供 Vue 渲染

## 概述

解析器支持两种输出格式，满足不同使用场景：

- **HTML 字符串**：通过 `parseToHTML()` 输出，适合直接插入到页面
- **HAST（HTML 抽象语法树）**：通过 `parseToHAST()` 输出，适合 Vue 组件渲染

### 主要特性

- **GFM（GitHub Flavored Markdown）**：表格、任务列表、删除线等
- **MathJax**：行内和块级数学表达式（支持 LaTeX 语法）
- **自定义标签**：允许指定的 HTML 标签通过清理检查
- **自定义插件**：使用 remark 和 rehype 插件扩展解析能力
- **HTML 清理**：内置 XSS 防护，基于 rehype-sanitize
- **Worker 支持**：多线程并行处理，提升大规模解析性能

## 解析器选项

### `ParserOptions` 接口

```ts
interface ParserOptions {
  /**
   * 自定义允许的 HTML 标签（这些标签会在清理时被保留）
   * @default []
   */
  customTags?: string[];

  /**
   * 扩展语法支持
   * - 'gfm': GitHub Flavored Markdown（表格、任务列表等）
   * - 'mathjax': MathJax LaTeX 数学公式渲染
   */
  extendedGrammar?: Array<'gfm' | 'mathjax'>;

  /**
   * 自定义 remark 插件（在 remarkRehype 之前应用，处理 Markdown AST）
   */
  remarkPlugins?: PluggableList;

  /**
   * 自定义 rehype 插件（在 rehypeRaw/rehypeSanitize 之后应用，处理 HTML AST）
   */
  rehypePlugins?: PluggableList;

  /**
   * MathJax 配置选项（仅在 extendedGrammar 包含 'mathjax' 时生效）
   * @see https://docs.mathjax.org/en/latest/options/index.html
   */
  mathJaxConfig?: MathJaxOptions;

  /**
   * 是否支持 LaTeX 语法（使用 \\( 和 \\[ 作为数学分隔符）
   * 当为 true 时，启用 remarkMathDelimiters 来解析 LaTeX 语法
   * @default false
   */
  supportsLaTeX?: boolean;
}
```

### 基础配置

```ts
import { createParser, type ParserOptions } from '@markdown-next/parser';

const options: ParserOptions = {
  supportsLaTeX: true,
  extendedGrammar: ['gfm', 'mathjax'],
};

const parser = createParser(options);
```

## 扩展语法

### GitHub Flavored Markdown (GFM)

启用 GFM 以支持表格、任务列表、删除线和自动链接：

```ts
const options: ParserOptions = {
  extendedGrammar: ['gfm'],
};
```

**支持的功能：**

- 表格
- 任务列表
- 删除线（`~~文本~~`）
- 自动链接
- 脚注

**示例：**

```markdown
| 功能 | 支持 |
| ---- | ---- |
| 表格 | ✅   |
| 任务 | ✅   |

- [x] 已完成任务
- [ ] 待处理任务

~~删除线文本~~
```

### MathJax 支持

启用 LaTeX 数学渲染：

```ts
const options: ParserOptions = {
  supportsLaTeX: true,
  extendedGrammar: ['mathjax'],
};
```

**行内数学：**

```markdown
方程 $E = mc^2$ 很有名。
```

**块级数学：**

```markdown
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

## 自定义 HTML 标签

通过 `customTags` 选项可以允许特定的 HTML 标签通过清理检查：

```ts
const options: ParserOptions = {
  customTags: ['custom-element', 'my-component'],
};

const parser = createParser(options);

// 现在这些自定义标签会被保留
const html = await parser.parseToHTML('<custom-element>内容</custom-element>');
```

::: warning 注意
自定义标签必须符合 HTML 规范，且默认情况下只保留标签本身，不保留任意属性。
:::

## HTML 清理

解析器内置了基于 `rehype-sanitize` 的 XSS 防护，所有不在白名单中的 HTML 标签和属性都会被移除或转义。

### 清理机制

1. 通过 `customTags` 添加的标签会被添加到白名单
2. 不在白名单中的标签会被转换为纯文本
3. 危险的属性（如 `onclick`）会被移除
4. URL 协议会被限制为安全协议（http、https、mailto 等）

### 自定义 MathJax 配置

当启用 MathJax 支持时，可以自定义 MathJax 渲染选项：

```ts
import { createParser } from '@markdown-next/parser';

const parser = createParser({
  extendedGrammar: ['mathjax'],
  mathJaxConfig: {
    tex: {
      inlineMath: [['$', '$']],
      displayMath: [['$$', '$$']],
    },
    svg: {
      fontCache: 'global',
    },
  },
});
```

## 单线程解析器

### 创建解析器

使用 `createParser` 函数或 `Parser` 类创建单线程解析器：

```ts
import { createParser, Parser } from '@markdown-next/parser';

// 方式 1: 使用工厂函数
const parser1 = createParser({
  supportsLaTeX: true,
  extendedGrammar: ['gfm', 'mathjax'],
});

// 方式 2: 使用类构造函数
const parser2 = new Parser({
  supportsLaTeX: true,
  extendedGrammar: ['gfm', 'mathjax'],
});
```

### 解析为 HTML

将 Markdown 解析为 HTML 字符串：

```ts
const markdown = '# 你好世界\n\n这是 **粗体** 文本。';
const html = await parser.parseToHTML(markdown);
// 输出: '<h1>你好世界</h1>\n<p>这是 <strong>粗体</strong> 文本。</p>'
```

### 解析为 HAST

将 Markdown 解析为 HAST（HTML 抽象语法树）对象，适合与 Vue 组件配合使用：

```ts
import { Root } from 'hast';

const markdown = '# 你好世界';
const hast: Root = await parser.parseToHAST(markdown);
// 输出 HAST 对象，可传递给 Vue 渲染器
```

### 批量解析

同时解析多个 Markdown 文档：

```ts
// 批量解析为 HTML
const markdowns = ['# 标题 1', '# 标题 2', '# 标题 3'];
const htmlList = await parser.batchParseToHTML(markdowns);

// 批量解析为 HAST
const hastList = await parser.batchParseToHAST(markdowns);
```

## 多线程解析器（Worker 池）

对于需要高性能解析的场景（如大量文档、实时预览等），使用 `ParserWorkerPool` 可以显著提升性能。

### 创建 Worker 池

```ts
import { createWorkerPool, ParserWorkerPool } from '@markdown-next/parser';

// 方式 1: 使用工厂函数
const pool1 = createWorkerPool({
  workerCount: 4, // Worker 数量
  supportsLaTeX: true,
  extendedGrammar: ['gfm', 'mathjax'],
});

// 方式 2: 使用类构造函数
const pool2 = new ParserWorkerPool({
  workerCount: 4,
  supportsLaTeX: true,
  extendedGrammar: ['gfm', 'mathjax'],
});
```

### Worker 数量配置

- 如果未指定 `workerCount`，默认使用 CPU 核心数（最大 8）
- 浏览器环境：使用 `navigator.hardwareConcurrency`
- Node.js 环境：使用 `os.cpus().length`
- Worker 池会在创建时自动初始化，无需手动调用初始化方法

### 使用 Worker 池解析

API 与单线程解析器完全一致：

```ts
// 解析为 HTML
const html = await pool.parseToHTML('# 你好世界');

// 解析为 HAST
const hast = await pool.parseToHAST('# 你好世界');

// 批量解析（会自动并行处理）
const htmlList = await pool.batchParseToHTML(['# 文档 1', '# 文档 2', '# 文档 3']);
```

### 动态更新选项

在运行时更新所有 Worker 的解析选项：

```ts
await pool.updateOptions({
  extendedGrammar: ['gfm'], // 移除 mathjax 支持
  supportsLaTeX: false,
});
```

### 查看池状态

获取 Worker 池的运行状态：

```ts
const info = pool.getPoolInfo();
console.log(info);
// {
//   workerCount: 4,        // 配置的 Worker 数量
//   activeWorkers: 4,      // 当前活跃的 Worker 数量
//   busyWorkers: 2,        // 正在处理任务的 Worker 数量
//   maxWorkers: 8,         // 环境支持的最大 Worker 数
//   environment: 'browser', // 运行环境
//   initialized: true      // 是否已初始化
// }
```

### 销毁 Worker 池

使用完毕后应销毁 Worker 池以释放资源：

```ts
await pool.destroy();
```

::: tip 提示
Worker 池适合长期运行的应用。如果只需解析少量文档，使用单线程解析器更加轻量。
:::

查看 [Worker 池示例](/v1/zh/examples/worker-pool) 了解更多详情。
