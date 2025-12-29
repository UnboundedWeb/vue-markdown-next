# @markdown-next/parser API

核心 Markdown 解析器，支持 GFM、MathJax 和 Worker 池。

## 类型定义

### ParserOptions

Markdown 解析器的配置选项。

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

### WorkerPoolOptions

Worker 池的配置选项，继承 `ParserOptions` 并添加了 Worker 相关配置。

```ts
interface WorkerPoolOptions extends ParserOptions {
  /**
   * Worker 数量，默认为 CPU 核心数（最大 8）
   * 如果不指定，会根据环境自动计算：
   * - 浏览器：navigator.hardwareConcurrency
   * - Node.js：os.cpus().length
   */
  workerCount?: number;
}
```

### RenderType

解析器支持的输出类型。

```ts
type RenderType = 'html' | 'hast';
```

- `'html'`：输出 HTML 字符串
- `'hast'`：输出 HAST (HTML 抽象语法树) 对象

### ExtendsProps

支持的扩展语法类型。

```ts
type ExtendsProps = 'gfm' | 'mathjax';
```

- `'gfm'`：GitHub Flavored Markdown
- `'mathjax'`：MathJax 数学公式

## 类

### Parser

单线程 Markdown 解析器，在主线程中同步处理解析任务。

#### 构造函数

```ts
constructor(options?: ParserOptions)
```

**参数：**

- `options`：解析器配置选项

**示例：**

```ts
import { Parser } from '@markdown-next/parser';

const parser = new Parser({
  supportsLaTeX: true,
  extendedGrammar: ['gfm', 'mathjax'],
});
```

#### 方法

##### parseToHTML

解析 Markdown 到 HTML 字符串。

```ts
async parseToHTML(markdown: string): Promise<string>
```

**参数：**

- `markdown`：Markdown 字符串

**返回值：**

- `Promise<string>`：HTML 字符串

**示例：**

```ts
const html = await parser.parseToHTML('# Hello\n\nThis is **bold**.');
// 输出: '<h1>Hello</h1>\n<p>This is <strong>bold</strong>.</p>'
```

##### parseToHAST

解析 Markdown 到 HAST（HTML 抽象语法树）。

```ts
async parseToHAST(markdown: string): Promise<Root>
```

**参数：**

- `markdown`：Markdown 字符串

**返回值：**

- `Promise<Root>`：HAST Root 节点

**示例：**

```ts
import { Root } from 'hast';

const hast: Root = await parser.parseToHAST('# Hello World');
console.log(hast);
// 输出 HAST 对象结构
```

##### batchParseToHTML

批量解析多个 Markdown 字符串到 HTML。

```ts
async batchParseToHTML(markdowns: string[]): Promise<string[]>
```

**参数：**

- `markdowns`：Markdown 字符串数组

**返回值：**

- `Promise<string[]>`：HTML 字符串数组

**示例：**

```ts
const htmlList = await parser.batchParseToHTML(['# Document 1', '# Document 2', '# Document 3']);
// 返回 3 个 HTML 字符串
```

##### batchParseToHAST

批量解析多个 Markdown 字符串到 HAST。

```ts
async batchParseToHAST(markdowns: string[]): Promise<Root[]>
```

**参数：**

- `markdowns`：Markdown 字符串数组

**返回值：**

- `Promise<Root[]>`：HAST Root 节点数组

**示例：**

```ts
const hastList = await parser.batchParseToHAST(['# Document 1', '# Document 2', '# Document 3']);
// 返回 3 个 HAST 对象
```

---

### ParserWorkerPool

多线程 Markdown 解析器，使用 Worker 池并行处理解析任务，适合高性能场景。

#### 构造函数

```ts
constructor(options?: WorkerPoolOptions)
```

**参数：**

- `options`：Worker 池配置选项

**示例：**

```ts
import { ParserWorkerPool } from '@markdown-next/parser';

const pool = new ParserWorkerPool({
  workerCount: 4,
  supportsLaTeX: true,
  extendedGrammar: ['gfm', 'mathjax'],
});
```

#### 方法

##### parseToHTML

使用 Worker 池解析 Markdown 到 HTML 字符串。

```ts
async parseToHTML(markdown: string): Promise<string>
```

**参数：**

- `markdown`：Markdown 字符串

**返回值：**

- `Promise<string>`：HTML 字符串

**示例：**

```ts
const html = await pool.parseToHTML('# Hello World');
```

##### parseToHAST

使用 Worker 池解析 Markdown 到 HAST。

```ts
async parseToHAST(markdown: string): Promise<Root>
```

**参数：**

- `markdown`：Markdown 字符串

**返回值：**

- `Promise<Root>`：HAST Root 节点

**示例：**

```ts
const hast = await pool.parseToHAST('# Hello World');
```

##### batchParseToHTML

批量解析多个 Markdown 字符串到 HTML（并行处理）。

```ts
async batchParseToHTML(markdowns: string[]): Promise<string[]>
```

**参数：**

- `markdowns`：Markdown 字符串数组

**返回值：**

- `Promise<string[]>`：HTML 字符串数组

**说明：**
Worker 池会自动将任务分配到多个 Worker 并行处理，显著提升批量解析性能。

**示例：**

```ts
const htmlList = await pool.batchParseToHTML(['# Document 1', '# Document 2', '# Document 3']);
```

##### batchParseToHAST

批量解析多个 Markdown 字符串到 HAST（并行处理）。

```ts
async batchParseToHAST(markdowns: string[]): Promise<Root[]>
```

**参数：**

- `markdowns`：Markdown 字符串数组

**返回值：**

- `Promise<Root[]>`：HAST Root 节点数组

**示例：**

```ts
const hastList = await pool.batchParseToHAST(['# Document 1', '# Document 2', '# Document 3']);
```

##### updateOptions

动态更新所有 Worker 的解析选项。

```ts
async updateOptions(options: Partial<ParserOptions>): Promise<void>
```

**参数：**

- `options`：要更新的解析器选项（部分）

**示例：**

```ts
// 运行时切换配置
await pool.updateOptions({
  extendedGrammar: ['gfm'], // 移除 mathjax
  supportsLaTeX: false,
});
```

##### destroy

销毁 Worker 池，释放所有资源。

```ts
async destroy(): Promise<void>
```

**说明：**
调用此方法会终止所有 Worker 线程，释放内存。使用完 Worker 池后应该调用此方法。

**示例：**

```ts
// 使用完毕后清理
await pool.destroy();
```

##### getPoolInfo

获取 Worker 池的当前状态信息。

```ts
getPoolInfo(): {
  workerCount: number;
  activeWorkers: number;
  busyWorkers: number;
  maxWorkers: number;
  environment: 'browser' | 'node' | 'unknown';
  initialized: boolean;
}
```

**返回值：**

- `workerCount`：配置的 Worker 数量
- `activeWorkers`：当前活跃的 Worker 数量
- `busyWorkers`：正在处理任务的 Worker 数量
- `maxWorkers`：当前环境支持的最大 Worker 数量
- `environment`：运行环境类型
- `initialized`：Worker 池是否已初始化

**示例：**

```ts
const info = pool.getPoolInfo();
console.log(info);
// {
//   workerCount: 4,
//   activeWorkers: 4,
//   busyWorkers: 2,
//   maxWorkers: 8,
//   environment: 'browser',
//   initialized: true
// }
```

## 工厂函数

### createParser

创建单线程解析器实例。

```ts
function createParser(options?: ParserOptions): Parser;
```

**参数：**

- `options`：解析器配置选项

**返回值：**

- `Parser` 实例

**示例：**

```ts
import { createParser } from '@markdown-next/parser';

const parser = createParser({
  supportsLaTeX: true,
  extendedGrammar: ['gfm', 'mathjax'],
});

const html = await parser.parseToHTML('# Hello World');
```

---

### createWorkerPool

创建多线程解析器实例（Worker 池）。

```ts
function createWorkerPool(options?: WorkerPoolOptions): ParserWorkerPool;
```

**参数：**

- `options`：Worker 池配置选项

**返回值：**

- `ParserWorkerPool` 实例

**示例：**

```ts
import { createWorkerPool } from '@markdown-next/parser';

const pool = createWorkerPool({
  workerCount: 4,
  extendedGrammar: ['gfm'],
});

const html = await pool.parseToHTML('# Hello World');

// 使用完毕后销毁
await pool.destroy();
```

## 使用建议

### 何时使用单线程解析器？

适合以下场景：

- 小型应用，解析频率低
- 只需解析少量文档
- 对性能要求不高
- 希望减少内存占用

```ts
import { createParser } from '@markdown-next/parser';

const parser = createParser({ extendedGrammar: ['gfm'] });
const html = await parser.parseToHTML(markdown);
```

### 何时使用 Worker 池？

适合以下场景：

- 需要解析大量文档
- 实时预览场景（如 Markdown 编辑器）
- 服务端渲染（Node.js）
- 对性能要求高

```ts
import { createWorkerPool } from '@markdown-next/parser';

const pool = createWorkerPool({
  workerCount: 4,
  extendedGrammar: ['gfm', 'mathjax'],
});

// 批量解析会自动并行处理
const results = await pool.batchParseToHTML(markdownList);

// 应用退出时销毁
await pool.destroy();
```

### 性能对比

在处理大量文档时，Worker 池的性能优势明显：

| 场景             | 单线程解析器 | Worker 池 (4核)  |
| ---------------- | ------------ | ---------------- |
| 解析 1 个文档    | ~10ms        | ~12ms (含初始化) |
| 解析 100 个文档  | ~1000ms      | ~300ms           |
| 解析 1000 个文档 | ~10000ms     | ~2800ms          |

::: tip 提示
Worker 池在首次使用时需要初始化，会有轻微的启动延迟。但在长期运行的应用中，这个延迟可以忽略不计。
:::

## 插件开发

### Remark 插件

Remark 插件用于处理 Markdown AST（mdast），在转换为 HTML 之前修改 Markdown 结构。

```ts
import type { Plugin } from 'unified';
import type { Root } from 'mdast';
import { visit } from 'unist-util-visit';

// 示例：将所有文本转换为大写
const remarkUppercase: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'text', (node) => {
      node.value = node.value.toUpperCase();
    });
  };
};

const parser = createParser({
  remarkPlugins: [remarkUppercase],
});
```

### Rehype 插件

Rehype 插件用于处理 HTML AST（hast），在生成最终 HTML 之前修改 HTML 结构。

```ts
import type { Plugin } from 'unified';
import type { Root } from 'hast';
import { visit } from 'unist-util-visit';

// 示例：为所有链接添加 target="_blank"
const rehypeExternalLinks: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'a') {
        node.properties = node.properties || {};
        node.properties.target = '_blank';
        node.properties.rel = 'noopener noreferrer';
      }
    });
  };
};

const parser = createParser({
  rehypePlugins: [rehypeExternalLinks],
});
```

### 插件执行顺序

解析器中插件的执行顺序如下：

```
1. remarkParse - 解析 Markdown 为 mdast
2. remarkGfm (可选) - GFM 支持
3. remarkMath (可选) - 数学公式支持
4. remarkMathDelimiters (可选) - LaTeX 分隔符支持
5. 用户自定义 remarkPlugins ← 在这里处理 Markdown AST
6. remarkRehype - 转换 mdast 为 hast
7. rehypeRaw - 解析 Markdown 中的 HTML
8. rehypeConvertAbnormalTagsToText - 转换异常标签
9. rehypeSanitize - HTML 清理
10. rehypeMathJaxChtml (可选) - MathJax 渲染
11. 用户自定义 rehypePlugins ← 在这里处理 HTML AST
12. rehypeStringify - 将 hast 转换为 HTML 字符串
```

理解这个顺序有助于正确编写和放置自定义插件。
