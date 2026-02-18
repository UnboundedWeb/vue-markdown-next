import { Lexer } from 'marked';

const footnoteReferencePattern = /\[\^[\w-]{1,200}\](?!:)/;
const footnoteDefinitionPattern = /\[\^[\w-]{1,200}\]:/;
const openingTagPattern = /<(\w+)[\s>]/;

const voidElements = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

const openTagPatternCache = new Map<string, RegExp>();
const closeTagPatternCache = new Map<string, RegExp>();

const getOpenTagPattern = (tagName: string): RegExp => {
  const normalizedTag = tagName.toLowerCase();
  const cached = openTagPatternCache.get(normalizedTag);
  if (cached) return cached;
  const pattern = new RegExp(`<${normalizedTag}(?=[\\s>/])[^>]*>`, 'gi');
  openTagPatternCache.set(normalizedTag, pattern);
  return pattern;
};

const getCloseTagPattern = (tagName: string): RegExp => {
  const normalizedTag = tagName.toLowerCase();
  const cached = closeTagPatternCache.get(normalizedTag);
  if (cached) return cached;
  const pattern = new RegExp(`</${normalizedTag}(?=[\\s>])[^>]*>`, 'gi');
  closeTagPatternCache.set(normalizedTag, pattern);
  return pattern;
};

interface MarkdownToken {
  raw: string;
  type: string;
  block?: boolean;
}

const countNonSelfClosingOpenTags = (block: string, tagName: string): number => {
  if (voidElements.has(tagName.toLowerCase())) return 0;
  const matches = block.match(getOpenTagPattern(tagName));
  if (!matches) return 0;

  let count = 0;
  for (const match of matches) {
    if (!match.trimEnd().endsWith('/>')) {
      count += 1;
    }
  }
  return count;
};

const countClosingTags = (block: string, tagName: string): number => {
  const matches = block.match(getCloseTagPattern(tagName));
  return matches ? matches.length : 0;
};

const countDoubleDollars = (value: string): number => {
  let count = 0;
  for (let index = 0; index < value.length - 1; index += 1) {
    if (value[index] === '$' && value[index + 1] === '$') {
      count += 1;
      index += 1;
    }
  }
  return count;
};

export function parseMarkdownIntoBlocks(markdown: string): string[] {
  if (markdown.length === 0) return [];

  const hasFootnoteReference = footnoteReferencePattern.test(markdown);
  const hasFootnoteDefinition = footnoteDefinitionPattern.test(markdown);

  if (hasFootnoteReference || hasFootnoteDefinition) {
    return [markdown];
  }

  const tokens = Lexer.lex(markdown, { gfm: true }) as MarkdownToken[];
  const mergedBlocks: string[] = [];
  const htmlStack: string[] = [];
  let previousTokenWasCode = false;

  for (const token of tokens) {
    const currentBlock = token.raw;
    const mergedBlocksLen = mergedBlocks.length;

    if (htmlStack.length > 0) {
      const previousBlock = mergedBlocks[mergedBlocksLen - 1];
      if (previousBlock == null) {
        mergedBlocks.push(currentBlock);
        continue;
      }

      mergedBlocks[mergedBlocksLen - 1] = previousBlock + currentBlock;
      const closingMatches = currentBlock.matchAll(/<\/(\w+)>/g);
      for (const match of closingMatches) {
        const closingTag = match[1];
        if (htmlStack[htmlStack.length - 1] === closingTag) {
          htmlStack.pop();
        }
      }
      continue;
    }

    if (token.type === 'space') {
      if (mergedBlocksLen > 0) {
        const previousBlock = mergedBlocks[mergedBlocksLen - 1];
        if (previousBlock != null) {
          mergedBlocks[mergedBlocksLen - 1] = previousBlock + currentBlock;
        }
      }
      continue;
    }

    if (token.type === 'html' && token.block) {
      const openingTagMatch = currentBlock.match(openingTagPattern);
      const tagName = openingTagMatch?.[1];
      if (tagName) {
        const openTags = countNonSelfClosingOpenTags(currentBlock, tagName);
        const closeTags = countClosingTags(currentBlock, tagName);
        if (openTags > closeTags) {
          htmlStack.push(tagName);
        }
      }
    }

    if (mergedBlocksLen > 0 && !previousTokenWasCode) {
      const previousBlock = mergedBlocks[mergedBlocksLen - 1];
      if (previousBlock == null) {
        mergedBlocks.push(currentBlock);
        continue;
      }

      const previousDollarCount = countDoubleDollars(previousBlock);
      if (previousDollarCount % 2 === 1) {
        mergedBlocks[mergedBlocksLen - 1] = previousBlock + currentBlock;
        continue;
      }
    }

    mergedBlocks.push(currentBlock);
    if (token.type !== 'space') {
      previousTokenWasCode = token.type === 'code';
    }
  }

  return mergedBlocks;
}
