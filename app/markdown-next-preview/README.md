# markdown-next-preview

Preview app for `@markdown-next/vue`, including static rendering and streamdown streaming demos.

## EN

### Pages

- `#playground`: parser options playground and side-by-side renderer preview
- `#stream`: OpenAI streaming demo (`/v1/chat/completions`) with live markdown rendering

### Run locally

```bash
pnpm install
pnpm --filter markdown-next-preview dev
```

Open: `http://localhost:5173/#stream`

### Stream demo behavior

- Default model: `gpt-5-nano-2025-08-07`
- Renderer mode: `mode="streaming"` with `streamdown.parseIncompleteMarkdown = true`
- API key is stored in browser `localStorage` under `markdown-next-preview.openai.apiKey`
- If OpenAI returns `temperature` unsupported for the selected model, the request is retried automatically without `temperature`

### Security note

This app runs in the browser. Do not commit API keys into source code, screenshots, or docs.

## 中文

### 页面

- `#playground`：解析参数实验场 + 渲染预览
- `#stream`：OpenAI 流式请求演示（`/v1/chat/completions`）+ 实时 markdown 渲染

### 本地运行

```bash
pnpm install
pnpm --filter markdown-next-preview dev
```

打开：`http://localhost:5173/#stream`

### 流式演示行为

- 默认模型：`gpt-5-nano-2025-08-07`
- 渲染模式：`mode="streaming"`，并开启 `streamdown.parseIncompleteMarkdown = true`
- API Key 会记忆在浏览器 `localStorage`，键名为 `markdown-next-preview.openai.apiKey`
- 当所选模型不支持 `temperature` 参数时，会自动重试一次（不带 `temperature`）

### 安全提示

该页面在浏览器端运行，请勿将 API Key 提交到代码、截图或文档中。
