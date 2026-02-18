import type { Root } from 'hast';
import remend from 'remend';
import { Fragment, h } from 'vue';
import { renderHastToVue } from '../render/hastToVue';
import type {
  MarkdownRenderMode,
  MarkdownRenderOptions,
  MarkdownStreamdownOptions,
} from '../types';
import { parseMarkdownIntoBlocks } from './parseMarkdownIntoBlocks';
import type { StreamdownHASTParser, StreamdownRenderer } from './types';

interface CachedBlock {
  source: string;
  tree: Root;
}

interface StreamdownEdges {
  prefix: number;
  suffix: number;
}

function resolveMode(options?: MarkdownRenderOptions): MarkdownRenderMode {
  return options?.mode ?? 'static';
}

function preprocessStreamingMarkdown(
  markdown: string,
  options?: MarkdownStreamdownOptions
): string {
  const parseIncompleteMarkdown = options?.parseIncompleteMarkdown ?? true;
  if (!parseIncompleteMarkdown || markdown.length === 0) {
    return markdown;
  }
  return remend(markdown);
}

function getReusableEdges(
  previous: readonly CachedBlock[],
  nextSources: readonly string[]
): StreamdownEdges {
  let prefix = 0;
  const maxPrefix = Math.min(previous.length, nextSources.length);

  while (prefix < maxPrefix) {
    const previousSource = previous[prefix]?.source;
    const nextSource = nextSources[prefix] ?? '';
    if (previousSource !== nextSource) break;
    prefix += 1;
  }

  let suffix = 0;
  const maxSuffix = Math.min(previous.length, nextSources.length) - prefix;
  while (suffix < maxSuffix) {
    const previousSource = previous[previous.length - 1 - suffix]?.source;
    const nextSource = nextSources[nextSources.length - 1 - suffix] ?? '';
    if (previousSource !== nextSource) break;
    suffix += 1;
  }

  return { prefix, suffix };
}

async function parseBlocksWithCache(
  sources: readonly string[],
  previous: readonly CachedBlock[],
  parser: StreamdownHASTParser
): Promise<CachedBlock[]> {
  if (sources.length === 0) return [];

  const nextBlocks: Array<CachedBlock | undefined> = new Array(sources.length);
  const { prefix, suffix } = getReusableEdges(previous, sources);

  for (let index = 0; index < prefix; index += 1) {
    const previousBlock = previous[index];
    if (previousBlock) {
      nextBlocks[index] = previousBlock;
    }
  }

  for (let offset = 0; offset < suffix; offset += 1) {
    const previousIndex = previous.length - suffix + offset;
    const nextIndex = sources.length - suffix + offset;
    const previousBlock = previous[previousIndex];
    if (previousBlock) {
      nextBlocks[nextIndex] = previousBlock;
    }
  }

  const parseTasks: Array<Promise<void>> = [];
  for (let index = prefix; index < sources.length - suffix; index += 1) {
    const source = sources[index] ?? '';
    parseTasks.push(
      parser.parseToHAST(source).then((tree) => {
        nextBlocks[index] = { source, tree };
      })
    );
  }

  if (parseTasks.length > 0) {
    await Promise.all(parseTasks);
  }

  for (let index = 0; index < nextBlocks.length; index += 1) {
    if (nextBlocks[index]) continue;
    const source = sources[index] ?? '';
    const tree = await parser.parseToHAST(source);
    nextBlocks[index] = { source, tree };
  }

  return nextBlocks as CachedBlock[];
}

export function createStreamdownRenderer(parser: StreamdownHASTParser): StreamdownRenderer {
  let cachedBlocks: CachedBlock[] = [];

  return {
    async render(markdown, options) {
      const mode = resolveMode(options);
      if (mode !== 'streaming') {
        cachedBlocks = [];
        const tree = await parser.parseToHAST(markdown);
        return renderHastToVue(tree, options);
      }

      const preprocessedMarkdown = preprocessStreamingMarkdown(markdown, options?.streamdown);
      const blockSources = parseMarkdownIntoBlocks(preprocessedMarkdown);
      cachedBlocks = await parseBlocksWithCache(blockSources, cachedBlocks, parser);

      if (cachedBlocks.length === 0) return null;
      const renderedBlocks = cachedBlocks.map((block) => renderHastToVue(block.tree, options));
      return h(Fragment, null, renderedBlocks);
    },
    reset() {
      cachedBlocks = [];
    },
  };
}
