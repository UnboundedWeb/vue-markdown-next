# Vue Renderer

The `@markdown-next/vue` package provides Vue 3 components for rendering markdown content.

## Core Concepts

### Rendering Architecture

The Vue renderer adopts a modular architecture design with the following core layers:

```
Markdown Text
    ↓
Parser (Parse Markdown to HAST)
    ↓
HAST (Hypertext Abstract Syntax Tree)
    ↓
hastToVue (Transform HAST to Vue VNode)
    ↓
Vue VNode (Render to DOM)
```

#### 1. Parser Layer

The parser layer is responsible for converting Markdown text into HAST (Hypertext Abstract Syntax Tree). There are two parsing approaches:

- **Direct Parsing**: Uses `useMarkdownParser` hook to create a parser instance in the main thread
- **Worker Pool Parsing**: Uses `useMarkdownWorkerPool` hook to parse in parallel using Web Workers

```typescript
// Direct parsing
const parser = createParser(parserOptions);
const tree = await parser.parseToHAST(markdown);

// Worker Pool parsing
const tree = await pool.parseToHAST(markdown);
```

#### 2. Transform Layer

The transform layer converts HAST to Vue VNodes through the `hastToVue` function:

```typescript
function renderHastToVue(tree: Root, options?: MarkdownRenderOptions): VNodeChild {
  const components = resolveComponents(options);
  return renderNode(tree, components);
}
```

**Transformation Process:**

1. **Traverse HAST Nodes**: Recursively traverse each node in the HAST tree
2. **Component Resolution**: Select the appropriate rendering method based on node type (element/text/root)
3. **Props Normalization**: Convert HAST attributes to Vue-compatible props (className → class, htmlFor → for)
4. **Style Merging**: Merge GitHub theme styles with user-defined styles
5. **VNode Generation**: Create VNodes using Vue's `h()` function

#### 3. Component System

The component system allows you to customize how any HTML element is rendered:

```typescript
type MarkdownComponent = Component | FunctionalComponent | string;
type MarkdownComponents = Record<string, MarkdownComponent>;
```

**Default Components:**

The renderer provides default components for all common Markdown elements, which automatically apply GitHub-style styling:

```typescript
const defaultComponents = {
  h1: createStyledTag('h1'),
  h2: createStyledTag('h2'),
  p: createStyledTag('p'),
  code: createCodeComponent(),
  // ... other elements
};
```

**Component Resolution Priority:**

1. Custom components provided by user via `components` prop
2. Code renderer provided by user via `codeRenderer` prop (only for `<code>` elements)
3. Default styled components
4. Native HTML tags

#### 4. Mode-Aware Scheduling (Static / Streaming)

Scheduling defaults are derived from `mode`, then can be overridden explicitly:

- `static` mode: `dynamic` defaults to `false`, `debounceMs` defaults to `250`
- `streaming` mode: `dynamic` defaults to `true`, `debounceMs` defaults to `80`

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

**Workflow:**

1. Watch markdown and render option changes
2. Derive scheduling defaults from `mode`
3. Debounce only when `dynamic` is enabled
4. Use `taskId` to ensure only the latest render task updates the content (prevents race conditions)

#### 5. Streamdown Block Reuse

When `mode` is `streaming`, the renderer switches from whole-document parsing to block-based incremental rendering:

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

`streamdown.parseIncompleteMarkdown` defaults to `true` and repairs incomplete markdown markers while tokens are still arriving, so partially received content can still render.

#### 6. Worker Pool Context

The `MarkdownWorkerPoll` component provides a shared Worker Pool to its children through Vue's `provide/inject` mechanism:

```typescript
// MarkdownWorkerPoll provides context
provide(markdownWorkerContextKey, {
  pool, // Worker Pool instance
  renderOptions, // Render options
  forceRenderOptions, // Whether to force these options
});

// MarkdownRenderer injects context
const context = inject(markdownWorkerContextKey, null);
```

**Advantages:**

- **Resource Sharing**: Multiple `MarkdownRenderer` components share the same Worker Pool
- **Performance Optimization**: Avoid creating separate Workers for each renderer
- **Unified Configuration**: Configure parser and render options at the Pool level

#### 7. Style System

The renderer uses an inline style system with a GitHub-flavored default theme:

```typescript
// Create styled component for each tag
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

**Style Merging Strategy:**

1. Apply GitHub theme base styles (`githubTagStyles`)
2. Merge user-provided custom styles via `style` prop
3. User styles have higher priority and can override defaults

**Special Handling:**

- **Code Blocks**: Distinguish between inline code and block code, applying different styles
- **Math Formulas**: MathJax tags are automatically filtered and don't receive custom components

#### 8. Error Handling

The renderer provides multi-level error handling:

```typescript
// Component-level error capture
onErrorCaptured((err) => {
  renderError.value = toError(err);
  return false; // Prevent error from propagating
});

// Hook-level error handling
try {
  const rendered = await render(value, options);
  content.value = rendered;
} catch (err) {
  error.value = toError(err);
}
```

**Error Display:**

When an error occurs, the renderer displays a friendly error message box with the error details.

#### 9. Loading State Management

The renderer provides clear loading state feedback:

```typescript
const showLoading = loading.value && !content.value && !error.value;
```

**Display Logic:**

- Only show loading indicator on first load
- Don't show loading indicator during updates if content already exists (avoid flicker)
- Error state takes priority over loading state

## Components

### MarkdownRenderer

The main component for rendering markdown content.

```vue
<script setup lang="ts">
import { MarkdownRenderer } from '@markdown-next/vue';
import { ref } from 'vue';

const markdown = ref('# Hello World');
</script>

<template>
  <MarkdownRenderer :markdown="markdown" />
</template>
```

#### Props

| Prop            | Type                        | Default                                       | Description                                                                                |
| --------------- | --------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `markdown`      | `string`                    | **required**                                  | The markdown content to render                                                             |
| `parserOptions` | `ParserOptions`             | `undefined`                                   | Parser options to control Markdown parsing behavior. [See Parser Options](#parser-options) |
| `components`    | `MarkdownComponents`        | `undefined`                                   | Custom component overrides                                                                 |
| `codeRenderer`  | `MarkdownComponent`         | `undefined`                                   | Custom code block renderer                                                                 |
| `mode`          | `'static' \| 'streaming'`   | `'static'`                                    | Rendering mode                                                                             |
| `streamdown`    | `MarkdownStreamdownOptions` | `undefined`                                   | Streamdown options used in `streaming` mode                                                |
| `dynamic`       | `boolean`                   | mode-aware (`false` static, `true` streaming) | Whether to debounce render scheduling                                                      |
| `debounceMs`    | `number`                    | mode-aware (`250` static, `80` streaming)     | Debounce delay (ms)                                                                        |
| `loadingSlot`   | `LoadingSlot`               | `undefined`                                   | Custom loading content shown before first successful render                                |

#### Parser Options

`parserOptions` is used to configure the behavior of the Markdown parser. For complete API documentation, refer to the [Parser Guide](/v1/en/guide/parser) and [Parser API](/v1/en/api/parser).

**Main Configuration Options:**

```typescript
interface ParserOptions {
  // Extended syntax support
  extendedGrammar?: Array<'gfm' | 'mathjax'>;

  // LaTeX syntax support
  supportsLaTeX?: boolean;

  // Custom allowed HTML tags
  customTags?: string[];

  // Custom remark plugins (process Markdown AST)
  remarkPlugins?: PluggableList;

  // Custom rehype plugins (process HTML AST)
  rehypePlugins?: PluggableList;

  // MathJax configuration (only effective when mathjax is enabled)
  mathJaxConfig?: MathJaxOptions;
}
```

**Common Configuration Examples:**

```vue
<script setup lang="ts">
import { MarkdownRenderer } from '@markdown-next/vue';
import { ref } from 'vue';
import type { ParserOptions } from '@markdown-next/parser';

const markdown = ref('# Heading\n\nThis is **bold** text.');

// Enable GitHub Flavored Markdown
const parserOptions: ParserOptions = {
  extendedGrammar: ['gfm'],
};
</script>

<template>
  <MarkdownRenderer :markdown="markdown" :parserOptions="parserOptions" />
</template>
```

**Enable Math Formula Support:**

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

**Custom Allowed HTML Tags:**

```typescript
const parserOptions: ParserOptions = {
  customTags: ['custom-element', 'my-component'],
};
```

::: tip
`MarkdownRenderer` creates a new parser instance on each instantiation. If you need to share parser configuration across multiple components, use the `MarkdownWorkerPoll` component.
:::

#### Streaming Mode

Use `streaming` mode for append-only or token-by-token content (for example, LLM output). It enables streamdown block reuse and mode-aware scheduling defaults:

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

When you need deterministic full-document rendering, use `mode="static"` (the default), or explicitly override scheduling with `:dynamic` / `:debounceMs`.

### MarkdownWorkerPoll

Wrapper component that provides a worker pool context for child `MarkdownRenderer` components.

```vue
<script setup lang="ts">
import { MarkdownRenderer, MarkdownWorkerPoll } from '@markdown-next/vue';
import { ref } from 'vue';

const markdown1 = ref('# Document 1');
const markdown2 = ref('# Document 2');

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

#### Props

| Prop              | Type                        | Default      | Description                                                                                                                                                                                                                  |
| ----------------- | --------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `workerCount`     | `number`                    | **required** | Number of worker threads                                                                                                                                                                                                     |
| `parserOptions`   | `ParserOptions`             | `undefined`  | Parser options for all child components. Supports all `ParserOptions` configuration items, or you can configure specific options individually (e.g., `customTags`, `extendedGrammar`). [See Parser Options](#parser-options) |
| `components`      | `MarkdownComponents`        | `undefined`  | Force component overrides for all children                                                                                                                                                                                   |
| `codeRenderer`    | `MarkdownComponent`         | `undefined`  | Force code renderer for all children                                                                                                                                                                                         |
| `mode`            | `'static' \| 'streaming'`   | `undefined`  | Force rendering mode for all children                                                                                                                                                                                        |
| `streamdown`      | `MarkdownStreamdownOptions` | `undefined`  | Force streamdown options for all children                                                                                                                                                                                    |
| `dynamic`         | `boolean`                   | `undefined`  | Force scheduling strategy for all children                                                                                                                                                                                   |
| `debounceMs`      | `number`                    | `undefined`  | Force debounce delay (ms) for all children                                                                                                                                                                                   |
| `loadingSlot`     | `LoadingSlot`               | `undefined`  | Force loading slot for all children                                                                                                                                                                                          |
| `customTags`      | `string[]`                  | `undefined`  | Custom allowed HTML tags (merged into `parserOptions`)                                                                                                                                                                       |
| `extendedGrammar` | `Array<'gfm' \| 'mathjax'>` | `undefined`  | Extended syntax support (merged into `parserOptions`)                                                                                                                                                                        |
| `remarkPlugins`   | `PluggableList`             | `undefined`  | Custom remark plugins (merged into `parserOptions`)                                                                                                                                                                          |
| `rehypePlugins`   | `PluggableList`             | `undefined`  | Custom rehype plugins (merged into `parserOptions`)                                                                                                                                                                          |
| `mathJaxConfig`   | `MathJaxOptions`            | `undefined`  | MathJax configuration (merged into `parserOptions`)                                                                                                                                                                          |

::: tip
`MarkdownWorkerPoll` provides two ways to configure parser options:

1. Pass a complete parser configuration object via the `parserOptions` prop
2. Configure specific options using individual props (e.g., `customTags`, `extendedGrammar`)

Both approaches can be used simultaneously, with individual props taking precedence over the corresponding configuration in `parserOptions`.

When `mode` / `streamdown` / `dynamic` / `debounceMs` / `loadingSlot` are set on `MarkdownWorkerPoll`, child `MarkdownRenderer` instances use those values as forced render options.
:::

## Custom Components

Using a custom Vue component to override the default GitHub-styled HTML element rendering:

```vue
<script setup lang="ts">
import { MarkdownRenderer } from '@markdown-next/vue';
import { ref, h } from 'vue';
import type { MarkdownComponents } from '@markdown-next/vue';

const markdown = ref('# Custom Heading\n\n> This is a quote');

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

## Code Renderer

Customize code block rendering for syntax highlighting:

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

## Composables

### useMarkdownParser

For more control, use the composable directly:

```vue
<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useMarkdownParser } from '@markdown-next/vue';

const markdown = ref('# Hello');
const parserOptions = {
  extendedGrammar: ['gfm'],
};

const { content, loading, error } = useMarkdownParser(markdown, parserOptions, { dynamic: true });

watchEffect(() => {
  if (error.value) {
    console.error('Parse error:', error.value);
  }
});
</script>

<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <component v-else :is="content" />
  </div>
</template>
```

### useMarkdownWorkerPool

Use worker pool directly:

```ts
import { ref } from 'vue';
import { useMarkdownWorkerPool } from '@markdown-next/vue';
import { MarkdownWorkerPool } from '@markdown-next/parser';

const pool = new MarkdownWorkerPool({ workerCount: 2 });
const markdown = ref('# Hello');

const { content, loading, error } = useMarkdownWorkerPool(markdown, pool, {
  mode: 'streaming',
});
```

## Math Formula Rendering

MarkdownRenderer supports rendering LaTeX mathematical formulas using MathJax.

### Basic Configuration

To enable math formula support, configure the parser options:

```vue
<script setup lang="ts">
import { MarkdownRenderer } from '@markdown-next/vue';
import { ref } from 'vue';
import type { ParserOptions } from '@markdown-next/parser';

const markdown = ref(`
# Math Formula Example

Inline formula: The mass-energy equation $E = mc^2$ describes the relationship between mass and energy.

Block formula:

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

### Supported Formula Types

**Inline formulas**: Wrapped with single `$` symbols

```markdown
Einstein's mass-energy equation $E = mc^2$ is famous.
```

**Block formulas**: Wrapped with double `$$` symbols

```markdown
$$
\frac{d}{dx}\left( \int_{0}^{x} f(u)\,du\right)=f(x)
$$
```

### Complex Formula Examples

```vue
<script setup lang="ts">
import { MarkdownRenderer } from '@markdown-next/vue';
import { ref } from 'vue';

const markdown = ref(`
### Matrices

$$
\\begin{pmatrix}
a & b \\\\
c & d
\\end{pmatrix}
$$

### Multi-line Aligned Equations

$$
\\begin{aligned}
f(x) &= (x+a)(x+b) \\\\
&= x^2 + (a+b)x + ab
\\end{aligned}
$$

### Piecewise Functions

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

See the [Math Formula Examples](/v1/en/examples/math) for more complex usage and an interactive editor.
