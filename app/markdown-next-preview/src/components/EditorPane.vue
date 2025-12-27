<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
}>();

const markdownValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
});

const editorRef = ref<HTMLTextAreaElement | null>(null);

const wrapSelection = (before: string, after = before) => {
  const textarea = editorRef.value;
  if (!textarea) return;
  const { selectionStart, selectionEnd } = textarea;
  const value = markdownValue.value;
  const selected = value.slice(selectionStart, selectionEnd);
  markdownValue.value =
    value.slice(0, selectionStart) + before + selected + after + value.slice(selectionEnd);

  nextTick(() => {
    textarea.focus();
    textarea.setSelectionRange(selectionStart + before.length, selectionEnd + before.length);
  });
};

const prefixLine = (prefix: string) => {
  const textarea = editorRef.value;
  if (!textarea) return;
  const value = markdownValue.value;
  const { selectionStart } = textarea;
  const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
  markdownValue.value = value.slice(0, lineStart) + prefix + value.slice(lineStart);

  nextTick(() => {
    const cursor = selectionStart + prefix.length;
    textarea.focus();
    textarea.setSelectionRange(cursor, cursor);
  });
};
</script>

<template>
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
      v-model="markdownValue"
      class="editor"
      spellcheck="false"
      placeholder="在这里输入 markdown..."
    />
  </section>
</template>
