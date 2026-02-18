import { onBeforeUnmount, ref, shallowRef, unref, watch } from 'vue';
import type { Ref, ShallowRef, VNodeChild } from 'vue';
import type { MarkdownRenderOptions, UseMarkdownResult } from '../types';
import { toError } from '../utils/toError';

export type MaybeRef<T> = T | Ref<T>;

export function useMarkdownRender(
  markdown: MaybeRef<string>,
  // eslint-disable-next-line no-unused-vars
  render: (value: string, options?: MarkdownRenderOptions) => Promise<VNodeChild>,
  renderOptions?: MaybeRef<MarkdownRenderOptions | undefined>
): UseMarkdownResult<ShallowRef<VNodeChild | null>> {
  const content = shallowRef<VNodeChild | null>(null);
  const loading = ref(false);
  const error = ref<Error | null>(null);
  let timer: ReturnType<typeof globalThis.setTimeout> | null = null;
  let taskId = 0;

  const run = async (value: string, options?: MarkdownRenderOptions): Promise<void> => {
    const currentTask = ++taskId;
    loading.value = true;
    error.value = null;
    try {
      const rendered = await render(value, options);
      if (currentTask === taskId) {
        content.value = rendered;
      }
    } catch (err) {
      if (currentTask === taskId) {
        error.value = toError(err);
      }
    } finally {
      if (currentTask === taskId) {
        loading.value = false;
      }
    }
  };

  const schedule = (value: string, options?: MarkdownRenderOptions): void => {
    const mode = options?.mode ?? 'static';
    const dynamic = options?.dynamic ?? mode === 'streaming';
    const debounceMs = options?.debounceMs ?? (mode === 'streaming' ? 80 : 250);

    if (timer != null) {
      globalThis.clearTimeout(timer);
      timer = null;
    }

    if (dynamic) {
      timer = globalThis.setTimeout(() => {
        void run(value, options);
      }, debounceMs);
      return;
    }

    void run(value, options);
  };

  watch(
    () => [unref(markdown), renderOptions ? unref(renderOptions) : undefined] as const,
    ([value, options]) => {
      schedule(value ?? '', options);
    },
    { immediate: true, deep: true }
  );

  onBeforeUnmount(() => {
    if (timer != null) {
      globalThis.clearTimeout(timer);
    }
  });

  return {
    content,
    loading,
    error,
  };
}
