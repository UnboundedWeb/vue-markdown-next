# Worker Pool

Learn how to use the MarkdownWorkerPoll component for better performance with multiple markdown documents or frequent updates.

## Why Use Worker Pool?

Worker pools provide several benefits:

- **Non-blocking parsing**: Markdown parsing runs in Web Workers, keeping the main thread responsive
- **Parallel processing**: Multiple workers can parse different documents simultaneously
- **Better performance**: Ideal for applications with frequent markdown updates or multiple documents

## Basic Worker Pool Usage

Use `MarkdownWorkerPoll` to wrap multiple `MarkdownRenderer` components:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { MarkdownRenderer, MarkdownWorkerPoll } from '@markdown-next/vue';
import type { ParserOptions } from '@markdown-next/parser';

const doc1 = ref('# Document 1\n\nFirst document content');
const doc2 = ref('# Document 2\n\nSecond document content');
const doc3 = ref('# Document 3\n\nThird document content');

const parserOptions: ParserOptions = {
  extendedGrammar: ['gfm', 'mathjax'],
  supportsLaTeX: true,
};
</script>

<template>
  <MarkdownWorkerPoll :worker-count="2" :parserOptions="parserOptions">
    <div class="documents">
      <div class="document">
        <h2>Document 1</h2>
        <MarkdownRenderer :markdown="doc1" :dynamic="true" />
      </div>

      <div class="document">
        <h2>Document 2</h2>
        <MarkdownRenderer :markdown="doc2" :dynamic="true" />
      </div>

      <div class="document">
        <h2>Document 3</h2>
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

## Live Editor with Worker Pool

Create a markdown editor that doesn't block the UI:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { MarkdownRenderer, MarkdownWorkerPoll } from '@markdown-next/vue';

const markdown = ref(`
# Live Editor Example

This editor uses a worker pool, so parsing happens in the background without blocking the UI.

Try typing something complex:

\`\`\`javascript
// Type a lot of code
for (let i = 0; i < 1000; i++) {
  console.log(i);
}
\`\`\`

$$
\\sum_{i=1}^{100} i^2 = \\frac{100 \\cdot 101 \\cdot 201}{6}
$$
`);

function handleInput(e: Event) {
  markdown.value = (e.target as HTMLTextAreaElement).value;
}

const parserOptions = {
  supportsLaTeX: true,
  extendedGrammar: ['gfm', 'mathjax'],
};
</script>

<template>
  <div class="editor-layout">
    <MarkdownWorkerPoll :worker-count="1" :parserOptions="parserOptions">
      <div class="editor-panel">
        <h3>Editor (Type here)</h3>
        <textarea
          :value="markdown"
          @input="handleInput"
          class="editor"
          placeholder="Start typing markdown..."
        />
      </div>

      <div class="preview-panel">
        <h3>Live Preview (Non-blocking)</h3>
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
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
  background: #fafafa;
}

.editor:focus {
  outline: 2px solid #e67e22;
  border-color: #e67e22;
  background: white;
}

.preview {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: #fafafa;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .editor-layout {
    grid-template-columns: 1fr;
    height: auto;
  }

  .editor-panel,
  .preview-panel {
    height: 400px;
  }
}
</style>
```

## Multiple Documents Editor

Manage multiple markdown documents with shared worker pool:

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { MarkdownRenderer, MarkdownWorkerPoll } from '@markdown-next/vue';

interface Document {
  id: number;
  title: string;
  content: string;
}

const documents = ref<Document[]>([
  { id: 1, title: 'README', content: '# README\n\nProject documentation' },
  { id: 2, title: 'CHANGELOG', content: '# CHANGELOG\n\n## v1.0.0\n- Initial release' },
  { id: 3, title: 'TODO', content: '# TODO\n\n- [ ] Task 1\n- [ ] Task 2' },
]);

const activeDocId = ref(1);

const activeDoc = computed(() => documents.value.find((d) => d.id === activeDocId.value));

function updateContent(content: string) {
  const doc = documents.value.find((d) => d.id === activeDocId.value);
  if (doc) {
    doc.content = content;
  }
}

function addDocument() {
  const newId = Math.max(...documents.value.map((d) => d.id)) + 1;
  documents.value.push({
    id: newId,
    title: `Document ${newId}`,
    content: `# Document ${newId}\n\nNew document content`,
  });
  activeDocId.value = newId;
}

function removeDocument(id: number) {
  if (documents.value.length <= 1) return;
  documents.value = documents.value.filter((d) => d.id !== id);
  if (activeDocId.value === id) {
    activeDocId.value = documents.value[0].id;
  }
}

const parserOptions = {
  extendedGrammar: ['gfm'],
};
</script>

<template>
  <div class="app">
    <MarkdownWorkerPoll :worker-count="2" :parserOptions="parserOptions">
      <div class="tabs">
        <button
          v-for="doc in documents"
          :key="doc.id"
          @click="activeDocId = doc.id"
          :class="['tab', { active: doc.id === activeDocId }]"
        >
          {{ doc.title }}
          <span v-if="documents.length > 1" @click.stop="removeDocument(doc.id)" class="close">
            ×
          </span>
        </button>
        <button @click="addDocument" class="tab add-tab">+</button>
      </div>

      <div v-if="activeDoc" class="content">
        <div class="editor-section">
          <textarea
            :value="activeDoc.content"
            @input="updateContent(($event.target as HTMLTextAreaElement).value)"
            class="editor"
          />
        </div>

        <div class="preview-section">
          <MarkdownRenderer
            :markdown="activeDoc.content"
            :dynamic="true"
            :debounceMs="300"
            class="preview"
          />
        </div>
      </div>
    </MarkdownWorkerPoll>
  </div>
</template>

<style scoped>
.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background: white;
  border-bottom: 2px solid #e0e0e0;
  overflow-x: auto;
}

.tab {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px 6px 0 0;
  background: #f5f5f5;
  color: #666;
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.tab:hover {
  background: #e8e8e8;
}

.tab.active {
  background: white;
  color: #e67e22;
  border-bottom-color: white;
  font-weight: bold;
}

.add-tab {
  background: #e67e22;
  color: white;
  border-color: #e67e22;
}

.add-tab:hover {
  background: #d67118;
}

.close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.1);
  font-size: 18px;
  line-height: 1;
}

.close:hover {
  background: rgba(231, 76, 60, 0.8);
  color: white;
}

.content {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  overflow: hidden;
}

.editor-section,
.preview-section {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.editor {
  flex: 1;
  width: 100%;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-family: 'Monaco', monospace;
  font-size: 14px;
  line-height: 1.6;
  resize: none;
}

.editor:focus {
  outline: 2px solid #e67e22;
  border-color: #e67e22;
}

.preview {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

@media (max-width: 768px) {
  .content {
    grid-template-columns: 1fr;
  }
}
</style>
```

## Performance Monitoring

Monitor worker pool performance:

```vue
<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { MarkdownRenderer, MarkdownWorkerPoll } from '@markdown-next/vue';
import { MarkdownWorkerPool } from '@markdown-next/parser';

const markdown = ref('# Performance Test\n\nType to see worker stats...');
const pool = ref<MarkdownWorkerPool | null>(null);
const stats = ref({
  activeWorkers: 0,
  idleWorkers: 0,
  queuedTasks: 0,
  completedTasks: 0,
});

// Update stats periodically
const statsInterval = setInterval(() => {
  if (pool.value) {
    stats.value = pool.value.getStats();
  }
}, 100);

onUnmounted(() => {
  clearInterval(statsInterval);
  if (pool.value) {
    pool.value.terminate();
  }
});

const parserOptions = {
  extendedGrammar: ['gfm'],
};
</script>

<template>
  <div class="performance-demo">
    <div class="stats-panel">
      <h3>Worker Pool Statistics</h3>
      <div class="stats-grid">
        <div class="stat">
          <span class="stat-label">Active Workers</span>
          <span class="stat-value">{{ stats.activeWorkers }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Idle Workers</span>
          <span class="stat-value">{{ stats.idleWorkers }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Queued Tasks</span>
          <span class="stat-value">{{ stats.queuedTasks }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Completed</span>
          <span class="stat-value">{{ stats.completedTasks }}</span>
        </div>
      </div>
    </div>

    <MarkdownWorkerPoll :worker-count="2" :parserOptions="parserOptions" @ready="pool = $event">
      <div class="editor-area">
        <textarea
          v-model="markdown"
          class="editor"
          placeholder="Type markdown to see worker activity..."
        />
      </div>

      <div class="preview-area">
        <MarkdownRenderer :markdown="markdown" :dynamic="true" :debounceMs="100" />
      </div>
    </MarkdownWorkerPoll>
  </div>
</template>

<style scoped>
.performance-demo {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100vh;
  padding: 1rem;
}

.stats-panel {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stats-panel h3 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.stat-label {
  font-size: 0.85rem;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
}

.editor-area,
.preview-area {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: auto;
}

.editor {
  width: 100%;
  height: 100%;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.6;
  resize: none;
}

.editor:focus {
  outline: 2px solid #667eea;
  border-color: #667eea;
}
</style>
```

## Best Practices

### Worker Count

Choose the right number of workers based on your use case:

```ts
// Single document, frequent updates
const workerCount = 1;

// Multiple documents, moderate updates
const workerCount = 2;

// Many documents or heavy parsing
const workerCount = navigator.hardwareConcurrency || 4;
```

### Memory Management

Always clean up worker pools when components unmount:

```ts
import { onUnmounted } from 'vue';
import { MarkdownWorkerPool } from '@markdown-next/parser';

const pool = new MarkdownWorkerPool({ workerCount: 2 });

onUnmounted(() => {
  pool.terminate(); // Important!
});
```

### Debouncing

Use appropriate debounce times for dynamic content:

```vue
<!-- Fast typing -->
<MarkdownRenderer :dynamic="true" :debounceMs="300" />

<!-- Slower updates -->
<MarkdownRenderer :dynamic="true" :debounceMs="500" />
```
