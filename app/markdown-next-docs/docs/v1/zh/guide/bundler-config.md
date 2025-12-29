# 打包器配置

当 `vue-markdown-next` 与 Vite 等打包器一起使用时，你可能需要进行特定的配置，尤其是在使用 Web Worker 进行解析时。

## Vite

在使用 Web Worker 运行 `vue-markdown-next` 时，一个常见的问题是出现 `document is not defined` 的错误。

### 问题原因

此错误通常是由于某个依赖项试图在 Worker 中使用仅浏览器环境才有的 API（例如 `document`），而这些 API 在 Worker 中是不可用的。

`remark` 和 `rehype` 生态系统中的许多包都是“同构的”，这意味着它们可以在 Node.js 和浏览器中运行。为了实现这一点，它们的 `package.json` 文件中可能有一个 `browser` 字段，指向为浏览器编写的代码版本。此浏览器版本可能会使用 `document` 进行性能优化（例如 `parse-entities`）。

然而，Web Worker 无法访问 `document` 对象。

在 Vite 中，一个可能触发此问题的配置是设置 `resolve.conditions`:

```js
// vite.config.js
export default {
  // ...
  resolve: {
    conditions: ['worker'],
  },
};
```

这会告诉 Vite 在解析包时优先使用 `worker` 导出条件。某些包（如 `decode-named-character-reference`）提供了特定于 worker 的导出。但是，对于没有 `worker` 导出但有 `browser` 导出的包，Vite 可能会回退到使用 `browser` 版本，从而导致错误。

### 解决方案

为了防止这种情况，你需要配置 Vite 的解析器以避免为你的 worker 使用 `browser` 构建。对于 `resolve.conditions` 来说，一个更好的方法是使用默认条件但删除 `browser`。

```js
// vite.config.js
export default {
  // ...
  resolve: {
    // 你可能需要为你的 worker 构建有条件地应用此配置
    conditions: ['import', 'module', 'default'],
  },
};
```

通过删除 `browser` 条件，你可以指示 Vite 选择一个不依赖于浏览器特定 API 的更通用的依赖项版本，该版本通常与 Web Worker 兼容。

_这是一个简化的示例。根据你的项目结构，你可能需要更高级的配置，以便仅将这些解析器条件应用于 Worker 打包。_
