# 数学公式渲染

本示例展示如何使用 MarkdownRenderer 渲染各种类型的数学公式，包括行内公式、块级公式以及复杂的数学表达式。

## 基础用法

### 行内公式和块级公式

最基本的数学公式渲染：

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { MarkdownRenderer } from '@markdown-next/vue';
import type { ParserOptions } from '@markdown-next/parser';

const markdown = ref(`
## 数学常数

在数学中，有许多重要的常数。例如：

- 圆周率 $\\pi \\approx 3.14159$
- 自然对数的底 $e \\approx 2.71828$
- 黄金比例 $\\varphi = \\frac{1+\\sqrt{5}}{2}$

### 著名公式

欧拉公式被认为是最美的数学公式之一：

$$
e^{i\\pi} + 1 = 0
$$

这个公式将五个最重要的数学常数联系在一起。
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

## 复杂数学表达式

### 矩阵

展示各种矩阵表示：

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { MarkdownRenderer } from '@markdown-next/vue';
import type { ParserOptions } from '@markdown-next/parser';

const markdown = ref(`
# 线性代数中的矩阵

## 基本矩阵

一个 $2 \\times 2$ 矩阵：

$$
A = \\begin{pmatrix}
a & b \\\\
c & d
\\end{pmatrix}
$$

## 单位矩阵

$3 \\times 3$ 单位矩阵 $I_3$：

$$
I_3 = \\begin{pmatrix}
1 & 0 & 0 \\\\
0 & 1 & 0 \\\\
0 & 0 & 1
\\end{pmatrix}
$$

## 行列式

矩阵 $A$ 的行列式：

$$
\\det(A) = \\begin{vmatrix}
a & b \\\\
c & d
\\end{vmatrix} = ad - bc
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

### 多行对齐公式

使用 `aligned` 环境展示推导过程：

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { MarkdownRenderer } from '@markdown-next/vue';
import type { ParserOptions } from '@markdown-next/parser';

const markdown = ref(`
# 二次方程推导

将二次方程 $ax^2 + bx + c = 0$ 配方：

$$
\\begin{aligned}
ax^2 + bx + c &= 0 \\\\
x^2 + \\frac{b}{a}x + \\frac{c}{a} &= 0 \\\\
x^2 + \\frac{b}{a}x &= -\\frac{c}{a} \\\\
x^2 + \\frac{b}{a}x + \\frac{b^2}{4a^2} &= \\frac{b^2}{4a^2} - \\frac{c}{a} \\\\
\\left(x + \\frac{b}{2a}\\right)^2 &= \\frac{b^2 - 4ac}{4a^2} \\\\
x + \\frac{b}{2a} &= \\pm\\frac{\\sqrt{b^2-4ac}}{2a} \\\\
x &= \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}
\\end{aligned}
$$

这就是著名的**求根公式**。
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

### 分段函数

定义分段函数：

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { MarkdownRenderer } from '@markdown-next/vue';
import type { ParserOptions } from '@markdown-next/parser';

const markdown = ref(`
# 分段函数

## 绝对值函数

绝对值函数可以定义为：

$$
|x| = \\begin{cases}
x & \\text{如果 } x \\geq 0 \\\\
-x & \\text{如果 } x < 0
\\end{cases}
$$

## 符号函数

符号函数 $\\text{sgn}(x)$ 的定义：

$$
\\text{sgn}(x) = \\begin{cases}
1 & \\text{如果 } x > 0 \\\\
0 & \\text{如果 } x = 0 \\\\
-1 & \\text{如果 } x < 0
\\end{cases}
$$

## 单位阶跃函数

Heaviside 阶跃函数：

$$
H(x) = \\begin{cases}
0 & \\text{如果 } x < 0 \\\\
\\frac{1}{2} & \\text{如果 } x = 0 \\\\
1 & \\text{如果 } x > 0
\\end{cases}
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

### 积分与求和

展示积分和求和符号：

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { MarkdownRenderer } from '@markdown-next/vue';
import type { ParserOptions } from '@markdown-next/parser';

const markdown = ref(`
# 微积分与级数

## 定积分

高斯积分是概率论的基础：

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

## 多重积分

计算球体体积：

$$
V = \\int_{0}^{2\\pi} \\int_{0}^{\\pi} \\int_{0}^{r} \\rho^2 \\sin\\phi \\, d\\rho \\, d\\phi \\, d\\theta = \\frac{4}{3}\\pi r^3
$$

## 无穷级数

几何级数：

$$
\\sum_{n=0}^{\\infty} ar^n = \\frac{a}{1-r}, \\quad |r| < 1
$$

调和级数（发散）：

$$
\\sum_{n=1}^{\\infty} \\frac{1}{n} = 1 + \\frac{1}{2} + \\frac{1}{3} + \\frac{1}{4} + \\cdots = \\infty
$$

## 泰勒级数

指数函数的泰勒展开：

$$
e^x = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!} = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\cdots
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

## 混合文档示例

在实际文档中混合使用文本和数学公式：

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { MarkdownRenderer } from '@markdown-next/vue';
import type { ParserOptions } from '@markdown-next/parser';

const markdown = ref(`
# 量子力学基础

## 薛定谔方程

薛定谔方程是量子力学的基本方程，描述了量子系统的状态如何随时间演化。

### 时间依赖薛定谔方程

对于一个量子系统，其波函数 $\\Psi(\\mathbf{r}, t)$ 满足：

$$
i\\hbar\\frac{\\partial}{\\partial t}\\Psi(\\mathbf{r}, t) = \\hat{H}\\Psi(\\mathbf{r}, t)
$$

其中：
- $i$ 是虚数单位
- $\\hbar = \\frac{h}{2\\pi}$ 是约化普朗克常数
- $\\hat{H}$ 是哈密顿算符

### 时间无关薛定谔方程

对于定态问题，可以分离变量得到：

$$
\\hat{H}\\psi(\\mathbf{r}) = E\\psi(\\mathbf{r})
$$

这是一个本征值问题，$E$ 是能量本征值。

## 海森堡不确定性原理

位置 $x$ 和动量 $p$ 的不确定性满足：

$$
\\Delta x \\cdot \\Delta p \\geq \\frac{\\hbar}{2}
$$

这意味着我们**不可能同时精确测量**粒子的位置和动量。

## 能量和时间的不确定性

类似地，能量和时间也有不确定性关系：

$$
\\Delta E \\cdot \\Delta t \\geq \\frac{\\hbar}{2}
$$

## 氢原子能级

氢原子的能级由下式给出：

$$
E_n = -\\frac{13.6 \\text{ eV}}{n^2}, \\quad n = 1, 2, 3, \\ldots
$$

其中 $n$ 是主量子数。基态 $(n=1)$ 的能量是 $-13.6$ eV。
`);

const parserOptions: ParserOptions = {
  supportsLaTeX: true,
  extendedGrammar: ['gfm', 'mathjax'],
};
</script>

<template>
  <MarkdownRenderer :markdown="markdown" :parserOptions="parserOptions" />
</template>
```

## 交互式数学公式编辑器

实时编辑和预览数学公式：

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { MarkdownRenderer } from '@markdown-next/vue';
import type { ParserOptions } from '@markdown-next/parser';

const markdown = ref(`# 数学公式编辑器

尝试编辑下面的公式！

## 行内公式

质能方程：$E = mc^2$

## 块级公式

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

## 提示

- 使用 \`$...$\` 表示行内公式
- 使用 \`$$...$$\` 表示块级公式
- 记得转义反斜杠（使用 \`\\\\\` 而不是 \`\\\`）
`);

const parserOptions: ParserOptions = {
  supportsLaTeX: true,
  extendedGrammar: ['gfm', 'mathjax'],
};

function updateMarkdown(event: Event) {
  markdown.value = (event.target as HTMLTextAreaElement).value;
}
</script>

<template>
  <div class="math-editor-container">
    <div class="editor-section">
      <div class="section-header">
        <h3>Markdown 输入</h3>
        <p class="hint">支持 GFM 和 LaTeX 数学公式</p>
      </div>
      <textarea
        :value="markdown"
        @input="updateMarkdown"
        class="math-editor"
        placeholder="在此输入包含数学公式的 Markdown..."
      />
    </div>

    <div class="preview-section">
      <div class="section-header">
        <h3>实时预览</h3>
        <p class="hint">公式会自动渲染</p>
      </div>
      <div class="math-preview">
        <MarkdownRenderer
          :markdown="markdown"
          :parserOptions="parserOptions"
          :dynamic="true"
          :debounceMs="300"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.math-editor-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin: 2rem 0;
  min-height: 600px;
}

.editor-section,
.preview-section {
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: #ffffff;
}

.section-header {
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom: 1px solid #e0e0e0;
}

.section-header h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.hint {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.9;
}

.math-editor {
  flex: 1;
  width: 100%;
  padding: 1.5rem;
  border: none;
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  resize: none;
  outline: none;
  background: #fafafa;
}

.math-editor:focus {
  background: #ffffff;
}

.math-preview {
  flex: 1;
  padding: 1.5rem;
  overflow: auto;
  background: #fafafa;
}

.math-preview :deep(h1) {
  font-size: 1.8rem;
  margin-top: 0;
}

.math-preview :deep(h2) {
  font-size: 1.5rem;
  margin-top: 1.5rem;
}

.math-preview :deep(p) {
  line-height: 1.7;
}

.math-preview :deep(.math-display) {
  margin: 1.5rem 0;
  overflow-x: auto;
}

@media (max-width: 768px) {
  .math-editor-container {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .editor-section,
  .preview-section {
    min-height: 400px;
  }
}
</style>
```

## 常用数学符号参考

在 LaTeX 中常用的数学符号：

| 类型     | LaTeX 代码                      | 渲染结果                   |
| -------- | ------------------------------- | -------------------------- |
| 希腊字母 | `$\\alpha, \\beta, \\gamma$`    | $\alpha, \beta, \gamma$    |
| 上下标   | `$x^2, x_i, x^{2n}$`            | $x^2, x_i, x^{2n}$         |
| 分数     | `$\\frac{a}{b}$`                | $\frac{a}{b}$              |
| 根号     | `$\\sqrt{x}, \\sqrt[n]{x}$`     | $\sqrt{x}, \sqrt[n]{x}$    |
| 求和     | `$\\sum_{i=1}^{n} x_i$`         | $\sum_{i=1}^{n} x_i$       |
| 积分     | `$\\int_{a}^{b} f(x)dx$`        | $\int_{a}^{b} f(x)dx$      |
| 极限     | `$\\lim_{x \\to \\infty} f(x)$` | $\lim_{x \to \infty} f(x)$ |
| 向量     | `$\\vec{v}, \\mathbf{v}$`       | $\vec{v}, \mathbf{v}$      |

## 性能优化提示

处理大量数学公式时的性能优化建议：

1. **使用 Worker 池**：对于包含大量公式的文档，使用 `MarkdownWorkerPoll` 组件
2. **动态渲染**：启用 `dynamic` 模式并设置合适的 `debounceMs` 值
3. **分页加载**：对于超长文档，考虑分页或虚拟滚动

```vue
<script setup lang="ts">
import { MarkdownRenderer, MarkdownWorkerPoll } from '@markdown-next/vue';
import { ref } from 'vue';

const mathDocument = ref('...'); // 包含大量公式的文档

const parserOptions = {
  supportsLaTeX: true,
  extendedGrammar: ['mathjax'],
};
</script>

<template>
  <MarkdownWorkerPoll :worker-count="2" :parserOptions="parserOptions">
    <MarkdownRenderer :markdown="mathDocument" :dynamic="true" :debounceMs="500" />
  </MarkdownWorkerPoll>
</template>
```

## 更多资源

- [LaTeX 数学符号参考](https://www.overleaf.com/learn/latex/Mathematical_expressions)
- [MathJax 文档](https://docs.mathjax.org/)
- [解析器配置](/v1/zh/guide/parser)
- [Vue 渲染器](/v1/zh/guide/vue-renderer)
