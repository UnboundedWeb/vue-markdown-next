import { defineComponent, provide, inject, InjectionKey, PropType, onBeforeUnmount } from 'vue';
import type { ParserOptions } from '@markdown-next/parser';
import { createWorkerPool, ParserWorkerPool, type WorkerPoolOptions } from '@markdown-next/parser';

/**
 * Worker Pool Context Injection Key
 */
export type WorkerPoolContext = {
  pool: ParserWorkerPool;
  options: ParserOptions;
};

export const WorkerPoolContextKey: InjectionKey<WorkerPoolContext> = Symbol('WorkerPoolContext');

/**
 * WorkerPoolProvider 组件
 *
 * 管理全局 Worker 池，子组件可以通过 inject 获取 Worker 池实例
 * 类似于 React 的 Provider 模式
 *
 * @example
 * ```vue
 * <template>
 *   <WorkerPoolProvider :worker-count="4" :extended-grammar="['gfm']">
 *     <MarkdownRenderer :content="markdown" />
 *   </WorkerPoolProvider>
 * </template>
 * ```
 */
export const WorkerPoolProvider = defineComponent({
  name: 'WorkerPoolProvider',

  props: {
    /**
     * Worker 数量
     */
    workerCount: {
      type: Number as PropType<number>,
      default: undefined,
    },

    /**
     * 自定义标签
     */
    customTags: {
      type: Array as PropType<string[]>,
      default: () => [],
    },

    /**
     * 扩展语法
     */
    extendedGrammar: {
      type: Array as PropType<('gfm' | 'mathjax')[]>,
      default: () => [],
    },

    /**
     * Remark 插件
     */
    remarkPlugins: {
      type: Array as PropType<ParserOptions['remarkPlugins']>,
      default: () => [],
    },

    /**
     * Rehype 插件
     */
    rehypePlugins: {
      type: Array as PropType<ParserOptions['rehypePlugins']>,
      default: () => [],
    },

    /**
     * MathJax 配置
     */
    mathJaxConfig: {
      type: Object as PropType<ParserOptions['mathJaxConfig']>,
      default: undefined,
    },

    /**
     * 是否支持 LaTeX 语法
     */
    supportsLaTeX: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { slots }) {
    // 创建 Worker 池选项
    const options: ParserOptions = {
      customTags: props.customTags,
      extendedGrammar: props.extendedGrammar,
      remarkPlugins: props.remarkPlugins,
      rehypePlugins: props.rehypePlugins,
      mathJaxConfig: props.mathJaxConfig,
      supportsLaTeX: props.supportsLaTeX,
    };

    // 创建 Worker 池实例
    const poolOptions: WorkerPoolOptions = {
      ...options,
    };
    if (props.workerCount !== undefined) {
      poolOptions.workerCount = props.workerCount;
    }
    const pool = createWorkerPool(poolOptions);

    // 提供 Worker 池上下文
    provide(WorkerPoolContextKey, {
      pool,
      options,
    });

    // 组件卸载时销毁 Worker 池
    onBeforeUnmount(() => {
      pool.destroy();
    });

    return () => {
      // 渲染默认插槽内容
      return slots['default']?.();
    };
  },
});

/**
 * 使用 Worker Pool Context
 *
 * 子组件可以使用此函数获取父级 WorkerPoolProvider 提供的 Worker 池
 *
 * @returns Worker Pool Context 或 null（如果未在 WorkerPoolProvider 内使用）
 *
 * @example
 * ```ts
 * const context = useWorkerPoolContext();
 * if (context) {
 *   const html = await context.pool.parseToHTML('# Hello');
 * }
 * ```
 */
export function useWorkerPoolContext(): WorkerPoolContext | null {
  return inject(WorkerPoolContextKey, null);
}
