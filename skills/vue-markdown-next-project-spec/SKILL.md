---
name: vue-markdown-next-project-spec
description: 'vue-markdown-next 的工程改造与质量规范。用于跨 `packages/parser`、`packages/vue`、`app/markdown-next-preview`、`app/markdown-next-docs` 进行功能开发、Bug 修复、API 调整、Worker 兼容处理和回归测试时，确保改动符合项目约束与发布标准。'
---

# vue-markdown-next 项目规范技能

## 快速开始

- 先读取 `references/global-prompt.md`，按该规范执行当前任务。
- 涉及路径定位、命令选择、依赖落点时，读取 `vue-markdown-next-project-structure` 的参考文档。
- 明确改动属于“文档-only”还是“代码改动”，按分支策略提交 PR。

## 执行步骤

1. 确认改动边界（parser / vue / preview / docs）。
2. 先改最小必要实现，避免跨层重写。
3. 变更公共 API 时，同步更新类型导出和文档。
4. 命中 Worker 逻辑时，补齐浏览器 e2e 回归。
5. 按范围执行质量门禁并记录结果。

## 兼容性要求（必须遵守）

- 保持公共导出稳定：优先增量兼容，避免直接破坏现有 API。
- 修改 `packages/parser/src/modules/parser.workerPool.ts` 时，同步检查：
  - `packages/parser/src/index.ts`
  - `packages/parser/src/index.d.ts`
  - `packages/parser/src/modules/parser.workerPool.d.ts`
- 修改 `MarkdownWorkerPoll` 或 worker 事件契约时，确保 `@ready` 监听、池方法暴露与文档示例一致。
- 修改 API 行为时同步更新中英文文档：
  - `app/markdown-next-docs/docs/v1/en/*`
  - `app/markdown-next-docs/docs/v1/zh/*`

## 质量门禁

- `parser` 改动：
  - `pnpm --filter @markdown-next/parser lint`
  - `pnpm --filter @markdown-next/parser typecheck`
  - `pnpm --filter @markdown-next/parser test`
- `vue` 改动：
  - `pnpm --filter @markdown-next/vue lint`
  - `pnpm --filter @markdown-next/vue typecheck`
  - `pnpm --filter @markdown-next/vue test`
- 命中 Worker/浏览器运行时行为：
  - `pnpm --filter @markdown-next/vue test:e2e`
- 跨 `parser` + `vue` 改动：
  - `pnpm lint`
  - `pnpm typecheck`
  - `pnpm test`
  - `pnpm build`

## 测试验收要求

- 新增能力或修复缺陷时，优先补与改动同层的测试。
- Worker 与 bundler 相关改动必须包含至少一条浏览器侧回归路径（Vitest + Playwright）。
- 不得只以 typecheck 代替运行时验证。

## 分支与提交策略

- 文档-only：提交到 `docs` 分支。
- 代码改动（含文档更新）：提交到 `main` 分支。
- 提交信息使用 Conventional Commits（如 `fix(parser): ...`、`test(vue): ...`）。

## 需要时加载的参考

- `references/global-prompt.md`：统一设计准则、复杂度控制与 Worker 兼容约束。
