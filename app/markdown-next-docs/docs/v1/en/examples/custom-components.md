# Custom Components

Learn how to customize the rendering of markdown elements with custom Vue components.

## Basic Component Override

Override default HTML elements with custom components:

```vue
<script setup lang="ts">
import { ref, h } from 'vue';
import { MarkdownRenderer } from '@markdown-next/vue';
import type { MarkdownComponents } from '@markdown-next/vue';

const markdown = ref(`
# Custom Components

This heading uses a custom component!

> This blockquote is also customized.
`);

const components: MarkdownComponents = {
  h1: (props, { slots }) =>
    h(
      'h1',
      {
        class: 'custom-heading',
        style: {
          color: '#e67e22',
          borderBottom: '3px solid #f39c12',
          paddingBottom: '0.5rem',
        },
      },
      slots.default?.()
    ),
  blockquote: (props, { slots }) =>
    h(
      'div',
      {
        class: 'custom-quote',
        style: {
          borderLeft: '4px solid #3498db',
          paddingLeft: '1rem',
          fontStyle: 'italic',
          background: '#ecf0f1',
          padding: '1rem',
        },
      },
      slots.default?.()
    ),
};
</script>

<template>
  <MarkdownRenderer :markdown="markdown" :components="components" />
</template>
```

## Custom Link Component

Make all links open in a new tab:

```vue
<script setup lang="ts">
import { ref, h } from 'vue';
import { MarkdownRenderer } from '@markdown-next/vue';
import type { MarkdownComponents } from '@markdown-next/vue';

const markdown = ref(`
Check out [Vue.js](https://vuejs.org) and [Vite](https://vitejs.dev)!
`);

const components: MarkdownComponents = {
  a: (props, { slots }) =>
    h(
      'a',
      {
        ...props,
        target: '_blank',
        rel: 'noopener noreferrer',
        style: {
          color: '#e67e22',
          textDecoration: 'underline',
          fontWeight: 'bold',
        },
      },
      slots.default?.()
    ),
};
</script>

<template>
  <MarkdownRenderer :markdown="markdown" :components="components" />
</template>
```

## Custom Code Renderer with Syntax Highlighting

Add syntax highlighting using highlight.js:

```vue
<script setup lang="ts">
import { ref, h } from 'vue';
import { MarkdownRenderer } from '@markdown-next/vue';
import type { MarkdownComponent } from '@markdown-next/vue';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

const markdown = ref(`
\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet('World');
\`\`\`

\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
\`\`\`
`);

const codeRenderer: MarkdownComponent = (props) => {
  // Extract code content
  const codeNode = props.children?.[0]?.children?.[0];
  const code = codeNode?.value || '';

  // Extract language from className
  const className = props.children?.[0]?.properties?.className;
  const lang = Array.isArray(className) ? className[0]?.replace('language-', '') : 'plaintext';

  // Highlight code
  const highlighted =
    lang && hljs.getLanguage(lang)
      ? hljs.highlight(code, { language: lang }).value
      : hljs.highlightAuto(code).value;

  return h('pre', { class: 'code-block' }, [
    h('div', { class: 'code-header' }, [h('span', { class: 'language-badge' }, lang)]),
    h('code', {
      class: `language-${lang} hljs`,
      innerHTML: highlighted,
    }),
  ]);
};
</script>

<template>
  <MarkdownRenderer :markdown="markdown" :codeRenderer="codeRenderer" />
</template>

<style scoped>
.code-block {
  position: relative;
  margin: 1rem 0;
  border-radius: 8px;
  overflow: hidden;
  background: #1e1e1e;
}

.code-header {
  background: #2d2d2d;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #404040;
}

.language-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: #e67e22;
  color: white;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
}

.code-block code {
  display: block;
  padding: 1rem;
  overflow-x: auto;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
}
</style>
```

## Custom Table Component

Style tables with custom components:

```vue
<script setup lang="ts">
import { ref, h } from 'vue';
import { MarkdownRenderer } from '@markdown-next/vue';
import type { MarkdownComponents } from '@markdown-next/vue';

const markdown = ref(`
| Name | Role | Status |
|------|------|--------|
| Alice | Developer | Active |
| Bob | Designer | Active |
| Charlie | Manager | Away |
`);

const components: MarkdownComponents = {
  table: (props, { slots }) =>
    h('div', { class: 'table-wrapper' }, [
      h('table', { class: 'custom-table' }, slots.default?.()),
    ]),
  thead: (props, { slots }) => h('thead', { class: 'table-header' }, slots.default?.()),
  th: (props, { slots }) => h('th', { class: 'table-heading' }, slots.default?.()),
  td: (props, { slots }) => h('td', { class: 'table-cell' }, slots.default?.()),
  tr: (props, { slots }) => h('tr', { class: 'table-row' }, slots.default?.()),
};

const parserOptions = {
  extendedGrammar: ['gfm'],
};
</script>

<template>
  <MarkdownRenderer :markdown="markdown" :parserOptions="parserOptions" :components="components" />
</template>

<style scoped>
.table-wrapper {
  overflow-x: auto;
  margin: 1.5rem 0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.table-header {
  background: linear-gradient(135deg, #e67e22, #f39c12);
  color: white;
}

.table-heading {
  padding: 1rem;
  text-align: left;
  font-weight: bold;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.table-row:nth-child(even) {
  background: #f8f9fa;
}

.table-row:hover {
  background: #fff8e1;
  transition: background 0.2s;
}

.table-cell {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e0e0e0;
}
</style>
```

## Combining Multiple Customizations

Use multiple custom components together:

```vue
<script setup lang="ts">
import { ref, h } from 'vue';
import { MarkdownRenderer } from '@markdown-next/vue';
import type { MarkdownComponents, MarkdownComponent } from '@markdown-next/vue';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

const markdown = ref(`
# 🎨 Fully Customized Markdown

> **Note:** This example shows multiple custom components working together.

## Features

- Custom headings with icons
- Styled blockquotes
- Highlighted code blocks
- Fancy links

\`\`\`javascript
const awesome = true;
console.log('Everything is customized!');
\`\`\`

Visit [our website](https://example.com) for more!
`);

const components: MarkdownComponents = {
  h1: (props, { slots }) => h('h1', { class: 'custom-h1' }, slots.default?.()),
  h2: (props, { slots }) => h('h2', { class: 'custom-h2' }, ['📌 ', ...(slots.default?.() || [])]),
  blockquote: (props, { slots }) => h('div', { class: 'custom-blockquote' }, slots.default?.()),
  a: (props, { slots }) =>
    h(
      'a',
      {
        ...props,
        class: 'custom-link',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      slots.default?.()
    ),
};

const codeRenderer: MarkdownComponent = (props) => {
  const codeNode = props.children?.[0]?.children?.[0];
  const code = codeNode?.value || '';
  const className = props.children?.[0]?.properties?.className;
  const lang = Array.isArray(className) ? className[0]?.replace('language-', '') : 'plaintext';

  const highlighted =
    lang && hljs.getLanguage(lang) ? hljs.highlight(code, { language: lang }).value : code;

  return h('pre', { class: 'hljs-code-block' }, [
    h('code', {
      class: `language-${lang}`,
      innerHTML: highlighted,
    }),
  ]);
};

const parserOptions = {
  extendedGrammar: ['gfm'],
};
</script>

<template>
  <div class="custom-container">
    <MarkdownRenderer
      :markdown="markdown"
      :parserOptions="parserOptions"
      :components="components"
      :codeRenderer="codeRenderer"
    />
  </div>
</template>

<style scoped>
.custom-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.custom-h1 {
  font-size: 2.5rem;
  background: linear-gradient(135deg, #e67e22, #f39c12);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1.5rem;
}

.custom-h2 {
  font-size: 1.75rem;
  color: #2c3e50;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.custom-blockquote {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 1.5rem 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.custom-link {
  color: #e67e22;
  text-decoration: none;
  border-bottom: 2px solid #f39c12;
  transition: all 0.3s;
  font-weight: 500;
}

.custom-link:hover {
  color: #f39c12;
  border-bottom-color: #e67e22;
}

.hljs-code-block {
  margin: 1.5rem 0;
  border-radius: 8px;
  overflow: hidden;
}

.hljs-code-block code {
  display: block;
  padding: 1.5rem;
  font-size: 14px;
  line-height: 1.6;
}
</style>
```
