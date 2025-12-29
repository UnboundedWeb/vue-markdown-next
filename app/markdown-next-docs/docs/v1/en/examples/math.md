# Math Formula Rendering

<script setup>
import { ref } from 'vue';

// Basic example
const mathBasic = ref(`## Mathematical Constants

There are many important constants in mathematics. For example:

- Pi $\\pi \\approx 3.14159$
- Euler's number $e \\approx 2.71828$
- Golden ratio $\\varphi = \\frac{1+\\sqrt{5}}{2}$

### Famous Formulas

Euler's formula is considered one of the most beautiful mathematical formulas:

$$
e^{i\\pi} + 1 = 0
$$

This formula connects five of the most important mathematical constants.`);

// Matrix example
const mathMatrix = ref(`# Matrices in Linear Algebra

## Basic Matrix

A $2 \\times 2$ matrix:

$$
A = \\begin{pmatrix}
a & b \\\\
c & d
\\end{pmatrix}
$$

## Identity Matrix

The $3 \\times 3$ identity matrix $I_3$:

$$
I_3 = \\begin{pmatrix}
1 & 0 & 0 \\\\
0 & 1 & 0 \\\\
0 & 0 & 1
\\end{pmatrix}
$$

## Determinant

The determinant of matrix $A$:

$$
\\det(A) = \\begin{vmatrix}
a & b \\\\
c & d
\\end{vmatrix} = ad - bc
$$`);

// Aligned equations example
const mathAligned = ref(`# Quadratic Equation Derivation

Completing the square for $ax^2 + bx + c = 0$:

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

This is the famous **quadratic formula**.`);

// Piecewise functions example
const mathPiecewise = ref(`# Piecewise Functions

## Absolute Value Function

The absolute value function can be defined as:

$$
|x| = \\begin{cases}
x & \\text{if } x \\geq 0 \\\\
-x & \\text{if } x < 0
\\end{cases}
$$

## Sign Function

The sign function $\\text{sgn}(x)$ is defined as:

$$
\\text{sgn}(x) = \\begin{cases}
1 & \\text{if } x > 0 \\\\
0 & \\text{if } x = 0 \\\\
-1 & \\text{if } x < 0
\\end{cases}
$$

## Heaviside Step Function

The Heaviside step function:

$$
H(x) = \\begin{cases}
0 & \\text{if } x < 0 \\\\
\\frac{1}{2} & \\text{if } x = 0 \\\\
1 & \\text{if } x > 0
\\end{cases}
$$`);

// Integrals and series example
const mathIntegral = ref(`# Calculus and Series

## Definite Integral

The Gaussian integral is fundamental in probability theory:

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

## Multiple Integral

Calculating the volume of a sphere:

$$
V = \\int_{0}^{2\\pi} \\int_{0}^{\\pi} \\int_{0}^{r} \\rho^2 \\sin\\phi \\, d\\rho \\, d\\phi \\, d\\theta = \\frac{4}{3}\\pi r^3
$$

## Infinite Series

Geometric series:

$$
\\sum_{n=0}^{\\infty} ar^n = \\frac{a}{1-r}, \\quad |r| < 1
$$

Harmonic series (divergent):

$$
\\sum_{n=1}^{\\infty} \\frac{1}{n} = 1 + \\frac{1}{2} + \\frac{1}{3} + \\frac{1}{4} + \\cdots = \\infty
$$

## Taylor Series

Taylor expansion of exponential function:

$$
e^x = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!} = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\cdots
$$`);

// Quantum mechanics example
const mathQuantum = ref(`# Quantum Mechanics Basics

## Schrödinger Equation

The Schrödinger equation is the fundamental equation of quantum mechanics, describing how quantum systems evolve over time.

### Time-Dependent Schrödinger Equation

For a quantum system, the wave function $\\Psi(\\mathbf{r}, t)$ satisfies:

$$
i\\hbar\\frac{\\partial}{\\partial t}\\Psi(\\mathbf{r}, t) = \\hat{H}\\Psi(\\mathbf{r}, t)
$$

Where:
- $i$ is the imaginary unit
- $\\hbar = \\frac{h}{2\\pi}$ is the reduced Planck constant
- $\\hat{H}$ is the Hamiltonian operator

### Time-Independent Schrödinger Equation

For stationary states, separation of variables yields:

$$
\\hat{H}\\psi(\\mathbf{r}) = E\\psi(\\mathbf{r})
$$

This is an eigenvalue problem where $E$ is the energy eigenvalue.

## Heisenberg Uncertainty Principle

The uncertainty in position $x$ and momentum $p$ satisfies:

$$
\\Delta x \\cdot \\Delta p \\geq \\frac{\\hbar}{2}
$$

This means we **cannot simultaneously measure** both position and momentum with arbitrary precision.`);

// Interactive editor
const editorMarkdown = ref(`# Math Formula Editor

Try editing the formulas below!

## Inline Formula

Einstein's mass-energy equivalence: $E = mc^2$

## Block Formula

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

## Tips

- Use \`$...$\` for inline formulas
- Use \`$$...$$\` for block formulas
- You can also use \( or \] to render LaTeX-formatted formulas.
- Remember to escape backslashes (use \`\\\\\` instead of \`\\\`)
`);

// Parser Options
const parserOptionsBasic = {
  supportsLaTeX: true,
  extendedGrammar: ['mathjax'],
};

const parserOptionsGfm = {
  supportsLaTeX: true,
  extendedGrammar: ['gfm', 'mathjax'],
};

// Editor update function
function updateEditorMarkdown(event) {
  editorMarkdown.value = event.target.value;
}
</script>

This example demonstrates how to use MarkdownRenderer to render various types of mathematical formulas, including inline formulas, block formulas, and complex mathematical expressions.

## Basic Usage

### Inline and Block Formulas

The most basic math formula rendering:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { MarkdownRenderer } from '@markdown-next/vue';
import type { ParserOptions } from '@markdown-next/parser';

const markdown = ref(`
## Mathematical Constants

There are many important constants in mathematics. For example:

- Pi $\\pi \\approx 3.14159$
- Euler's number $e \\approx 2.71828$
- Golden ratio $\\varphi = \\frac{1+\\sqrt{5}}{2}$

### Famous Formulas

Euler's formula is considered one of the most beautiful mathematical formulas:

$$
e^{i\\pi} + 1 = 0
$$

This formula connects five of the most important mathematical constants.
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

**Rendered Output:**

<div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0; background: #fafafa;">
  <MarkdownRenderer :markdown="mathBasic" :parserOptions="parserOptionsBasic" />
</div>

## Complex Mathematical Expressions

### Matrices

Demonstrating various matrix representations:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { MarkdownRenderer } from '@markdown-next/vue';
import type { ParserOptions } from '@markdown-next/parser';

const markdown = ref(`
# Matrices in Linear Algebra

## Basic Matrix

A $2 \\times 2$ matrix:

$$
A = \\begin{pmatrix}
a & b \\\\
c & d
\\end{pmatrix}
$$

## Identity Matrix

The $3 \\times 3$ identity matrix $I_3$:

$$
I_3 = \\begin{pmatrix}
1 & 0 & 0 \\\\
0 & 1 & 0 \\\\
0 & 0 & 1
\\end{pmatrix}
$$

## Determinant

The determinant of matrix $A$:

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

**Rendered Output:**

<div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0; background: #fafafa;">
  <MarkdownRenderer :markdown="mathMatrix" :parserOptions="parserOptionsBasic" />
</div>

### Multi-line Aligned Equations

Using the `aligned` environment to show derivation steps:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { MarkdownRenderer } from '@markdown-next/vue';
import type { ParserOptions } from '@markdown-next/parser';

const markdown = ref(`
# Quadratic Equation Derivation

Completing the square for the quadratic equation $ax^2 + bx + c = 0$:

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

This is the famous **quadratic formula**.
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

**Rendered Output:**

<div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0; background: #fafafa;">
  <MarkdownRenderer :markdown="mathAligned" :parserOptions="parserOptionsBasic" />
</div>

### Piecewise Functions

Defining piecewise functions:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { MarkdownRenderer } from '@markdown-next/vue';
import type { ParserOptions } from '@markdown-next/parser';

const markdown = ref(`
# Piecewise Functions

## Absolute Value Function

The absolute value function can be defined as:

$$
|x| = \\begin{cases}
x & \\text{if } x \\geq 0 \\\\
-x & \\text{if } x < 0
\\end{cases}
$$

## Sign Function

The sign function $\\text{sgn}(x)$ definition:

$$
\\text{sgn}(x) = \\begin{cases}
1 & \\text{if } x > 0 \\\\
0 & \\text{if } x = 0 \\\\
-1 & \\text{if } x < 0
\\end{cases}
$$

## Unit Step Function

The Heaviside step function:

$$
H(x) = \\begin{cases}
0 & \\text{if } x < 0 \\\\
\\frac{1}{2} & \\text{if } x = 0 \\\\
1 & \\text{if } x > 0
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

**Rendered Output:**

<div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0; background: #fafafa;">
  <MarkdownRenderer :markdown="mathPiecewise" :parserOptions="parserOptionsBasic" />
</div>

### Integrals and Summations

Showing integral and summation symbols:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { MarkdownRenderer } from '@markdown-next/vue';
import type { ParserOptions } from '@markdown-next/parser';

const markdown = ref(`
# Calculus and Series

## Definite Integral

The Gaussian integral is fundamental to probability theory:

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

## Multiple Integral

Calculating the volume of a sphere:

$$
V = \\int_{0}^{2\\pi} \\int_{0}^{\\pi} \\int_{0}^{r} \\rho^2 \\sin\\phi \\, d\\rho \\, d\\phi \\, d\\theta = \\frac{4}{3}\\pi r^3
$$

## Infinite Series

Geometric series:

$$
\\sum_{n=0}^{\\infty} ar^n = \\frac{a}{1-r}, \\quad |r| < 1
$$

Harmonic series (divergent):

$$
\\sum_{n=1}^{\\infty} \\frac{1}{n} = 1 + \\frac{1}{2} + \\frac{1}{3} + \\frac{1}{4} + \\cdots = \\infty
$$

## Taylor Series

Taylor expansion of the exponential function:

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

**Rendered Output:**

<div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0; background: #fafafa;">
  <MarkdownRenderer :markdown="mathIntegral" :parserOptions="parserOptionsBasic" />
</div>

## Mixed Document Example

Mixing text and math formulas in real documentation:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { MarkdownRenderer } from '@markdown-next/vue';
import type { ParserOptions } from '@markdown-next/parser';

const markdown = ref(`
# Quantum Mechanics Fundamentals

## Schrödinger Equation

The Schrödinger equation is the fundamental equation of quantum mechanics, describing how the state of a quantum system evolves over time.

### Time-Dependent Schrödinger Equation

For a quantum system, its wave function $\\Psi(\\mathbf{r}, t)$ satisfies:

$$
i\\hbar\\frac{\\partial}{\\partial t}\\Psi(\\mathbf{r}, t) = \\hat{H}\\Psi(\\mathbf{r}, t)
$$

Where:
- $i$ is the imaginary unit
- $\\hbar = \\frac{h}{2\\pi}$ is the reduced Planck constant
- $\\hat{H}$ is the Hamiltonian operator

### Time-Independent Schrödinger Equation

For stationary state problems, we can separate variables to get:

$$
\\hat{H}\\psi(\\mathbf{r}) = E\\psi(\\mathbf{r})
$$

This is an eigenvalue problem, where $E$ is the energy eigenvalue.

## Heisenberg Uncertainty Principle

The uncertainties in position $x$ and momentum $p$ satisfy:

$$
\\Delta x \\cdot \\Delta p \\geq \\frac{\\hbar}{2}
$$

This means we **cannot simultaneously measure** a particle's position and momentum with arbitrary precision.

## Energy-Time Uncertainty

Similarly, energy and time have an uncertainty relation:

$$
\\Delta E \\cdot \\Delta t \\geq \\frac{\\hbar}{2}
$$

## Hydrogen Atom Energy Levels

The energy levels of the hydrogen atom are given by:

$$
E_n = -\\frac{13.6 \\text{ eV}}{n^2}, \\quad n = 1, 2, 3, \\ldots
$$

Where $n$ is the principal quantum number. The ground state $(n=1)$ has energy $-13.6$ eV.
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

**Rendered Output:**

<div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0; background: #fafafa;">
  <MarkdownRenderer :markdown="mathQuantum" :parserOptions="parserOptionsGfm" />
</div>

## Interactive Math Formula Editor

Real-time editing and preview of math formulas:

<div class="math-editor-container">
  <div class="editor-section">
    <div class="section-header">
      <h3>Markdown Input</h3>
      <p class="hint">Supports GFM and LaTeX math formulas</p>
    </div>
    <textarea
      :value="editorMarkdown"
      @input="updateEditorMarkdown"
      class="math-editor"
      placeholder="Enter Markdown with math formulas here..."
    />
  </div>

  <div class="preview-section">
    <div class="section-header">
      <h3>Live Preview</h3>
      <p class="hint">Formulas are automatically rendered</p>
    </div>
    <div class="math-preview">
      <MarkdownRenderer
        :markdown="editorMarkdown"
        :parserOptions="parserOptionsGfm"
        :dynamic="true"
        :debounceMs="300"
      />
    </div>
  </div>
</div>

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

## Common Math Symbol Reference

Commonly used mathematical symbols in LaTeX:

| Type                  | LaTeX Code                      | Rendered Result            |
| --------------------- | ------------------------------- | -------------------------- |
| Greek Letters         | `$\\alpha, \\beta, \\gamma$`    | $\alpha, \beta, \gamma$    |
| Superscript/Subscript | `$x^2, x_i, x^{2n}$`            | $x^2, x_i, x^{2n}$         |
| Fraction              | `$\\frac{a}{b}$`                | $\frac{a}{b}$              |
| Root                  | `$\\sqrt{x}, \\sqrt[n]{x}$`     | $\sqrt{x}, \sqrt[n]{x}$    |
| Sum                   | `$\\sum_{i=1}^{n} x_i$`         | $\sum_{i=1}^{n} x_i$       |
| Integral              | `$\\int_{a}^{b} f(x)dx$`        | $\int_{a}^{b} f(x)dx$      |
| Limit                 | `$\\lim_{x \\to \\infty} f(x)$` | $\lim_{x \to \infty} f(x)$ |
| Vector                | `$\\vec{v}, \\mathbf{v}$`       | $\vec{v}, \mathbf{v}$      |

## Performance Optimization Tips

Performance optimization recommendations when handling large amounts of math formulas:

1. **Use Worker Pool**: For documents with many formulas, use the `MarkdownWorkerPoll` component
2. **Dynamic Rendering**: Enable `dynamic` mode and set an appropriate `debounceMs` value
3. **Pagination**: For very long documents, consider pagination or virtual scrolling

```vue
<script setup lang="ts">
import { MarkdownRenderer, MarkdownWorkerPoll } from '@markdown-next/vue';
import { ref } from 'vue';

const mathDocument = ref('...'); // Document with many formulas

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

## Additional Resources

- [LaTeX Mathematical Symbols Reference](https://www.overleaf.com/learn/latex/Mathematical_expressions)
- [MathJax Documentation](https://docs.mathjax.org/)
- [Parser Configuration](/v1/en/guide/parser)
- [Vue Renderer](/v1/en/guide/vue-renderer)
