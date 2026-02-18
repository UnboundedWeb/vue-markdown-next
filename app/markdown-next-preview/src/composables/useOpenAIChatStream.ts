import { computed, onBeforeUnmount, ref } from 'vue';
import type { ComputedRef, Ref } from 'vue';

export interface OpenAIChatStreamRequest {
  apiBaseUrl: string;
  apiKey: string;
  model: string;
  userPrompt: string;
  systemPrompt?: string;
  temperature?: number;
}

interface OpenAIChunkChoice {
  delta?: {
    content?: string;
  };
}

interface OpenAIStreamChunk {
  choices?: OpenAIChunkChoice[];
  error?: {
    message?: string;
  };
}

function toChatCompletionsURL(apiBaseUrl: string): string {
  const normalized = apiBaseUrl.trim().replace(/\/+$/, '');
  if (normalized.endsWith('/chat/completions')) {
    return normalized;
  }
  return `${normalized}/chat/completions`;
}

interface UseOpenAIChatStreamResult {
  output: Ref<string>;
  isStreaming: Ref<boolean>;
  error: Ref<string | null>;
  chunkCount: Ref<number>;
  startedAt: Ref<number | null>;
  finishedAt: Ref<number | null>;
  elapsedMs: ComputedRef<number>;
  // eslint-disable-next-line no-unused-vars
  start: (request: OpenAIChatStreamRequest) => Promise<void>;
  stop: () => void;
  clear: () => void;
}

async function readErrorMessage(response: globalThis.Response): Promise<string> {
  const payload = await response.text();
  if (payload.length === 0) return '';
  try {
    const parsed = JSON.parse(payload) as { error?: { message?: string } };
    return parsed.error?.message ?? payload;
  } catch {
    return payload;
  }
}

export function useOpenAIChatStream(): UseOpenAIChatStreamResult {
  const output = ref('');
  const isStreaming = ref(false);
  const error = ref<string | null>(null);
  const chunkCount = ref(0);
  const startedAt = ref<number | null>(null);
  const finishedAt = ref<number | null>(null);
  const elapsedMs = computed<number>(() => {
    if (startedAt.value == null) return 0;
    const end = finishedAt.value ?? Date.now();
    return Math.max(0, end - startedAt.value);
  });

  let activeController: globalThis.AbortController | null = null;

  const stop = (): void => {
    if (activeController) {
      activeController.abort();
      activeController = null;
    }
  };

  const clear = (): void => {
    output.value = '';
    error.value = null;
    chunkCount.value = 0;
    startedAt.value = null;
    finishedAt.value = null;
  };

  const start = async (request: OpenAIChatStreamRequest): Promise<void> => {
    const apiBaseUrl = request.apiBaseUrl.trim();
    const apiKey = request.apiKey.trim();
    const model = request.model.trim();
    const userPrompt = request.userPrompt.trim();
    const systemPrompt = request.systemPrompt?.trim() ?? '';

    if (!apiBaseUrl) throw new Error('API Base URL is required.');
    if (!apiKey) throw new Error('API Key is required.');
    if (!model) throw new Error('Model is required.');
    if (!userPrompt) throw new Error('Prompt is required.');

    if (isStreaming.value) {
      stop();
    }

    clear();
    isStreaming.value = true;
    startedAt.value = Date.now();
    finishedAt.value = null;

    const controller = new globalThis.AbortController();
    activeController = controller;

    try {
      const response = await globalThis.fetch(toChatCompletionsURL(apiBaseUrl), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          stream: true,
          temperature: request.temperature ?? 0.7,
          messages: [
            ...(systemPrompt
              ? [
                  {
                    role: 'system',
                    content: systemPrompt,
                  },
                ]
              : []),
            {
              role: 'user',
              content: userPrompt,
            },
          ],
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const details = await readErrorMessage(response);
        throw new Error(`OpenAI request failed (${response.status}): ${details}`);
      }

      if (!response.body) {
        throw new Error('OpenAI response does not contain a stream body.');
      }

      const reader = response.body.getReader();
      const decoder = new globalThis.TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        while (true) {
          const newlineIndex = buffer.indexOf('\n');
          if (newlineIndex === -1) break;

          const line = buffer.slice(0, newlineIndex).trim();
          buffer = buffer.slice(newlineIndex + 1);

          if (line.length === 0 || !line.startsWith('data:')) {
            continue;
          }

          const payload = line.slice(5).trim();
          if (payload === '[DONE]') {
            finishedAt.value = Date.now();
            return;
          }

          try {
            const chunk = JSON.parse(payload) as OpenAIStreamChunk;
            const streamError = chunk.error?.message;
            if (streamError) throw new Error(streamError);

            const delta = chunk.choices?.[0]?.delta?.content;
            if (typeof delta === 'string' && delta.length > 0) {
              output.value += delta;
              chunkCount.value += 1;
            }
          } catch (parseError) {
            throw parseError instanceof Error ? parseError : new Error(String(parseError));
          }
        }
      }
    } catch (streamError) {
      if (controller.signal.aborted) {
        return;
      }
      error.value = streamError instanceof Error ? streamError.message : String(streamError);
    } finally {
      if (activeController === controller) {
        activeController = null;
      }
      isStreaming.value = false;
      finishedAt.value = Date.now();
    }
  };

  onBeforeUnmount(() => {
    stop();
  });

  return {
    output,
    isStreaming,
    error,
    chunkCount,
    startedAt,
    finishedAt,
    elapsedMs,
    start,
    stop,
    clear,
  };
}
