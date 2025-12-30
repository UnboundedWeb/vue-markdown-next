# Vue Markdown Next

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg)](https://pnpm.io/)

> 下一代高性能 Markdown 解析器和 Vue 渲染器，支持 Worker 多线程处理。

[English](../README.md) | [在线文档](https://docs.markdown.team/)

## 特性

- **高性能**：基于 unified/remark/rehype 生态系统，优化的渲染性能
- **Worker 支持**：多线程解析，使用 Web Workers 和 Worker Pool 实现非阻塞 UI
- **丰富语法**：支持 GitHub Flavored Markdown (GFM)、数学公式 (MathJax)、语法高亮
- **Vue 3 集成**：从 Markdown AST 无缝渲染 Vue 组件
- **可扩展**：Hook 系统支持自定义 Markdown 节点处理
- **类型安全**：完整的 TypeScript 支持

## 包结构

此 monorepo 包含：

- **[@markdown-next/parser](../packages/parser)**：核心 Markdown 解析器，支持 Worker
- **[@markdown-next/vue](../packages/vue)**：Vue 3 渲染器

## 安装

```bash
npm install @markdown-next/parser @markdown-next/vue
# 或
pnpm add @markdown-next/parser @markdown-next/vue
# 或
yarn add @markdown-next/parser @markdown-next/vue
```

## 基础用法

```vue
<script setup>
import { MarkdownRenderer } from '@markdown-next/vue';

const markdown = '# 你好世界\n\n这是 **markdown**！';
</script>

<template>
  <MarkdownRenderer :markdown="markdown" />
</template>
```

## 技术栈

- **解析器**：unified、remark、rehype
- **Worker**：Comlink 实现无缝 Worker 通信
- **插件**：remark-math、rehype-mathjax、remark-gfm
- **构建工具**：tsup、vite
- **测试工具**：vitest
- **文档工具**：VitePress

## 文档

详细的文档、示例和 API 参考，请访问：

- [在线文档](https://unboundedweb.github.io/vue-markdown-next/)
- [English Documentation](../README.md)

## 环境要求

- Node.js >= 16.0.0
- pnpm >= 8.0.0

## 许可证

[MIT](../LICENSE)

## 贡献

欢迎贡献！请遵循以下指南：

1. **Fork** 本仓库
2. 从 `main` 分支**创建**你的特性分支
3. **进行**更改：
   - 仅文档更改：提交 PR 到 `docs` 分支
   - 代码更改（包含或不包含文档）：提交 PR 到 `main` 分支
4. 使用清晰的提交信息**提交**你的更改
5. **推送**到你的 Fork
6. **开启** Pull Request

详细的贡献指南，请阅读 [CONTRIBUTING.md](../CONTRIBUTING.md)。

## 链接

- [GitHub 仓库](https://github.com/UnboundedWeb/vue-markdown-next)
- [问题反馈](https://github.com/UnboundedWeb/vue-markdown-next/issues)
