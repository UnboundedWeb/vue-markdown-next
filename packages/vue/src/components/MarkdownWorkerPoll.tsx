import { defineComponent, onBeforeUnmount, onMounted, provide, computed } from 'vue';
import type { DefineComponent, PropType } from 'vue';
import type { ParserOptions, ParserWorkerPool } from '@markdown-next/parser';
import { createWorkerPool } from '@markdown-next/parser';
import { markdownWorkerContextKey } from '../context';
import type {
  LoadingSlot,
  MarkdownComponent,
  MarkdownComponents,
  MarkdownRenderMode,
  MarkdownRenderOptions,
  MarkdownStreamdownOptions,
  MarkdownWorkerPollProps,
} from '../types';

export const MarkdownWorkerPoll: DefineComponent<MarkdownWorkerPollProps> = defineComponent({
  name: 'MarkdownWorkerPoll',
  emits: {
    ready: (pool: ParserWorkerPool) => pool != null,
  },
  props: {
    parserOptions: {
      type: Object as PropType<ParserOptions>,
      required: false,
      default: undefined,
    },
    workerCount: {
      type: Number,
      required: true,
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
    mode: {
      type: String as PropType<MarkdownRenderMode>,
      required: false,
      default: undefined,
    },
    streamdown: {
      type: Object as PropType<MarkdownStreamdownOptions>,
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
    loadingSlot: {
      type: [Object, Function] as PropType<LoadingSlot>,
      required: false,
      default: undefined,
    },
  },
  setup(props, { slots, emit, expose }) {
    const poolOptions: ParserOptions & { workerCount?: number } = {
      ...(props.parserOptions ?? {}),
    };
    if (props.workerCount != null) poolOptions.workerCount = props.workerCount;
    if (props.customTags) poolOptions.customTags = props.customTags;
    if (props.extendedGrammar) poolOptions.extendedGrammar = props.extendedGrammar;
    if (props.remarkPlugins) poolOptions.remarkPlugins = props.remarkPlugins;
    if (props.rehypePlugins) poolOptions.rehypePlugins = props.rehypePlugins;
    if (props.mathJaxConfig) poolOptions.mathJaxConfig = props.mathJaxConfig;

    const pool = createWorkerPool(poolOptions);

    expose({
      pool,
      getPoolInfo: () => pool.getPoolInfo(),
      getStats: () => pool.getStats(),
      terminate: () => pool.terminate(),
      destroy: () => pool.destroy(),
    });

    const renderOptions = computed<MarkdownRenderOptions | undefined>(() => {
      if (
        props.components == null &&
        props.codeRenderer == null &&
        props.mode == null &&
        props.streamdown == null &&
        props.dynamic == null &&
        props.debounceMs == null &&
        props.loadingSlot == null
      ) {
        return undefined;
      }

      const options: MarkdownRenderOptions = {};
      if (props.components) options.components = props.components;
      if (props.codeRenderer) options.codeRenderer = props.codeRenderer;
      if (props.mode != null) options.mode = props.mode;
      if (props.streamdown) options.streamdown = props.streamdown;
      if (props.dynamic != null) options.dynamic = props.dynamic;
      if (props.debounceMs != null) options.debounceMs = props.debounceMs;
      if (props.loadingSlot) options.loadingSlot = props.loadingSlot;
      return options;
    });

    const forceRenderOptions = computed(() => renderOptions.value !== undefined);

    provide(markdownWorkerContextKey, {
      pool,
      renderOptions,
      forceRenderOptions,
    });

    onMounted(() => {
      emit('ready', pool);
    });

    onBeforeUnmount(() => {
      void pool.destroy();
    });

    return () => slots['default']?.();
  },
});
