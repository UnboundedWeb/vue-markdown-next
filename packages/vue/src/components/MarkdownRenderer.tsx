import {
  defineComponent,
  computed,
  h,
  inject,
  onErrorCaptured,
  ref,
  toRef,
  useAttrs,
  watch,
} from 'vue';
import type { PropType, StyleValue, VNodeChild } from 'vue';
import type { ParserOptions } from '@markdown-next/parser';
import { markdownWorkerContextKey } from '../context';
import { useMarkdownParser } from '../hooks/useMarkdownParser';
import { useMarkdownWorkerPool } from '../hooks/useMarkdownWorkerPool';
import type {
  LoadingSlot,
  MarkdownComponent,
  MarkdownComponents,
  MarkdownRenderMode,
  MarkdownRenderOptions,
  MarkdownStreamdownOptions,
} from '../types';
import { githubContainerStyle } from '../styles/themeGithub';
import { toError } from '../utils/toError';

const loadingStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  color: '#57606a',
  fontSize: '14px',
};

const errorStyle = {
  padding: '12px 16px',
  borderRadius: '8px',
  backgroundColor: '#ffebe9',
  color: '#cf222e',
  border: '1px solid #ff8182',
  fontSize: '14px',
};

export const MarkdownRenderer = defineComponent({
  name: 'MarkdownRenderer',
  inheritAttrs: false,
  props: {
    markdown: {
      type: String,
      required: true,
    },
    parserOptions: {
      type: Object as PropType<ParserOptions>,
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
      default: 'static',
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
  setup(props) {
    const attrs = useAttrs();
    const markdownRef = toRef(props, 'markdown');
    const context = inject(markdownWorkerContextKey, null);
    const renderError = ref<Error | null>(null);

    const normalizeRenderOptions = (
      source: MarkdownRenderOptions | undefined,
      defaultMode: MarkdownRenderMode
    ): MarkdownRenderOptions => {
      const options: MarkdownRenderOptions = {
        mode: source?.mode ?? defaultMode,
      };
      if (source?.streamdown) options.streamdown = source.streamdown;
      if (source?.components) options.components = source.components;
      if (source?.codeRenderer) options.codeRenderer = source.codeRenderer;
      if (source?.loadingSlot) options.loadingSlot = source.loadingSlot;
      if (source?.dynamic != null) options.dynamic = source.dynamic;
      if (source?.debounceMs != null) options.debounceMs = source.debounceMs;
      return options;
    };

    const ownRenderOptions = computed<MarkdownRenderOptions>(() => {
      const ownOptions: MarkdownRenderOptions = {
        mode: props.mode,
      };
      if (props.streamdown) ownOptions.streamdown = props.streamdown;
      if (props.components) ownOptions.components = props.components;
      if (props.codeRenderer) ownOptions.codeRenderer = props.codeRenderer;
      if (props.loadingSlot) ownOptions.loadingSlot = props.loadingSlot;
      if (props.dynamic != null) ownOptions.dynamic = props.dynamic;
      if (props.debounceMs != null) ownOptions.debounceMs = props.debounceMs;
      return normalizeRenderOptions(ownOptions, 'static');
    });

    const renderOptions = computed<MarkdownRenderOptions>(() => {
      if (context?.forceRenderOptions.value) {
        return normalizeRenderOptions(context.renderOptions.value, 'static');
      }

      return ownRenderOptions.value;
    });

    const renderState = context
      ? useMarkdownWorkerPool(markdownRef, context.pool, renderOptions)
      : useMarkdownParser(markdownRef, props.parserOptions, renderOptions);

    onErrorCaptured((err) => {
      renderError.value = toError(err);
      return false;
    });

    watch(markdownRef, () => {
      renderError.value = null;
    });

    const rootStyle = computed<StyleValue>(() => [
      githubContainerStyle,
      (attrs as Record<string, unknown>)['style'] as StyleValue,
    ]);
    const rootAttrs = computed(() => {
      const rawAttrs = attrs as Record<string, unknown>;
      const result = { ...rawAttrs };
      delete result['style'];
      return result;
    });

    const finalLoadingSlot = computed<LoadingSlot | undefined>(() => {
      // 优先使用 WorkerPoll 上下文的 loadingSlot
      const ctxLoadingSlot = context?.renderOptions.value?.loadingSlot;
      if (ctxLoadingSlot) return ctxLoadingSlot;
      // 其次使用 MarkdownRenderer 自身的 loadingSlot
      return props.loadingSlot;
    });

    const renderDefaultLoading = (): VNodeChild => (
      <div style={loadingStyle}>
        <svg width="16" height="16" viewBox="0 0 50 50" aria-hidden="true">
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="#57606a"
            stroke-width="4"
            stroke-linecap="round"
            stroke-dasharray="31.4 31.4"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 25 25"
              to="360 25 25"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
        <span>Rendering markdown...</span>
      </div>
    );

    const renderLoading = (): VNodeChild => {
      const customLoadingSlot = finalLoadingSlot.value;
      if (customLoadingSlot) {
        return h(customLoadingSlot as never);
      }
      // 使用默认的 loading 动画
      return renderDefaultLoading();
    };

    const renderErrorNotice = (error: Error): VNodeChild => (
      <div style={errorStyle}>
        <strong>Markdown render error:</strong> {error.message}
      </div>
    );

    return () => {
      const error = renderError.value ?? renderState.error.value;
      const content = renderState.content.value as VNodeChild | null;
      const showLoading = renderState.loading.value && !content && !error;
      return (
        <div {...rootAttrs.value} style={rootStyle.value}>
          {error ? renderErrorNotice(error) : showLoading ? renderLoading() : content}
        </div>
      );
    };
  },
});
