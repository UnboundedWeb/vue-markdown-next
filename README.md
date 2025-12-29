# Vue Markdown Next

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg)](https://pnpm.io/)

> Next-generation markdown parser and Vue renderer with high-performance Worker support.

[中文文档](./readme/README.zh-CN.md) | [Documentation](https://unboundedweb.github.io/vue-markdown-next/)

## Features

- **High Performance**: Built on unified/remark/rehype ecosystem with optimized rendering
- **Worker Support**: Multi-threaded parsing with Web Workers and Worker Pool for non-blocking UI
- **Rich Syntax**: GitHub Flavored Markdown (GFM), math formulas (MathJax), and syntax highlighting
- **Vue 3 Integration**: Seamless Vue components rendering from markdown AST
- **Extensible**: Hook system for custom markdown node processing
- **Type Safe**: Full TypeScript support

## Packages

This monorepo contains:

- **[@markdown-next/parser](./packages/parser)**: Core markdown parser with Worker support
- **[@markdown-next/vue](./packages/vue)**: Vue 3 renderer for parsed markdown

## Quick Start

```bash
# Install dependencies
pnpm install

# Build packages
pnpm build

# Run tests
pnpm test

# Development mode
pnpm dev
```

## Installation

```bash
npm install @markdown-next/parser @markdown-next/vue
# or
pnpm add @markdown-next/parser @markdown-next/vue
# or
yarn add @markdown-next/parser @markdown-next/vue
```

## Basic Usage

```vue
<script setup>
import { MarkdownRenderer } from '@markdown-next/vue';

const markdown = '# Hello World\n\nThis is **markdown**!';
</script>

<template>
  <MarkdownRenderer :content="markdown" />
</template>
```

## Tech Stack

- **Parser**: unified, remark, rehype
- **Worker**: Comlink for seamless Worker communication
- **Plugins**: remark-math, rehype-mathjax, remark-gfm
- **Build**: tsup, vite
- **Test**: vitest
- **Docs**: VitePress

## Documentation

For detailed documentation, examples, and API reference, visit:

- [English Documentation](https://unboundedweb.github.io/vue-markdown-next/)
- [中文文档](./readme/README.zh-CN.md)

## Requirements

- Node.js >= 16.0.0
- pnpm >= 8.0.0

## License

[MIT](./LICENSE)

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork** the repository
2. **Create** your feature branch from `main`
3. **Make** your changes:
   - For documentation-only changes: Submit PR to `docs` branch
   - For code changes (with or without docs): Submit PR to `main` branch
4. **Commit** your changes with clear commit messages
5. **Push** to your fork
6. **Open** a Pull Request

For detailed contribution guidelines, please read [CONTRIBUTING.md](./CONTRIBUTING.md).

## Links

- [GitHub Repository](https://github.com/UnboundedWeb/vue-markdown-next)
- [Issues](https://github.com/UnboundedWeb/vue-markdown-next/issues)
