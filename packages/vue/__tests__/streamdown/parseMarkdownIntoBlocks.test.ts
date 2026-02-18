import { describe, expect, it } from 'vitest';
import { parseMarkdownIntoBlocks } from '../../src/streamdown/parseMarkdownIntoBlocks';

describe('parseMarkdownIntoBlocks', () => {
  it('splits plain markdown into paragraph-level blocks', () => {
    const blocks = parseMarkdownIntoBlocks('alpha\n\nbeta\n\ngamma');
    expect(blocks).toHaveLength(3);
    expect(blocks[0]).toContain('alpha');
    expect(blocks[1]).toContain('beta');
    expect(blocks[2]).toContain('gamma');
  });

  it('keeps footnotes in a single block', () => {
    const markdown = 'Footnote[^1]\n\n[^1]: detail';
    const blocks = parseMarkdownIntoBlocks(markdown);
    expect(blocks).toEqual([markdown]);
  });

  it('merges split html blocks until the closing tag appears', () => {
    const markdown = '<div>\n\ninner\n\n</div>\n\nnext';
    const blocks = parseMarkdownIntoBlocks(markdown);
    expect(blocks).toHaveLength(2);
    expect(blocks[0]).toContain('<div>');
    expect(blocks[0]).toContain('</div>');
    expect(blocks[1]).toContain('next');
  });
});
