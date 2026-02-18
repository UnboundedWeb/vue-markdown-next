---
name: vue-markdown-next-project-structure
description: 'vue-markdown-next monorepo 的项目结构与模块地图。用于定位 `packages/parser`、`packages/vue`、`app/markdown-next-preview`、`app/markdown-next-docs` 的代码入口，选择正确的测试/构建命令，判断依赖应修改哪个 `package.json`，或排查 Worker + Vite 兼容问题时。'
---

# Vue Markdown Next 项目结构技能

## 快速开始

- 先读取 `references/project-structure.md` 获取目录边界、入口文件和命令映射。
- 需要增删依赖时读取 `references/dependencies.md`，先复用现有依赖与封装。
- 路径不确定时先执行 `rg --files packages app readme skills`，确认真实路径后再改代码。
- 命中 Worker 报错（如 `/.vite/deps/`、`document is not defined`）时，优先检查：
  - `packages/parser/src/modules/parser.workerPool.ts`
  - `app/markdown-next-preview/vite.config.ts`
  - `app/markdown-next-docs/docs/v1/*/guide/bundler-config.md`

## 导航原则

- 先判断改动边界：
  - `packages/parser`：Markdown 解析、插件管线、Worker 池
  - `packages/vue`：Vue 组件渲染层、hooks、TSX 组件 API
  - `app/markdown-next-preview`：Vite 7 预览与真实浏览器回归场景
  - `app/markdown-next-docs`：VitePress 文档与 API 说明
- 先找入口再深入实现，避免在错误工程里修改同名文件。
- 依赖变更遵循“最小作用域”：
  - 库依赖放在对应 `packages/*/package.json`
  - 预览/文档依赖放在 `app/*/package.json`
  - 根目录只放 workspace 级开发工具。

## 执行步骤

1. 识别需求落在 `parser`、`vue`、`preview`、`docs` 中的哪一层。
2. 从入口文件沿调用链定位到改动点，不跨层盲改。
3. 修改后按命中范围选择命令，而不是只跑根目录脚本。
4. 涉及 Worker 或公共 API 的改动，额外执行浏览器 e2e 回归。
5. 需要时同步更新文档（中英文）与引用路径。

## 命令选择

- 仅改 `packages/parser`：
  - `pnpm --filter @markdown-next/parser lint`
  - `pnpm --filter @markdown-next/parser typecheck`
  - `pnpm --filter @markdown-next/parser test`
- 仅改 `packages/vue`：
  - `pnpm --filter @markdown-next/vue lint`
  - `pnpm --filter @markdown-next/vue typecheck`
  - `pnpm --filter @markdown-next/vue test`
- 命中 Worker 浏览器行为或 `MarkdownWorkerPoll`/`ParserWorkerPool`：
  - `pnpm --filter @markdown-next/vue test:e2e`
- 改动 `app/markdown-next-preview`：
  - `pnpm --filter markdown-next-preview dev`
  - `pnpm --filter markdown-next-preview build`
- 改动 `app/markdown-next-docs`：
  - `pnpm --filter markdown-next-docs dev`
  - `pnpm --filter markdown-next-docs build`
- 跨 `parser` + `vue` 的改动：
  - `pnpm lint`
  - `pnpm typecheck`
  - `pnpm test`
  - `pnpm build`

## 需要时加载的参考

- `references/project-structure.md`：目录边界、入口文件、跨包调用与命令地图。
- `references/dependencies.md`：依赖落点与新增依赖的决策规则。
