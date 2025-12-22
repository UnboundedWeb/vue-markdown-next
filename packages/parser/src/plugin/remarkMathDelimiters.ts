import type { Processor } from 'unified';

const countPrecedingBackslashes = (input: string, index: number): number => {
  let count = 0;
  for (let i = index - 1; i >= 0 && input[i] === '\\'; i--) count++;
  return count;
};

const isUnescapedDelimiter = (input: string, index: number, nextChar: string): boolean => {
  if (input[index] !== '\\' || input[index + 1] !== nextChar) return false;
  return countPrecedingBackslashes(input, index) % 2 === 0;
};

const findClosingDelimiter = (input: string, fromIndex: number, closeChar: ')' | ']'): number => {
  for (let i = fromIndex; i < input.length - 1; i++) {
    if (isUnescapedDelimiter(input, i, closeChar)) return i;
  }
  return -1;
};

const isLineStart = (input: string, index: number): boolean =>
  index === 0 || input[index - 1] === '\n';

const scanFence = (
  input: string,
  index: number
): { fenceChar: '`' | '~'; fenceLength: number } | null => {
  const char = input[index];
  if (char !== '`' && char !== '~') return null;
  let fenceLength = 0;
  for (let i = index; i < input.length && input[i] === char; i++) fenceLength++;
  if (fenceLength < 3) return null;
  return { fenceChar: char, fenceLength };
};

const isIndentedCodeLine = (input: string, index: number): boolean => {
  if (!isLineStart(input, index)) return false;
  if (input[index] === '\t') return true;
  return input.slice(index, index + 4) === '    ';
};

export const normalizeLatexParensMath = (input: string): string => {
  let output = '';

  let inFencedCodeBlock = false;
  let fenceChar: '`' | '~' | null = null;
  let fenceLength = 0;

  let inInlineCode = false;
  let inlineCodeTickLength = 0;

  for (let i = 0; i < input.length; ) {
    if (!inFencedCodeBlock && !inInlineCode && isIndentedCodeLine(input, i)) {
      const end = input.indexOf('\n', i);
      if (end === -1) return output + input.slice(i);
      output += input.slice(i, end + 1);
      i = end + 1;
      continue;
    }

    if (!inInlineCode && isLineStart(input, i)) {
      const fence = scanFence(input, i);
      if (fence) {
        if (!inFencedCodeBlock) {
          inFencedCodeBlock = true;
          fenceChar = fence.fenceChar;
          fenceLength = fence.fenceLength;
        } else if (fenceChar === fence.fenceChar && fence.fenceLength >= fenceLength) {
          inFencedCodeBlock = false;
          fenceChar = null;
          fenceLength = 0;
        }

        const end = input.indexOf('\n', i);
        if (end === -1) return output + input.slice(i);
        output += input.slice(i, end + 1);
        i = end + 1;
        continue;
      }
    }

    if (!inFencedCodeBlock) {
      if (!inInlineCode && input[i] === '`') {
        let ticks = 0;
        for (let j = i; j < input.length && input[j] === '`'; j++) ticks++;
        inInlineCode = true;
        inlineCodeTickLength = ticks;
        output += input.slice(i, i + ticks);
        i += ticks;
        continue;
      }

      if (inInlineCode) {
        if (input[i] === '`') {
          let ticks = 0;
          for (let j = i; j < input.length && input[j] === '`'; j++) ticks++;
          if (ticks >= inlineCodeTickLength) {
            output += input.slice(i, i + inlineCodeTickLength);
            i += inlineCodeTickLength;
            inInlineCode = false;
            inlineCodeTickLength = 0;
            continue;
          }
        }
        output += input[i];
        i++;
        continue;
      }
    }

    if (!inFencedCodeBlock && !inInlineCode) {
      if (isUnescapedDelimiter(input, i, '(')) {
        const closeIndex = findClosingDelimiter(input, i + 2, ')');
        if (closeIndex !== -1) {
          const inner = input.slice(i + 2, closeIndex);
          output += `$${inner}$`;
          i = closeIndex + 2;
          continue;
        }
      }

      if (isUnescapedDelimiter(input, i, '[')) {
        const closeIndex = findClosingDelimiter(input, i + 2, ']');
        if (closeIndex !== -1) {
          const inner = input.slice(i + 2, closeIndex);
          const start = inner.startsWith('\n') ? '' : '\n';
          const end = inner.endsWith('\n') ? '' : '\n';
          output += `$$${start}${inner}${end}$$`;
          i = closeIndex + 2;
          continue;
        }
      }
    }

    output += input[i];
    i++;
  }

  return output;
};

// eslint-disable-next-line no-unused-vars
export const remarkMathDelimiters = function remarkMathDelimiters(this: Processor): void {
  const currentParser = this.parser || this.Parser;
  if (!currentParser) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  this.Parser = function wrappedParser(document: unknown, file: any) {
    let nextDocument = document;
    if (typeof document === 'string') {
      const normalized = normalizeLatexParensMath(document);
      nextDocument = normalized;
      if (file && typeof file.value === 'string') file.value = normalized;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return currentParser(nextDocument as any, file);
  } as unknown as Processor['Parser'];

  if (this.parser) this.parser = this.Parser as unknown as typeof this.parser;
};
