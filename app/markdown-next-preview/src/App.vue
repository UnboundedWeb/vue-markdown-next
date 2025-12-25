<script setup lang="ts">
import { nextTick, ref } from 'vue';
import { MarkdownRenderer, MarkdownWorkerPoll } from '@markdown-next/vue';

const markdown = ref(`# Markdown Next · Vue Preview

欢迎来到 \`packages/vue\` 的测试页面。这一页用来验证渲染器的稳定性与实时反馈。

## 为什么选择 markdown-next
- Vue 友好 支持自定义Vnode渲染节点，可拓展交互 / 样式
- 解析与渲染分离。支持组件式线程池管理
- 开箱即用，GitHub 风格主题直接可用
- 无CSS文依赖
- 默认支持数学公式渲染（worker内解析），支持Tex & Latex两种格式
- 默认支持gfm拓展markdown语法
- 默认安全：HTML 会先被解析，但最终只保留白名单允许的标签/属性，其它都会被过滤。
- 可自定义：通过 customTags 加入自定义标签名单，白名单内的标签会被正常渲染。

$ 10=y^2 $

## 示例代码
\`\`\`ts
import { MarkdownRenderer } from '@markdown-next/vue';
\`\`\`

> 左侧编辑，右侧立即渲染。试着修改标题或列表。
`);

const editorRef = ref<HTMLTextAreaElement | null>(null);

const wrapSelection = (before: string, after = before) => {
  const textarea = editorRef.value;
  if (!textarea) return;
  const { selectionStart, selectionEnd } = textarea;
  const value = markdown.value;
  const selected = value.slice(selectionStart, selectionEnd);
  markdown.value =
    value.slice(0, selectionStart) + before + selected + after + value.slice(selectionEnd);

  nextTick(() => {
    textarea.focus();
    textarea.setSelectionRange(selectionStart + before.length, selectionEnd + before.length);
  });
};

const prefixLine = (prefix: string) => {
  const textarea = editorRef.value;
  if (!textarea) return;
  const value = markdown.value;
  const { selectionStart } = textarea;
  const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
  markdown.value = value.slice(0, lineStart) + prefix + value.slice(lineStart);

  nextTick(() => {
    const cursor = selectionStart + prefix.length;
    textarea.focus();
    textarea.setSelectionRange(cursor, cursor);
  });
};
</script>

<template>
  <div class="page">
    <header class="hero">
      <div>
        <p class="eyebrow">packages/vue · playground</p>
        <h1>Markdown Next Preview</h1>
        <p class="subtitle">左侧编辑，右侧使用 @markdown-next/vue 渲染结果。</p>
      </div>
      <div class="badge">Test Suite</div>
    </header>

    <main class="workspace">
      <section class="pane editor-pane">
        <div class="pane-header">
          <div>
            <h2>Markdown 编辑器</h2>
            <p>轻量自定义编辑器，保持输入响应迅速。</p>
          </div>
          <div class="toolbar">
            <button type="button" @click="wrapSelection('**')">Bold</button>
            <button type="button" @click="wrapSelection('*')">Italic</button>
            <button type="button" @click="wrapSelection('`')">Code</button>
            <button type="button" @click="prefixLine('# ')">H1</button>
            <button type="button" @click="prefixLine('- ')">List</button>
          </div>
        </div>
        <textarea
          ref="editorRef"
          v-model="markdown"
          class="editor"
          spellcheck="false"
          placeholder="在这里输入 markdown..."
        />
      </section>

      <section class="pane preview-pane">
        <div class="pane-header">
          <div>
            <h2>实时渲染</h2>
            <p>由 @markdown-next/vue 渲染，带 GitHub 风格主题。</p>
          </div>
          <div class="status">Live</div>
        </div>
        <MarkdownWorkerPoll
          :parserOptions="{
            supportsLaTeX: true,
            extendedGrammar: ['gfm', 'mathjax'],
          }"
        >
          <MarkdownRenderer :dynamic="true" class="preview" :markdown="markdown" />
        </MarkdownWorkerPoll>
      </section>
    </main>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 28px;
  min-height: 100vh;
  padding: 36px clamp(20px, 6vw, 72px) 64px;
}

.hero {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 28px 32px;
  border-radius: 24px;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0.82), rgba(255, 243, 224, 0.9));
  box-shadow: 0 18px 50px rgba(20, 12, 4, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.eyebrow {
  margin: 0 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  font-size: 12px;
  font-weight: 700;
  color: #7c3f00;
}

h1 {
  margin: 0;
  font-size: clamp(28px, 4vw, 44px);
  color: #1c1208;
}

.subtitle {
  margin: 10px 0 0;
  max-width: 520px;
  color: #4a3120;
  font-size: 16px;
  line-height: 1.6;
}

.badge {
  align-self: flex-start;
  padding: 10px 16px;
  border-radius: 999px;
  background: #1b120a;
  color: #fff1dc;
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.workspace {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

.pane {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 24px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 16px 40px rgba(16, 12, 6, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.65);
  min-height: 520px;
}

.pane-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.pane-header h2 {
  margin: 0;
  font-size: 20px;
  color: #1f160e;
}

.pane-header p {
  margin: 6px 0 0;
  color: #6b4c35;
  font-size: 14px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.toolbar button {
  border: 1px solid rgba(28, 18, 8, 0.2);
  background: #fff8ec;
  color: #1c1208;
  border-radius: 10px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.toolbar button:hover {
  background: #fce6c8;
}

.editor {
  flex: 1;
  width: 100%;
  padding: 18px;
  border-radius: 16px;
  border: 1px solid rgba(28, 18, 8, 0.15);
  background: #fffdf8;
  font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, SFMono-Regular, Consolas, monospace;
  font-size: 14px;
  line-height: 1.7;
  color: #1f160e;
  resize: none;
  box-shadow: inset 0 1px 6px rgba(26, 20, 12, 0.08);
}

.editor:focus {
  outline: 2px solid rgba(199, 119, 42, 0.6);
}

.preview {
  flex: 1;
  padding: 12px 6px 0;
  overflow: auto;
  background: transparent;
}

.status {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  background: rgba(255, 170, 86, 0.2);
  color: #b05a00;
}

@media (max-width: 1024px) {
  .hero {
    flex-direction: column;
  }

  .workspace {
    grid-template-columns: 1fr;
  }

  .pane {
    min-height: 420px;
  }
}
</style>
