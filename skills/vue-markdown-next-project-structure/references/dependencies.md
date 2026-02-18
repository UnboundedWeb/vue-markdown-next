# vue-markdown-next 依赖落点与选型规则

## package.json 落点

- 根工程：`package.json`
  - workspace 级工具链：ESLint、Prettier、TypeScript、Commitlint、Husky
- 解析器包：`packages/parser/package.json`
  - unified/remark/rehype 解析栈
  - Worker 通信与构建（`comlink`、`tsup`）
- Vue 包：`packages/vue/package.json`
  - 渲染层实现（`hast-util-to-jsx-runtime`）
  - Vue 包自己的 e2e 测试依赖（`playwright`）
- 预览应用：`app/markdown-next-preview/package.json`
  - 示例站运行依赖（`vue`、`highlight.js`、`vue-i18n`）
  - Vite 7（`rolldown-vite@7.2.5`）
- 文档应用：`app/markdown-next-docs/package.json`
  - VitePress 站点依赖

## 关键依赖分层

- `packages/parser`：
  - 解析与插件：`unified`、`remark-*`、`rehype-*`
  - Worker：`comlink`
- `packages/vue`：
  - 渲染转换：`hast-util-to-jsx-runtime`
  - 对 parser 的 workspace 依赖：`@markdown-next/parser`
- `app/markdown-next-preview`：
  - 演示 UI 与配置验证（尤其 Worker + Vite 兼容）
- `app/markdown-next-docs`：
  - API 说明与使用文档，不承担库运行时逻辑

## 新增依赖决策规则

1. 仅 `parser` 运行时使用：加到 `packages/parser/package.json`。
2. 仅 `vue` 运行时使用：加到 `packages/vue/package.json`。
3. 仅预览或文档使用：加到对应 `app/*/package.json`。
4. workspace 工具（lint/test/build 流程）才加到根 `package.json`。
5. 先复用现有库与封装，避免引入同类重复依赖。

## Worker 与 Vite 兼容注意事项

- `app/markdown-next-preview` 使用 Vite 7（rolldown-vite）做浏览器验证。
- `packages/vue` 的 `test:e2e` 会拉起 preview 应用做真实浏览器回归。
- 命中以下改动时，必须执行 `pnpm --filter @markdown-next/vue test:e2e`：
  - `packages/parser/src/modules/parser.workerPool.ts`
  - `packages/vue/src/components/MarkdownWorkerPoll.tsx`
  - 任何 Worker 路径解析或 bundler 条件解析逻辑
