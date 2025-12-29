# 安装

## 包管理器

使用你喜欢的包管理器安装两个包：

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

## 对等依赖

确保已安装 Vue 3：

```bash
npm install vue@^3.2.0
```

## TypeScript 支持

两个包都包含 TypeScript 定义文件，无需额外安装 `@types` 包。

为了启用正确的类型检查，确保你的 `tsconfig.json` 包含：

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "types": ["vue"]
  }
}
```

## 可选依赖

### 语法高亮

如果你想为代码块添加语法高亮，安装 `highlight.js`：

```bash
npm install highlight.js
```

然后配置自定义代码渲染器（参见 [自定义组件](/v1/zh/examples/custom-components)）。

### LaTeX 支持

LaTeX 渲染通过 `rehype-mathjax` 内置支持，已作为依赖项包含。只需在解析器选项中启用：

```ts
const parserOptions = {
  supportsLaTeX: true,
  extendedGrammar: ['mathjax'],
};
```

## 验证安装

创建一个简单的测试组件来验证一切正常：

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { MarkdownRenderer } from '@markdown-next/vue';

const markdown = ref(`
# 安装成功！✅

- [x] @markdown-next/parser 已安装
- [x] @markdown-next/vue 已安装
- [x] Vue 3 就绪

**一切准备就绪！**
`);

const parserOptions = {
  extendedGrammar: ['gfm'],
};
</script>

<template>
  <MarkdownRenderer :markdown="markdown" :parserOptions="parserOptions" />
</template>
```

如果你看到渲染后的 markdown，那就可以开始了！
