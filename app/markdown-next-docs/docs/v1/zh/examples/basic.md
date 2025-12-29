# 基础用法

本示例演示了 MarkdownRenderer 组件的基本用法。

> 完整示例请参考[英文版本](/v1/en/examples/basic)

## 简单渲染

最基本的用法：

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { MarkdownRenderer } from '@markdown-next/vue';

const markdown = ref(`
# 欢迎使用 Markdown Next

这是一个简单的示例，包含：

- **粗体文本**
- *斜体文本*
- [链接](https://github.com)
- \`行内代码\`

\`\`\`javascript
const hello = 'world';
console.log(hello);
\`\`\`
`);
</script>

<template>
  <MarkdownRenderer :markdown="markdown" />
</template>
```

## 配置解析器选项

启用 GFM 等扩展功能：

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { MarkdownRenderer } from '@markdown-next/vue';
import type { ParserOptions } from '@markdown-next/parser';

const markdown = ref(`
# 任务列表

- [x] 已完成任务
- [ ] 待处理任务

## 表格

| 姓名 | 年龄 |
|------|------|
| 张三 | 25   |
| 李四 | 30   |

~~删除线~~
`);

const parserOptions: ParserOptions = {
  extendedGrammar: ['gfm'],
};
</script>

<template>
  <MarkdownRenderer :markdown="markdown" :parserOptions="parserOptions" />
</template>
```

## 数学支持

启用 LaTeX 数学渲染：

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { MarkdownRenderer } from '@markdown-next/vue';
import type { ParserOptions } from '@markdown-next/parser';

const markdown = ref(`
# 数学公式

行内方程：$E = mc^2$

块级方程：

$$
\\frac{d}{dx}\\left( \\int_{0}^{x} f(u)\\,du\\right)=f(x)
$$
`);

const parserOptions: ParserOptions = {
  supportsLaTeX: true,
  extendedGrammar: ['mathjax'],
};
</script>

<template>
  <MarkdownRenderer :markdown="markdown" :parserOptions="parserOptions" />
</template>
```

## 动态编辑器

创建实时 markdown 编辑器：

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { MarkdownRenderer } from '@markdown-next/vue';

const markdown = ref('# 开始输入...\n\n你的 markdown 会实时渲染。');

function updateMarkdown(event: Event) {
  markdown.value = (event.target as HTMLTextAreaElement).value;
}
</script>

<template>
  <div class="editor-container">
    <div class="editor-pane">
      <h3>编辑器</h3>
      <textarea
        :value="markdown"
        @input="updateMarkdown"
        class="editor"
        placeholder="在此输入 markdown..."
      />
    </div>
    <div class="preview-pane">
      <h3>预览</h3>
      <MarkdownRenderer :markdown="markdown" :dynamic="true" :debounceMs="300" class="preview" />
    </div>
  </div>
</template>

<style scoped>
.editor-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  height: 600px;
}

.editor-pane,
.preview-pane {
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  overflow: hidden;
}

.editor {
  flex: 1;
  width: 100%;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  resize: none;
}

.preview {
  flex: 1;
  overflow: auto;
  padding: 1rem;
  background: #fafafa;
  border-radius: 4px;
}
</style>
```

更多示例请参考：

- [自定义组件](/v1/zh/examples/custom-components)
- [Worker 池](/v1/zh/examples/worker-pool)
