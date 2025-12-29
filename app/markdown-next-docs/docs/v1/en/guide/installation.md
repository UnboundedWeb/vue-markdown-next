# Installation

## Package Manager

Install both packages using your preferred package manager:

::: code-group

```bash [npm]
npm install @markdown-next/parser @markdown-next/vue
```

```bash [pnpm]
pnpm add @markdown-next/parser @markdown-next/vue
```

```bash [yarn]
yarn add @markdown-next/parser @markdown-next/vue
```

:::

## Peer Dependencies

Make sure you have Vue 3 installed:

```bash
npm install vue@^3.2.0
```

## TypeScript Support

Both packages include TypeScript definitions. No additional `@types` packages are needed.

To enable proper type checking, make sure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "types": ["vue"]
  }
}
```

## Optional Dependencies

### For Syntax Highlighting

If you want to add syntax highlighting to code blocks, install `highlight.js`:

```bash
npm install highlight.js
```

Then configure a custom code renderer (see [Custom Components](/v1/en/examples/custom-components)).

### For LaTeX Support

LaTeX rendering is built-in through `rehype-mathjax`, which is already included as a dependency. Just enable it in parser options:

```ts
const parserOptions = {
  supportsLaTeX: true,
  extendedGrammar: ['mathjax'],
};
```

## CDN Usage

For quick prototyping, you can use ESM CDN:

```html
<!DOCTYPE html>
<html>
  <head>
    <script type="importmap">
      {
        "imports": {
          "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js",
          "@markdown-next/vue": "https://unpkg.com/@markdown-next/vue/dist/index.mjs",
          "@markdown-next/parser": "https://unpkg.com/@markdown-next/parser/dist/index.mjs"
        }
      }
    </script>
  </head>
  <body>
    <div id="app"></div>
    <script type="module">
      import { createApp, ref } from 'vue';
      import { MarkdownRenderer } from '@markdown-next/vue';

      createApp({
        components: { MarkdownRenderer },
        setup() {
          const markdown = ref('# Hello from CDN!');
          return { markdown };
        },
        template: '<MarkdownRenderer :markdown="markdown" />',
      }).mount('#app');
    </script>
  </body>
</html>
```

::: warning
CDN usage is not recommended for production. Use a bundler like Vite or Webpack for better performance and tree-shaking.
:::

## Verify Installation

Create a simple test component to verify everything is working:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { MarkdownRenderer } from '@markdown-next/vue';

const markdown = ref(`
# Installation Successful! ✅

- [x] @markdown-next/parser installed
- [x] @markdown-next/vue installed
- [x] Vue 3 ready

**You're all set!**
`);

const parserOptions = {
  extendedGrammar: ['gfm'],
};
</script>

<template>
  <MarkdownRenderer :markdown="markdown" :parserOptions="parserOptions" />
</template>
```

If you see the rendered markdown, you're ready to go!
