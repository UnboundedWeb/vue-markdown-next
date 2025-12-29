# Basic Usage

This example demonstrates the basic usage of the MarkdownRenderer component.

## Simple Rendering

The most basic usage:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { MarkdownRenderer } from '@markdown-next/vue';

const markdown = ref(`
# Welcome to Markdown Next

This is a simple example with:

- **Bold text**
- *Italic text*
- [Links](https://github.com)
- \`inline code\`

\`\`\`javascript
const hello = 'world';
console.log(hello);
\`\`\`
`);
</script>

<template>
  <MarkdownRenderer :markdown="markdown" />
</template>
```

## With Parser Options

Enable extended features like GFM:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { MarkdownRenderer } from '@markdown-next/vue';
import type { ParserOptions } from '@markdown-next/parser';

const markdown = ref(`
# Task List

- [x] Completed task
- [ ] Pending task

## Table

| Name | Age |
|------|-----|
| John | 25  |
| Jane | 30  |

~~Strikethrough~~
`);

const parserOptions: ParserOptions = {
  extendedGrammar: ['gfm'],
};
</script>

<template>
  <MarkdownRenderer :markdown="markdown" :parserOptions="parserOptions" />
</template>
```

## Math Support

Enable LaTeX math rendering:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { MarkdownRenderer } from '@markdown-next/vue';
import type { ParserOptions } from '@markdown-next/parser';

const markdown = ref(`
# Mathematical Formulas

Inline equation: $E = mc^2$

Block equation:

$$
\\frac{d}{dx}\\left( \\int_{0}^{x} f(u)\\,du\\right)=f(x)
$$

Matrix:

$$
\\begin{bmatrix}
a & b \\\\
c & d
\\end{bmatrix}
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

## Dynamic Editor

Create a live markdown editor:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { MarkdownRenderer } from '@markdown-next/vue';

const markdown = ref('# Start typing...\n\nYour markdown will render as you type.');

function updateMarkdown(event: Event) {
  markdown.value = (event.target as HTMLTextAreaElement).value;
}
</script>

<template>
  <div class="editor-container">
    <div class="editor-pane">
      <h3>Editor</h3>
      <textarea
        :value="markdown"
        @input="updateMarkdown"
        class="editor"
        placeholder="Type markdown here..."
      />
    </div>
    <div class="preview-pane">
      <h3>Preview</h3>
      <MarkdownRenderer :markdown="markdown" :dynamic="true" :debounceMs="300" class="preview" />
    </div>
  </div>
</template>

<style scoped>
.editor-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  height: 600px;
}

.editor-pane,
.preview-pane {
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  overflow: hidden;
}

h3 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
}

.editor {
  flex: 1;
  width: 100%;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  resize: none;
}

.editor:focus {
  outline: 2px solid #e67e22;
  border-color: #e67e22;
}

.preview {
  flex: 1;
  overflow: auto;
  padding: 1rem;
  background: #fafafa;
  border-radius: 4px;
}
</style>
```

## Full Example

Complete example with all features:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { MarkdownRenderer } from '@markdown-next/vue';
import type { ParserOptions } from '@markdown-next/parser';

const markdown = ref(`
# Complete Example

## Text Formatting

**Bold**, *italic*, and \`code\`.

## Lists

1. First item
2. Second item
   - Nested item
   - Another nested

## Code Block

\`\`\`typescript
interface User {
  name: string;
  age: number;
}

const user: User = {
  name: 'John',
  age: 25
};
\`\`\`

## Blockquote

> This is a quote.
> It can span multiple lines.

## Links and Images

[GitHub](https://github.com)

![Alt text](https://via.placeholder.com/150)

## Table (GFM)

| Feature | Support |
|---------|---------|
| GFM     | ✅      |
| Math    | ✅      |

## Math (MathJax)

Inline: $f(x) = x^2$

Block:
$$
\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}
$$
`);

const parserOptions: ParserOptions = {
  supportsLaTeX: true,
  extendedGrammar: ['gfm', 'mathjax'],
};
</script>

<template>
  <div class="container">
    <h1>Markdown Next - Full Demo</h1>
    <MarkdownRenderer :markdown="markdown" :parserOptions="parserOptions" />
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
```
