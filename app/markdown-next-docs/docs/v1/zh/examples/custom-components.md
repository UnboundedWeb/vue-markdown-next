# 自定义组件

了解如何使用自定义 Vue 组件来自定义 markdown 元素的渲染。

> 完整示例请参考[英文版本](/v1/en/examples/custom-components)

## 基础组件覆盖

使用自定义组件覆盖默认的 HTML 元素：

```vue
<script setup lang="ts">
import { ref, h } from 'vue';
import { MarkdownRenderer } from '@markdown-next/vue';
import type { MarkdownComponents } from '@markdown-next/vue';

const markdown = ref(`
# 自定义组件

这个标题使用了自定义组件！

> 这个引用块也被自定义了。
`);

const components: MarkdownComponents = {
  h1: (props, { slots }) =>
    h(
      'h1',
      {
        class: 'custom-heading',
        style: {
          color: '#e67e22',
          borderBottom: '3px solid #f39c12',
          paddingBottom: '0.5rem',
        },
      },
      slots.default?.()
    ),
  blockquote: (props, { slots }) =>
    h(
      'div',
      {
        class: 'custom-quote',
        style: {
          borderLeft: '4px solid #3498db',
          paddingLeft: '1rem',
          fontStyle: 'italic',
          background: '#ecf0f1',
          padding: '1rem',
        },
      },
      slots.default?.()
    ),
};
</script>

<template>
  <MarkdownRenderer :markdown="markdown" :components="components" />
</template>
```

## 自定义链接组件

让所有链接在新标签页中打开：

```vue
<script setup lang="ts">
import { ref, h } from 'vue';
import { MarkdownRenderer } from '@markdown-next/vue';
import type { MarkdownComponents } from '@markdown-next/vue';

const markdown = ref(`
查看 [Vue.js](https://cn.vuejs.org) 和 [Vite](https://cn.vitejs.dev)！
`);

const components: MarkdownComponents = {
  a: (props, { slots }) =>
    h(
      'a',
      {
        ...props,
        target: '_blank',
        rel: 'noopener noreferrer',
        style: {
          color: '#e67e22',
          textDecoration: 'underline',
          fontWeight: 'bold',
        },
      },
      slots.default?.()
    ),
};
</script>

<template>
  <MarkdownRenderer :markdown="markdown" :components="components" />
</template>
```

## 带语法高亮的自定义代码渲染器

使用 highlight.js 添加语法高亮：

```vue
<script setup lang="ts">
import { ref, h } from 'vue';
import { MarkdownRenderer } from '@markdown-next/vue';
import type { MarkdownComponent } from '@markdown-next/vue';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

const markdown = ref(`
\`\`\`javascript
function greet(name) {
  console.log(\`你好，\${name}！\`);
}

greet('世界');
\`\`\`
`);

const codeRenderer: MarkdownComponent = (props) => {
  const codeNode = props.children?.[0]?.children?.[0];
  const code = codeNode?.value || '';

  const className = props.children?.[0]?.properties?.className;
  const lang = Array.isArray(className) ? className[0]?.replace('language-', '') : 'plaintext';

  const highlighted =
    lang && hljs.getLanguage(lang)
      ? hljs.highlight(code, { language: lang }).value
      : hljs.highlightAuto(code).value;

  return h('pre', { class: 'code-block' }, [
    h('div', { class: 'code-header' }, [h('span', { class: 'language-badge' }, lang)]),
    h('code', {
      class: `language-${lang} hljs`,
      innerHTML: highlighted,
    }),
  ]);
};
</script>

<template>
  <MarkdownRenderer :markdown="markdown" :codeRenderer="codeRenderer" />
</template>

<style scoped>
.code-block {
  position: relative;
  margin: 1rem 0;
  border-radius: 8px;
  overflow: hidden;
  background: #1e1e1e;
}

.code-header {
  background: #2d2d2d;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #404040;
}

.language-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: #e67e22;
  color: white;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
}

.code-block code {
  display: block;
  padding: 1rem;
  overflow-x: auto;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
}
</style>
```

更多示例请参考[英文版本](/v1/en/examples/custom-components)。
