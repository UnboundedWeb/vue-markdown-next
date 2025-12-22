/* eslint-env node */
import { describe, it, beforeEach, expect } from 'vitest';
import type { Processor } from 'unified';
import type { Root } from 'hast';
import { getParser } from '../src';
import { testParserConfig } from './defautlConfig';

type HtmlProcessor = Processor<Root, Root, Root, Root, string>;

const prettyPrint = (label: string, markdown: string, html: string): void => {
  console.log(`\n[${label}] 输入:\n${markdown}\n--------\n输出:\n${html}\n--------`);
};

describe('getParser 输出示例', () => {
  let parser: HtmlProcessor;

  beforeEach(() => {
    parser = getParser('html', testParserConfig);
  });

  const logHtml = async (
    label: string,
    markdown: string,
    currentParser: HtmlProcessor = parser
  ): Promise<void> => {
    const file = await currentParser.process(markdown);
    const html = String(file);
    prettyPrint(label, markdown, html);
  };

  describe('基础 Markdown 转换', () => {
    const cases = [
      {
        name: '标题',
        markdown: '# 标题1\n## 标题2\n### 标题3',
      },
      {
        name: '段落',
        markdown: '这是第一段。\n\n这是第二段。',
      },
      {
        name: '加粗和斜体',
        markdown: '**加粗文本** *斜体文本* ***加粗斜体***',
      },
      {
        name: '行内代码',
        markdown: '这是 `行内代码` 示例',
      },
      {
        name: '代码块',
        markdown: '```javascript\nconsole.log("Hello World");\n```',
      },
      {
        name: '有序列表',
        markdown: '1. 第一项\n2. 第二项\n3. 第三项',
      },
      {
        name: '无序列表',
        markdown: '- 第一项\n- 第二项\n- 第三项',
      },
      {
        name: '链接与图片',
        markdown: '[链接文本](https://example.com)\n\n![替代文本](https://example.com/image.png)',
      },
      {
        name: '引用块与分割线',
        markdown: '> 这是一个引用\n> 第二行引用\n\n---',
      },
    ];

    cases.forEach(({ name, markdown }) => {
      it(`打印${name}结果`, async () => {
        await logHtml(`基础-${name}`, markdown);
      });
    });
  });

  describe('GFM (GitHub Flavored Markdown) 支持', () => {
    const cases = [
      {
        name: '删除线',
        markdown: '~~删除线文本~~',
      },
      {
        name: '表格',
        markdown: `| 列1 | 列2 |
| --- | --- |
| 单元格1 | 单元格2 |
| 单元格3 | 单元格4 |`,
      },
      {
        name: '任务列表',
        markdown: '- [ ] 未完成任务\n- [x] 已完成任务',
      },
      {
        name: '自动链接',
        markdown: 'https://example.com',
      },
    ];

    cases.forEach(({ name, markdown }) => {
      it(`打印${name}结果`, async () => {
        await logHtml(`GFM-${name}`, markdown);
      });
    });
  });

  describe('数学公式支持', () => {
    it('打印行内数学公式结果', async () => {
      await logHtml('Math-行内', '这是一个行内公式 \\(x^2 + y^2 = z^2\\)');
    });

    it('打印块级数学公式结果', async () => {
      await logHtml('Math-块级', '$$\n\\frac{1}{2}\n$$');
    });

    it('支持 \\(...\\) 行内语法', async () => {
      const file = await parser.process('这是一个行内公式 \\(x^2 + y^2 = z^2\\)');
      expect(String(file)).toContain('<mjx-container');
    });

    it('支持 \\[...\\] 块级语法', async () => {
      const file = await parser.process('\\[\\frac{1}{2}\\]');
      expect(String(file)).toContain('display="true"');
    });

    it('不转换 \\\\(...\\\\) 转义情况', async () => {
      const file = await parser.process('这是字面量 \\\\(...\\\\)');
      const html = String(file);
      expect(html).not.toContain('<mjx-container');
      expect(html).toContain('\\(');
    });
  });

  describe('HTML 内容处理', () => {
    it('打印安全 HTML 标签', async () => {
      await logHtml('HTML-安全标签', '<div>这是一个 div</div>');
    });

    it('打印混合 Markdown 与 HTML', async () => {
      await logHtml('HTML-混合内容', '<div>\n\n# 标题\n\n**加粗文本**\n\n</div>');
    });

    it('打印危险标签过滤结果', async () => {
      await logHtml('HTML-危险标签', '<script>alert("XSS")</script>');
    });

    it('打印危险属性过滤结果', async () => {
      await logHtml('HTML-危险属性', '<div onclick="alert(\'XSS\')">测试</div>');
    });
  });

  describe('自定义标签处理', () => {
    it('打印单个自定义标签', async () => {
      const customParser = getParser('html', {
        customTags: ['custom-component'],
      });
      await logHtml(
        'Custom-单标签',
        '<custom-component>自定义内容</custom-component>',
        customParser
      );
    });

    it('打印多个自定义标签', async () => {
      const customParser = getParser('html', {
        customTags: ['custom-one', 'custom-two'],
      });
      await logHtml(
        'Custom-多标签',
        '<custom-one>内容1</custom-one>\n<custom-two>内容2</custom-two>',
        customParser
      );
    });
  });

  describe('复杂场景', () => {
    it('打印嵌套列表结果', async () => {
      const markdown = `- 第一级
  - 第二级
    - 第三级
  - 第二级
- 第一级`;
      await logHtml('Complex-嵌套列表', markdown);
    });

    it('打印混合内容文档', async () => {
      const markdown = `# 文档标题

这是一个包含**加粗**和*斜体*的段落。

## 代码示例

\`\`\`javascript
function hello() {
  console.log("Hello World");
}
\`\`\`

## 列表

1. 第一项
   - 子项 A
   - 子项 B
2. 第二项

## 表格

| 名称 | 值 |
| --- | --- |
| A | 1 |
| B | 2 |

> 这是一个引用

[链接](https://example.com)`;
      await logHtml('Complex-混合文档', markdown);
    });
  });

  describe('返回类型演示', () => {
    it('打印 HTML 解析结果', async () => {
      const htmlParser = getParser('html', {
        customTags: [],
      });
      await logHtml('ReturnType-HTML', '# 测试', htmlParser);
    });

    it('打印 HAST 解析结果', async () => {
      const astParser = getParser('hast', {
        customTags: [],
      });
      const markdown = '# HAST';
      const mdast = astParser.parse(markdown);
      const tree = (await astParser.run(mdast)) as unknown;
      console.log(
        `\n[ReturnType-HAST] 输入:\n${markdown}\n--------\n输出 AST:\n${JSON.stringify(
          tree,
          null,
          2
        )}\n--------`
      );
    });
  });

  describe('边缘情况', () => {
    const cases = [
      { name: '空字符串', markdown: '' },
      { name: '空白字符串', markdown: '   \n   \t   ' },
      { name: '特殊字符', markdown: `< > & " '` },
      { name: 'Emoji', markdown: '😀 🎉 👍' },
      { name: '超长文本', markdown: `# ${'a'.repeat(10000)}` },
    ];

    cases.forEach(({ name, markdown }) => {
      it(`打印${name}结果`, async () => {
        await logHtml(`Edge-${name}`, markdown);
      });
    });
  });
  describe('自定义标签保留', () => {
    const cases = [
      { name: 'custom', markdown: '<vue-markdown-next></vue-markdown-next>' },
      { name: 'hazardFiltering', markdown: '<hazar.suspense></hazar.suspense>' },
    ];

    cases.forEach(({ name, markdown }) => {
      it(`打印${name}自定义情况`, async () => {
        await logHtml(`customer-${name}`, markdown);
      });
    });
  });
});
