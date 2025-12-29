# Worker 池

了解如何使用 MarkdownWorkerPoll 组件来提升多个 markdown 文档或频繁更新的性能。

## 为什么使用 Worker 池？

Worker 池提供了几个好处：

- **非阻塞解析**：Markdown 解析在 Web Workers 中运行，保持主线程响应
- **并行处理**：多个 worker 可以同时解析不同的文档
- **更好的性能**：适用于频繁更新 markdown 或多文档的应用

## 基础 Worker 池用法

使用 `MarkdownWorkerPoll` 包装多个 `MarkdownRenderer` 组件：

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { MarkdownRenderer, MarkdownWorkerPoll } from '@markdown-next/vue';
import type { ParserOptions } from '@markdown-next/parser';

const doc1 = ref('# 文档 1\n\n第一个文档内容');
const doc2 = ref('# 文档 2\n\n第二个文档内容');
const doc3 = ref('# 文档 3\n\n第三个文档内容');

const parserOptions: ParserOptions = {
  extendedGrammar: ['gfm', 'mathjax'],
  supportsLaTeX: true,
};
</script>

<template>
  <MarkdownWorkerPoll :worker-count="2" :parserOptions="parserOptions">
    <div class="documents">
      <div class="document">
        <h2>文档 1</h2>
        <MarkdownRenderer :markdown="doc1" :dynamic="true" />
      </div>

      <div class="document">
        <h2>文档 2</h2>
        <MarkdownRenderer :markdown="doc2" :dynamic="true" />
      </div>

      <div class="document">
        <h2>文档 3</h2>
        <MarkdownRenderer :markdown="doc3" :dynamic="true" />
      </div>
    </div>
  </MarkdownWorkerPoll>
</template>

<style scoped>
.documents {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.document {
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
}
</style>
```

## 使用 Worker 池的实时编辑器

创建不会阻塞 UI 的 markdown 编辑器：

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { MarkdownRenderer, MarkdownWorkerPoll } from '@markdown-next/vue';

const markdown = ref(`
# 实时编辑器示例

这个编辑器使用 worker 池，因此解析在后台进行，不会阻塞 UI。

尝试输入一些复杂的内容：

\`\`\`javascript
// 输入大量代码
for (let i = 0; i < 1000; i++) {
  console.log(i);
}
\`\`\`

$$
\\sum_{i=1}^{100} i^2 = \\frac{100 \\cdot 101 \\cdot 201}{6}
$$
`);

const parserOptions = {
  supportsLaTeX: true,
  extendedGrammar: ['gfm', 'mathjax'],
};
</script>

<template>
  <div class="editor-layout">
    <MarkdownWorkerPoll :worker-count="1" :parserOptions="parserOptions">
      <div class="editor-panel">
        <h3>编辑器（在此输入）</h3>
        <textarea v-model="markdown" class="editor" placeholder="开始输入 markdown..." />
      </div>

      <div class="preview-panel">
        <h3>实时预览（非阻塞）</h3>
        <MarkdownRenderer :markdown="markdown" :dynamic="true" :debounceMs="200" class="preview" />
      </div>
    </MarkdownWorkerPoll>
  </div>
</template>

<style scoped>
.editor-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  height: 700px;
  padding: 1rem;
}

.editor-panel,
.preview-panel {
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 1.5rem;
  background: white;
  overflow: hidden;
}

.editor {
  flex: 1;
  width: 100%;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  resize: none;
}

.preview {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: #fafafa;
  border-radius: 8px;
}
</style>
```

## 最佳实践

### Worker 数量

根据你的用例选择合适的 worker 数量：

```ts
// 单文档，频繁更新
const workerCount = 1;

// 多文档，适度更新
const workerCount = 2;

// 多文档或重量级解析
const workerCount = navigator.hardwareConcurrency || 4;
```

### 内存管理

在组件卸载时始终清理 worker 池：

```ts
import { onUnmounted } from 'vue';
import { MarkdownWorkerPool } from '@markdown-next/parser';

const pool = new MarkdownWorkerPool({ workerCount: 2 });

onUnmounted(() => {
  pool.terminate(); // 重要！
});
```

更多示例请参考[英文版本](/v1/en/examples/worker-pool)。
