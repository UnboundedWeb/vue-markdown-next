import { defineComponent, h } from 'vue';
import type { VNodeChild } from 'vue';
import hljs from 'highlight.js/lib/common';
import 'highlight.js/styles/github.css';

const getCodeText = (children: unknown): string => {
  if (children == null) return '';
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) {
    return children.map((child) => (typeof child === 'string' ? child : '')).join('');
  }
  return '';
};

export const CustomCodeRenderer = defineComponent({
  name: 'CustomCodeRenderer',
  props: {
    class: { type: String, required: false },
    className: { type: String, required: false },
    children: { type: [Array, String], required: false },
  },
  setup(props) {
    return () => {
      const rawClass = props.class ?? props.className ?? '';
      const languageMatch = rawClass.match(/language-([\w-]+)/i);
      const language = languageMatch?.[1];
      const code = getCodeText(props.children);
      if (!language) {
        return h('code', { class: rawClass }, code);
      }
      const highlighted = hljs.getLanguage(language)
        ? hljs.highlight(code, { language, ignoreIllegals: true }).value
        : hljs.highlightAuto(code).value;
      const mergedClass = ['hljs', rawClass].filter(Boolean).join(' ');
      return h('code', { class: mergedClass, innerHTML: highlighted });
    };
  },
});

const getChildren = (
  props: Record<string, unknown>
): Exclude<VNodeChild, null | undefined | void> | undefined => {
  const children = props.children as VNodeChild | null | undefined;
  if (children == null) return undefined;
  return children as Exclude<VNodeChild, null | undefined | void>;
};

const CustomHeading = (props: Record<string, unknown>): ReturnType<typeof h> =>
  h('h2', { class: 'custom-title' }, getChildren(props));

const CustomBlockquote = (props: Record<string, unknown>): ReturnType<typeof h> =>
  h('blockquote', { class: 'custom-quote' }, getChildren(props));

export const customComponents = {
  h2: CustomHeading,
  blockquote: CustomBlockquote,
};
