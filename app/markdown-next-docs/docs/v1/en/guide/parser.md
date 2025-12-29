# Parser

The `@markdown-next/parser` package provides the core markdown parsing functionality using the unified/remark/rehype ecosystem.

## Overview

The parser transforms markdown text into HAST (HTML Abstract Syntax Tree) that can be rendered by the Vue components. It supports:

- **GFM (GitHub Flavored Markdown)**: Tables, task lists, strikethrough, and more
- **MathJax**: Inline and block math expressions
- **Custom plugins**: Extend with remark and rehype plugins
- **HTML sanitization**: Built-in XSS protection
- **Worker support**: Offload parsing to Web Workers for better performance

## Parser Options

### `ParserOptions` Interface

```ts
interface ParserOptions {
  // Enable LaTeX math support
  supportsLaTeX?: boolean;

  // Extended grammar support
  extendedGrammar?: Array<'gfm' | 'mathjax'>;

  // Custom remark plugins
  remarkPlugins?: Array<RemarkPlugin>;

  // Custom rehype plugins
  rehypePlugins?: Array<RehypePlugin>;

  // HTML sanitization options
  sanitize?: boolean | SanitizeSchema;
}
```

### Basic Configuration

```ts
import type { ParserOptions } from '@markdown-next/parser';

const options: ParserOptions = {
  supportsLaTeX: true,
  extendedGrammar: ['gfm', 'mathjax'],
};
```

## Extended Grammar

### GitHub Flavored Markdown (GFM)

Enable GFM to support tables, task lists, strikethrough, and autolinks:

```ts
const options: ParserOptions = {
  extendedGrammar: ['gfm'],
};
```

**Supported features:**

- Tables
- Task lists
- Strikethrough (`~~text~~`)
- Autolinks
- Footnotes

**Example:**

```markdown
| Feature | Supported |
| ------- | --------- |
| Tables  | ✅        |
| Tasks   | ✅        |

- [x] Completed task
- [ ] Pending task

~~Strikethrough text~~
```

### MathJax Support

Enable LaTeX math rendering:

```ts
const options: ParserOptions = {
  supportsLaTeX: true,
  extendedGrammar: ['mathjax'],
};
```

**Inline math:**

```markdown
The equation $E = mc^2$ is famous.
```

**Block math:**

```markdown
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

## HTML Sanitization

By default, all HTML in markdown is sanitized to prevent XSS attacks.

### Default Sanitization

```ts
const options: ParserOptions = {
  sanitize: true, // default
};
```

### Custom Sanitization Schema

```ts
import { defaultSchema } from '@markdown-next/parser';

const options: ParserOptions = {
  sanitize: {
    ...defaultSchema,
    tagNames: [...defaultSchema.tagNames, 'custom-element'],
    attributes: {
      ...defaultSchema.attributes,
      'custom-element': ['data-*'],
    },
  },
};
```

### Disable Sanitization

::: danger
Only disable sanitization if you completely trust the markdown source!
:::

```ts
const options: ParserOptions = {
  sanitize: false, // Not recommended
};
```

## Direct Usage

While typically used through the Vue components, you can use the parser directly:

```ts
import { createMarkdownParser } from '@markdown-next/parser';

const parser = createMarkdownParser({
  supportsLaTeX: true,
  extendedGrammar: ['gfm', 'mathjax'],
});

const markdown = '# Hello World\n\nThis is **bold**.';
const hast = await parser.parse(markdown);

console.log(hast); // HAST tree
```

## Worker Pool

For better performance in applications with frequent markdown parsing, use a worker pool:

```ts
import { MarkdownWorkerPool } from '@markdown-next/parser';

const pool = new MarkdownWorkerPool({
  workerCount: 2,
  parserOptions: {
    supportsLaTeX: true,
    extendedGrammar: ['gfm', 'mathjax'],
  },
});

const hast = await pool.parse('# Hello');

// Clean up when done
pool.terminate();
```

See [Worker Pool Example](/v1/en/examples/worker-pool) for more details.
