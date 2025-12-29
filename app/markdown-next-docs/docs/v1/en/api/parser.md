# @markdown-next/parser

Core markdown parser with support for GFM, MathJax, and worker pools.

## Types

### ParserOptions

Configuration options for the markdown parser.

```ts
interface ParserOptions {
  /**
   * Enable LaTeX math support
   * @default false
   */
  supportsLaTeX?: boolean;

  /**
   * Extended grammar support
   * - 'gfm': GitHub Flavored Markdown
   * - 'mathjax': MathJax LaTeX rendering
   */
  extendedGrammar?: Array<'gfm' | 'mathjax'>;

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

### createMarkdownParser

Creates a markdown parser instance.

```ts
function createMarkdownParser(options?: ParserOptions): MarkdownParser;
```

**Example:**

```ts
import { createMarkdownParser } from '@markdown-next/parser';

const parser = createMarkdownParser({
  supportsLaTeX: true,
  extendedGrammar: ['gfm', 'mathjax'],
});

const hast = await parser.parse('# Hello World');
```

## Classes

### MarkdownWorkerPool

Manages a pool of Web Workers for parsing markdown.

```ts
class MarkdownWorkerPool {
  constructor(options: WorkerPoolOptions);

  /**
   * Parse markdown using the worker pool
   */
  parse(markdown: string): Promise<Root>;

  /**
   * Terminate all workers
   */
  terminate(): void;

  /**
   * Get pool statistics
   */
  getStats(): WorkerPoolStats;
}
```

#### WorkerPoolOptions

```ts
interface WorkerPoolOptions {
  /**
   * Number of worker threads
   * @default 1
   */
  workerCount?: number;

  /**
   * Parser options for workers
   */
  parserOptions?: ParserOptions;

  /**
   * Maximum queue size
   * @default Infinity
   */
  maxQueueSize?: number;
}
```

#### WorkerPoolStats

```ts
interface WorkerPoolStats {
  /**
   * Number of active workers
   */
  activeWorkers: number;

  /**
   * Number of idle workers
   */
  idleWorkers: number;

  /**
   * Number of queued tasks
   */
  queuedTasks: number;

  /**
   * Total tasks completed
   */
  completedTasks: number;
}
```

**Example:**

```ts
import { MarkdownWorkerPool } from '@markdown-next/parser';

const pool = new MarkdownWorkerPool({
  workerCount: 4,
  parserOptions: {
    extendedGrammar: ['gfm'],
  },
});

// Parse markdown
const hast = await pool.parse('# Hello');

// Check stats
console.log(pool.getStats());

// Clean up
pool.terminate();
```

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

const parser = createMarkdownParser({
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

const parser = createMarkdownParser({
  rehypePlugins: [myRehypePlugin],
});
```
