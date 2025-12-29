# @markdown-next/parser

Core markdown parser with support for GFM, MathJax, and worker pools.

## Types

### ParserOptions

Configuration options for the markdown parser.

```ts
interface ParserOptions {
  /**
   * Custom allowed HTML tags (these tags will be preserved during sanitization)
   * @default []
   */
  customTags?: string[];

  /**
   * Enable LaTeX math support
   * When true, enables remarkMathDelimiters to parse LaTeX syntax using \( and \[ as delimiters.
   * @default false
   */
  supportsLaTeX?: boolean;

  /**
   * Extended grammar support
   * - 'gfm': GitHub Flavored Markdown (tables, task lists, etc.)
   * - 'mathjax': MathJax LaTeX rendering
   */
  extendedGrammar?: Array<'gfm' | 'mathjax'>;

  /**
   * MathJax configuration options (only effective when 'mathjax' is included in extendedGrammar)
   * @see https://docs.mathjax.org/en/latest/options/index.html
   */
  mathJaxConfig?: MathJaxOptions;

  /**
   * Custom remark plugins
   */
  remarkPlugins?: RemarkPlugin[];

  /**
   * Custom rehype plugins
   */
  rehypePlugins?: RehypePlugin[];

  /**
   * HTML sanitization configuration
   * @default true
   */
  sanitize?: boolean | SanitizeSchema;
}
```

### SanitizeSchema

Schema for HTML sanitization.

```ts
interface SanitizeSchema {
  /**
   * Allowed HTML tag names
   */
  tagNames?: string[];

  /**
   * Allowed attributes per tag
   */
  attributes?: Record<string, string[]>;

  /**
   * Allowed protocols for URLs
   */
  protocols?: Record<string, string[]>;

  /**
   * Additional sanitization options
   */
  [key: string]: unknown;
}
```

## Functions

### createParser

Creates a markdown parser instance.

```ts
function createParser(options?: ParserOptions): Parser;
```

**Example:**

```ts
import { createParser } from '@markdown-next/parser';

const parser = createParser({
  supportsLaTeX: true,
  extendedGrammar: ['gfm', 'mathjax'],
});

const hast = await parser.parse('# Hello World');
```

## Classes

### Parser

A single-threaded Markdown parser that processes parsing tasks synchronously in the main thread.

#### Constructor

```ts
constructor(options?: ParserOptions)
```

**Parameters:**

- `options`: Parser configuration options

**Example:**

```ts
import { Parser } from '@markdown-next/parser';

const parser = new Parser({
  supportsLaTeX: true,
  extendedGrammar: ['gfm', 'mathjax'],
});
```

#### Methods

##### parseToHTML

Parses Markdown to an HTML string.

```ts
async parseToHTML(markdown: string): Promise<string>
```

**Parameters:**

- `markdown`: Markdown string

**Returns:**

- `Promise<string>`: HTML string

**Example:**

```ts
const html = await parser.parseToHTML('# Hello\n\nThis is **bold**.');
// Output: '<h1>Hello</h1>\n<p>This is <strong>bold</strong>.</p>'
```

##### parseToHAST

Parses Markdown to HAST (HTML Abstract Syntax Tree).

```ts
async parseToHAST(markdown: string): Promise<Root>
```

**Parameters:**

- `markdown`: Markdown string

**Returns:**

- `Promise<Root>`: HAST Root node

**Example:**

```ts
import { Root } from 'hast';

const hast: Root = await parser.parseToHAST('# Hello World');
console.log(hast);
// Outputs HAST object structure
```

##### batchParseToHTML

Parses multiple Markdown strings to HTML in a batch.

```ts
async batchParseToHTML(markdowns: string[]): Promise<string[]>
```

**Parameters:**

- `markdowns`: Array of Markdown strings

**Returns:**

- `Promise<string[]>`: Array of HTML strings

**Example:**

```ts
const htmlList = await parser.batchParseToHTML(['# Document 1', '# Document 2', '# Document 3']);
// Returns 3 HTML strings
```

##### batchParseToHAST

Parses multiple Markdown strings to HAST in a batch.

```ts
async batchParseToHAST(markdowns: string[]): Promise<Root[]>
```

**Parameters:**

- `markdowns`: Array of Markdown strings

**Returns:**

- `Promise<Root[]>`: Array of HAST Root nodes

**Example:**

```ts
const hastList = await parser.batchParseToHAST(['# Document 1', '# Document 2', '# Document 3']);
// Returns 3 HAST objects
```

---

### ParserWorkerPool

Manages a pool of Web Workers for parsing markdown.

```ts
class ParserWorkerPool {
  constructor(options: WorkerPoolOptions);

  /**
   * Parses Markdown to an HTML string using the worker pool.
   */
  async parseToHTML(markdown: string): Promise<string>;

  /**
   * Parses Markdown to HAST using the worker pool.
   */
  async parseToHAST(markdown: string): Promise<Root>;

  /**
   * Parses multiple Markdown strings to HTML in a batch using the worker pool.
   */
  async batchParseToHTML(markdowns: string[]): Promise<string[]>;

  /**
   * Parses multiple Markdown strings to HAST in a batch using the worker pool.
   */
  async batchParseToHAST(markdowns: string[]): Promise<Root[]>;

  /**
   * Dynamically updates the parser options for all workers in the pool.
   */
  async updateOptions(options: Partial<ParserOptions>): Promise<void>;

  /**
   * Destroys the worker pool, terminating all workers and releasing resources.
   */
  async destroy(): Promise<void>;

  /**
   * Gets current status information about the worker pool.
   */
  getPoolInfo(): {
    workerCount: number;
    activeWorkers: number;
    busyWorkers: number;
    maxWorkers: number;
    environment: 'browser' | 'node' | 'unknown';
    initialized: boolean;
  };
}
```

#### WorkerPoolOptions

```ts
interface WorkerPoolOptions extends ParserOptions {
  /**
   * Number of worker threads, defaults to CPU core count (max 8)
   * If not specified, it will be automatically calculated based on the environment:
   * - Browser: navigator.hardwareConcurrency
   * - Node.js: os.cpus().length
   */
  workerCount?: number;
}
```

**Example:**

```ts
import { ParserWorkerPool } from '@markdown-next/parser';

const pool = new ParserWorkerPool({
  workerCount: 4,
  parserOptions: {
    extendedGrammar: ['gfm'],
  },
});

// Parse markdown
const hast = await pool.parseToHAST('# Hello');

// Check stats
console.log(pool.getPoolInfo());

// Clean up
await pool.destroy();
```

## Usage Advice

### When to use a single-threaded parser?

Suitable for the following scenarios:

- Small applications with low parsing frequency
- Only a small number of documents need to be parsed
- Performance requirements are not high
- Desire to reduce memory footprint

```ts
import { createParser } from '@markdown-next/parser';

const parser = createParser({ extendedGrammar: ['gfm'] });
const html = await parser.parseToHTML(markdown);
```

### When to use a Worker Pool?

Suitable for the following scenarios:

- Need to parse a large number of documents
- Real-time preview scenarios (e.g., Markdown editor)
- Server-side rendering (Node.js)
- High performance requirements

```ts
import { createWorkerPool } from '@markdown-next/parser';

const pool = createWorkerPool({
  workerCount: 4,
  extendedGrammar: ['gfm', 'mathjax'],
});

// Batch parsing will automatically be processed in parallel
const results = await pool.batchParseToHTML(markdownList);

// Destroy when the application exits
await pool.destroy();
```

### Performance Comparison

When processing a large number of documents, the performance advantage of the Worker Pool is significant:

| Scenario             | Single-threaded Parser | Worker Pool (4 cores) |
| -------------------- | ---------------------- | --------------------- |
| Parse 1 document     | ~10ms                  | ~12ms (incl. init)    |
| Parse 100 documents  | ~1000ms                | ~300ms                |
| Parse 1000 documents | ~10000ms               | ~2800ms               |

::: tip Tip
The Worker Pool requires initialization when first used, which incurs a slight startup delay. However, in long-running applications, this delay can be ignored.
:::

## Constants

### defaultSchema

Default HTML sanitization schema.

```ts
const defaultSchema: SanitizeSchema;
```

This schema includes common safe HTML tags and attributes while preventing XSS attacks.

**Usage:**

```ts
import { defaultSchema } from '@markdown-next/parser';

const customSchema = {
  ...defaultSchema,
  tagNames: [...defaultSchema.tagNames, 'custom-element'],
};
```

## Plugin Development

### Remark Plugins

Extend markdown parsing with custom remark plugins:

```ts
import type { Plugin } from 'unified';
import type { Root } from 'mdast';

const myRemarkPlugin: Plugin<[], Root> = () => {
  return (tree) => {
    // Transform the markdown AST
    visit(tree, 'text', (node) => {
      node.value = node.value.toUpperCase();
    });
  };
};

const parser = createParser({
  remarkPlugins: [myRemarkPlugin],
});
```

### Rehype Plugins

Extend HTML output with custom rehype plugins:

```ts
import type { Plugin } from 'unified';
import type { Root } from 'hast';

const myRehypePlugin: Plugin<[], Root> = () => {
  return (tree) => {
    // Transform the HTML AST
    visit(tree, 'element', (node) => {
      if (node.tagName === 'a') {
        node.properties.target = '_blank';
      }
    });
  };
};

Understanding this order helps in correctly writing and placing custom plugins.
```

1. remarkParse - Parses Markdown to mdast
2. remarkGfm (optional) - GFM support
3. remarkMath (optional) - Math formula support
4. remarkMathDelimiters (optional) - LaTeX delimiter support
5. User-defined remarkPlugins ← Process Markdown AST here
6. remarkRehype - Converts mdast to hast
7. rehypeRaw - Parses HTML within Markdown
8. rehypeConvertAbnormalTagsToText - Converts abnormal tags
9. rehypeSanitize - HTML sanitization
10. rehypeMathJaxChtml (optional) - MathJax rendering
11. User-defined rehypePlugins ← Process HTML AST here
12. rehypeStringify - Converts hast to HTML string

```
Understanding this order helps in correctly writing and placing custom plugins.
```
