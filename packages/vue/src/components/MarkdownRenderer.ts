import { defineComponent, ref, watch, PropType, h, Component } from 'vue';
import type { VNode } from 'vue';
import type { ParserOptions } from '@markdown-next/parser';
import type { ComponentsMap } from '../types';
import { useWorkerPoolContext } from './WorkerPoolProvider';
import { useParser } from '../hooks/useParser';
import { hastToVNode } from '../utils/hastToVNode';
import { DefaultLoading } from './DefaultLoading';
import { DefaultError } from './DefaultError';

/**
 * MarkdownRenderer 组件
 *
 * 渲染 Markdown 内容为 Vue VNode
 * - 如果在 WorkerPoolProvider 内，使用 Worker 池进行多线程渲染
 * - 否则使用单线程渲染
 * - 支持自定义组件映射
 * - 支持 loading 和错误边界
 *
 * @example
 * ```vue
 * <template>
 *   <!-- 单线程模式 -->
 *   <MarkdownRenderer
 *     :content="markdown"
 *     :extended-grammar="['gfm']"
 *     :components="{ h1: 'h2', em: CustomEm }"
 *   />
 *
 *   <!-- 多线程模式（需要在 WorkerPoolProvider 内） -->
 *   <WorkerPoolProvider :worker-count="4">
 *     <MarkdownRenderer :content="markdown" />
 *   </WorkerPoolProvider>
 * </template>
 * ```
 */
export const MarkdownRenderer = defineComponent({
  name: 'MarkdownRenderer',

  props: {
    /**
     * Markdown 内容
     */
    content: {
      type: String,
      required: true,
    },

    /**
     * 自定义组件映射
     */
    components: {
      type: Object as PropType<ComponentsMap>,
      default: () => ({}),
    },

    /**
     * 自定义 Loading 组件
     */
    loadingComponent: {
      type: Object as PropType<Component>,
      default: () => DefaultLoading,
    },

    /**
     * 自定义错误组件
     */
    errorComponent: {
      type: Object as PropType<Component>,
      default: () => DefaultError,
    },

    // 以下是解析器选项，仅在单线程模式下生效
    // 如果在 WorkerPoolProvider 内，这些选项会被忽略

    /**
     * 自定义标签（仅单线程模式）
     */
    customTags: {
      type: Array as PropType<string[]>,
      default: () => [],
    },

    /**
     * 扩展语法（仅单线程模式）
     */
    extendedGrammar: {
      type: Array as PropType<('gfm' | 'mathjax')[]>,
      default: () => [],
    },

    /**
     * Remark 插件（仅单线程模式）
     */
    remarkPlugins: {
      type: Array as PropType<ParserOptions['remarkPlugins']>,
      default: () => [],
    },

    /**
     * Rehype 插件（仅单线程模式）
     */
    rehypePlugins: {
      type: Array as PropType<ParserOptions['rehypePlugins']>,
      default: () => [],
    },

    /**
     * MathJax 配置（仅单线程模式）
     */
    mathJaxConfig: {
      type: Object as PropType<ParserOptions['mathJaxConfig']>,
      default: undefined,
    },

    /**
     * 是否支持 LaTeX 语法（仅单线程模式）
     */
    supportsLaTeX: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    // 检查是否在 WorkerPoolProvider 内
    const workerPoolContext = useWorkerPoolContext();

    // 状态
    const loading = ref(false);
    const error = ref<Error | null>(null);
    const vnode = ref<VNode | VNode[] | string | null>(null);

    // 如果不在 WorkerPoolProvider 内，创建单线程解析器
    let parser: ReturnType<typeof useParser> | null = null;
    if (!workerPoolContext) {
      const options: ParserOptions = {
        customTags: props.customTags,
        extendedGrammar: props.extendedGrammar,
        remarkPlugins: props.remarkPlugins,
        rehypePlugins: props.rehypePlugins,
        mathJaxConfig: props.mathJaxConfig,
        supportsLaTeX: props.supportsLaTeX,
      };
      parser = useParser(options);
    }

    /**
     * 渲染 Markdown
     */
    const render = async (): Promise<void> => {
      if (!props.content) {
        vnode.value = null;
        return;
      }

      loading.value = true;
      error.value = null;

      try {
        let hast;

        if (workerPoolContext) {
          // 使用 Worker 池（多线程）
          hast = await workerPoolContext.pool.parseToHAST(props.content);
        } else if (parser) {
          // 使用单线程解析器
          hast = await parser.parseToHAST(props.content);
        } else {
          throw new Error('No parser available');
        }

        // 将 HAST 转换为 VNode
        vnode.value = hastToVNode(hast, props.components);
      } catch (err) {
        error.value = err as Error;
      } finally {
        loading.value = false;
      }
    };

    // 监听 content 变化
    watch(
      () => props.content,
      () => {
        render();
      },
      { immediate: true }
    );

    // 监听 components 变化（需要重新渲染）
    watch(
      () => props.components,
      () => {
        render();
      },
      { deep: true }
    );

    return () => {
      // 显示 Loading
      if (loading.value) {
        return h(props.loadingComponent);
      }

      // 显示错误
      if (error.value) {
        return h(props.errorComponent, { error: error.value });
      }

      // 渲染内容
      if (vnode.value) {
        return vnode.value;
      }

      // 空内容
      return null;
    };
  },
});
