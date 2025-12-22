import { defineComponent, h, type PropType } from 'vue';
import { parseMarkdown, type ParseOptions } from '@markdown-next/parser';

export const MarkdownViewer = defineComponent({
  name: 'MarkdownViewer',
  props: {
    content: {
      type: String,
      required: true,
    },
    options: {
      type: Object as PropType<ParseOptions>,
      default: () => ({}),
    },
  },
  setup(props) {
    return () => {
      const html = parseMarkdown(props.content, props.options);
      return h('div', {
        class: 'markdown-viewer',
        innerHTML: html,
      });
    };
  },
});

export { parseMarkdown } from '@markdown-next/parser';
