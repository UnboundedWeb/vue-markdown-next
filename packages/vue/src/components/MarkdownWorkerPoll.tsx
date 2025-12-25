import { defineComponent, onBeforeUnmount, provide, computed } from 'vue';
import type { DefineComponent, PropType } from 'vue';
import type { ParserOptions } from '@markdown-next/parser';
import { createWorkerPool } from '@markdown-next/parser';
import { markdownWorkerContextKey } from '../context';
import type {
  MarkdownComponent,
  MarkdownComponents,
  MarkdownRenderOptions,
  MarkdownWorkerPollProps,
} from '../types';

export const MarkdownWorkerPoll: DefineComponent<MarkdownWorkerPollProps> = defineComponent({
  name: 'MarkdownWorkerPoll',
  props: {
    parserOptions: {
      type: Object as PropType<ParserOptions>,
      required: false,
      default: undefined,
    },
    workerCount: {
      type: Number,
      required: false,
      default: 1,
    },
    customTags: {
      type: Array as PropType<string[]>,
      required: false,
      default: undefined,
    },
    extendedGrammar: {
      type: Array as PropType<ParserOptions['extendedGrammar']>,
      required: false,
      default: undefined,
    },
    remarkPlugins: {
      type: Array as PropType<ParserOptions['remarkPlugins']>,
      required: false,
      default: undefined,
    },
    rehypePlugins: {
      type: Array as PropType<ParserOptions['rehypePlugins']>,
      required: false,
      default: undefined,
    },
    mathJaxConfig: {
      type: Object as PropType<ParserOptions['mathJaxConfig']>,
      required: false,
      default: undefined,
    },
    supportsLaTeX: {
      type: Boolean,
      required: false,
      default: undefined,
    },
    components: {
      type: Object as PropType<MarkdownComponents>,
      required: false,
      default: undefined,
    },
    codeRenderer: {
      type: [Object, Function, String] as PropType<MarkdownComponent>,
      required: false,
      default: undefined,
    },
    dynamic: {
      type: Boolean,
      required: false,
      default: undefined,
    },
    debounceMs: {
      type: Number,
      required: false,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    const poolOptions: ParserOptions & { workerCount?: number } = {
      ...(props.parserOptions ?? {}),
    };
    if (props.workerCount != null) poolOptions.workerCount = props.workerCount;
    if (props.customTags) poolOptions.customTags = props.customTags;
    if (props.extendedGrammar) poolOptions.extendedGrammar = props.extendedGrammar;
    if (props.remarkPlugins) poolOptions.remarkPlugins = props.remarkPlugins;
    if (props.rehypePlugins) poolOptions.rehypePlugins = props.rehypePlugins;
    if (props.mathJaxConfig) poolOptions.mathJaxConfig = props.mathJaxConfig;
    if (props.supportsLaTeX != null) poolOptions.supportsLaTeX = props.supportsLaTeX;

    const pool = createWorkerPool(poolOptions);

    const renderOptions = computed<MarkdownRenderOptions | undefined>(() => {
      if (
        props.components == null &&
        props.codeRenderer == null &&
        props.dynamic == null &&
        props.debounceMs == null
      ) {
        return undefined;
      }

      const options: MarkdownRenderOptions = {
        dynamic: props.dynamic ?? false,
        debounceMs: props.debounceMs ?? 250,
      };
      if (props.components) options.components = props.components;
      if (props.codeRenderer) options.codeRenderer = props.codeRenderer;
      return options;
    });

    const forceRenderOptions = computed(() => renderOptions.value !== undefined);

    provide(markdownWorkerContextKey, {
      pool,
      renderOptions,
      forceRenderOptions,
    });

    onBeforeUnmount(() => {
      void pool.destroy();
    });

    return () => slots['default']?.();
  },
});
