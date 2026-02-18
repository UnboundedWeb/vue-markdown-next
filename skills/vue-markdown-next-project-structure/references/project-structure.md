# vue-markdown-next 项目结构速览

## Workspace 总览

- 工作区配置：`pnpm-workspace.yaml`（包含 `packages/*` 与 `app/*`）
- 根目录脚本：`package.json`
  - `pnpm dev/build/typecheck/lint/test` 只覆盖 `packages/*`
  - `app/*` 需要单独执行对应命令

## packages/parser（核心解析器）

- 入口：`packages/parser/src/index.ts`
- 核心模块：
  - `packages/parser/src/modules/core.ts`：unified 管线拼装
  - `packages/parser/src/modules/parser.ts`：单线程解析器
  - `packages/parser/src/modules/parser.worker.ts`：Worker 服务实现
  - `packages/parser/src/modules/parser.workerPool.ts`：Worker 池与任务调度
- 插件与工具：
  - `packages/parser/src/plugin/*`
  - `packages/parser/src/utils/createSanitizeSchema.ts`
- 测试：`packages/parser/__tests__/*.test.ts`
- 构建：`packages/parser/tsup.config.ts`

## packages/vue（Vue 渲染层）

- 入口：`packages/vue/src/index.ts`
- 关键实现：
  - `packages/vue/src/components/MarkdownRenderer.tsx`
  - `packages/vue/src/components/MarkdownWorkerPoll.tsx`
  - `packages/vue/src/hooks/useMarkdownParser.ts`
  - `packages/vue/src/hooks/useMarkdownWorkerPool.ts`
  - `packages/vue/src/render/hastToVue.ts`
- e2e：
  - `packages/vue/__tests__/e2e/worker-pool.vite7.e2e.test.ts`
  - `packages/vue/vitest.e2e.config.ts`

## app/markdown-next-preview（示例与浏览器回归）

- 入口：`app/markdown-next-preview/src/main.ts`
- 页面：`app/markdown-next-preview/src/App.vue`
- 组件：
  - `app/markdown-next-preview/src/components/LivePreviewPane.vue`
  - `app/markdown-next-preview/src/components/CustomPreviewPane.vue`
  - `app/markdown-next-preview/src/components/EditorPane.vue`
- e2e harness：
  - `app/markdown-next-preview/e2e-ready.html`
  - `app/markdown-next-preview/src/e2e-ready.ts`
- 配置：`app/markdown-next-preview/vite.config.ts`（Vite 7 / rolldown-vite）

## app/markdown-next-docs（文档站）

- 主目录：`app/markdown-next-docs/docs`
- 站点配置：`app/markdown-next-docs/docs/.vitepress/config.ts`
- 文档版本：
  - `app/markdown-next-docs/docs/v1/en/*`
  - `app/markdown-next-docs/docs/v1/zh/*`
- Worker/Vite 指南：
  - `app/markdown-next-docs/docs/v1/en/guide/bundler-config.md`
  - `app/markdown-next-docs/docs/v1/zh/guide/bundler-config.md`

## 根级配置与流程文件

- 代码规范：
  - `eslint.config.mjs`
  - `commitlint.config.mjs`
  - `.prettierrc.json`
- TypeScript：
  - `tsconfig.base.json`
  - `packages/*/tsconfig*.json`
- 贡献流程：
  - `CONTRIBUTING.md`
  - `readme/CONTRIBUTING.zh-CN.md`

## 常用路径自检命令

1. `rg --files packages app readme skills`
2. `rg -n "MarkdownWorkerPoll|ParserWorkerPool|worker|vite" packages app -S`
