import type { Root } from 'hast';
import { describe, expect, it } from 'vitest';
import { createStreamdownRenderer } from '../../src/streamdown/createStreamdownRenderer';

function createTextTree(content: string): Root {
  return {
    type: 'root',
    children: [{ type: 'text', value: content }],
  };
}

describe('createStreamdownRenderer', () => {
  it('reuses unchanged blocks in streaming mode', async () => {
    const parsedInputs: string[] = [];
    const renderer = createStreamdownRenderer({
      parseToHAST: async (markdown: string) => {
        parsedInputs.push(markdown);
        return createTextTree(markdown);
      },
    });

    await renderer.render('alpha\n\nbeta\n\ngamma', { mode: 'streaming' });
    expect(parsedInputs).toHaveLength(3);

    await renderer.render('alpha\n\nbeta updated\n\ngamma', { mode: 'streaming' });
    expect(parsedInputs).toHaveLength(4);
    expect(parsedInputs[3]).toContain('beta updated');
  });

  it('repairs incomplete markdown in streaming mode by default', async () => {
    const parsedInputs: string[] = [];
    const renderer = createStreamdownRenderer({
      parseToHAST: async (markdown: string) => {
        parsedInputs.push(markdown);
        return createTextTree(markdown);
      },
    });

    await renderer.render('This is **bold', { mode: 'streaming' });
    expect(parsedInputs[0]).toContain('**bold**');
  });

  it('can disable incomplete markdown repair', async () => {
    const parsedInputs: string[] = [];
    const renderer = createStreamdownRenderer({
      parseToHAST: async (markdown: string) => {
        parsedInputs.push(markdown);
        return createTextTree(markdown);
      },
    });

    await renderer.render('This is **bold', {
      mode: 'streaming',
      streamdown: {
        parseIncompleteMarkdown: false,
      },
    });

    expect(parsedInputs[0]).toBe('This is **bold');
  });
});
