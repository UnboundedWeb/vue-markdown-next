import { describe, it, expect, beforeEach } from 'vitest';
import type { Processor } from 'unified';
import type { Root } from 'hast';
import { getParser } from '../src';

describe('getParser', () => {
  let parser: Processor<Root, Root, Root, Root, string>;

  beforeEach(() => {
    // 创建一个基础的 parser 实例
    parser = getParser('html', {
      customTags: [],
      extends: [],
    });
  });

  describe('基础 Markdown 转换', () => {
    it('应该将标题转换为 HTML', async () => {
      const markdown = '# 标题1\n## 标题2\n### 标题3';
      const result = await parser.process(markdown);
      const html = String(result);

      expect(html).toContain('<h1>标题1</h1>');
      expect(html).toContain('<h2>标题2</h2>');
      expect(html).toContain('<h3>标题3</h3>');
    });

    it('应该将段落转换为 HTML', async () => {
      const markdown = '这是第一段。\n\n这是第二段。';
      const result = await parser.process(markdown);
      const html = String(result);

      expect(html).toContain('<p>这是第一段。</p>');
      expect(html).toContain('<p>这是第二段。</p>');
    });

    it('应该处理加粗和斜体文本', async () => {
      const markdown = '**加粗文本** *斜体文本* ***加粗斜体***';
      const result = await parser.process(markdown);
      const html = String(result);

      expect(html).toContain('<strong>加粗文本</strong>');
      expect(html).toContain('<em>斜体文本</em>');
      expect(html).toContain('<strong><em>加粗斜体</em></strong>');
    });

    it('应该处理行内代码', async () => {
      const markdown = '这是 `行内代码` 示例';
      const result = await parser.process(markdown);
      const html = String(result);

      expect(html).toContain('<code>行内代码</code>');
    });

    it('应该处理代码块', async () => {
      const markdown = '```javascript\nconsole.log("Hello World");\n```';
      const result = await parser.process(markdown);
      const html = String(result);

      expect(html).toContain('<pre>');
      expect(html).toContain('<code');
      expect(html).toContain('console.log("Hello World");');
    });

    it('应该处理有序列表', async () => {
      const markdown = '1. 第一项\n2. 第二项\n3. 第三项';
      const result = await parser.process(markdown);
      const html = String(result);

      expect(html).toContain('<ol>');
      expect(html).toContain('<li>第一项</li>');
      expect(html).toContain('<li>第二项</li>');
      expect(html).toContain('<li>第三项</li>');
      expect(html).toContain('</ol>');
    });

    it('应该处理无序列表', async () => {
      const markdown = '- 第一项\n- 第二项\n- 第三项';
      const result = await parser.process(markdown);
      const html = String(result);

      expect(html).toContain('<ul>');
      expect(html).toContain('<li>第一项</li>');
      expect(html).toContain('<li>第二项</li>');
      expect(html).toContain('<li>第三项</li>');
      expect(html).toContain('</ul>');
    });

    it('应该处理链接', async () => {
      const markdown = '[链接文本](https://example.com)';
      const result = await parser.process(markdown);
      const html = String(result);

      expect(html).toContain('<a href="https://example.com">链接文本</a>');
    });

    it('应该处理图片', async () => {
      const markdown = '![替代文本](https://example.com/image.png)';
      const result = await parser.process(markdown);
      const html = String(result);

      expect(html).toContain('<img src="https://example.com/image.png" alt="替代文本">');
    });

    it('应该处理引用块', async () => {
      const markdown = '> 这是一个引用\n> 第二行引用';
      const result = await parser.process(markdown);
      const html = String(result);

      expect(html).toContain('<blockquote>');
      expect(html).toContain('这是一个引用');
      expect(html).toContain('</blockquote>');
    });

    it('应该处理水平分割线', async () => {
      const markdown = '---';
      const result = await parser.process(markdown);
      const html = String(result);

      expect(html).toContain('<hr>');
    });
  });

  describe('GFM (GitHub Flavored Markdown) 支持', () => {
    it('应该处理删除线', async () => {
      const markdown = '~~删除线文本~~';
      const result = await parser.process(markdown);
      const html = String(result);

      expect(html).toContain('<del>删除线文本</del>');
    });

    it('应该处理表格', async () => {
      const markdown = `| 列1 | 列2 |
| --- | --- |
| 单元格1 | 单元格2 |
| 单元格3 | 单元格4 |`;
      const result = await parser.process(markdown);
      const html = String(result);

      expect(html).toContain('<table>');
      expect(html).toContain('<thead>');
      expect(html).toContain('<tbody>');
      expect(html).toContain('<th>列1</th>');
      expect(html).toContain('<th>列2</th>');
      expect(html).toContain('<td>单元格1</td>');
      expect(html).toContain('<td>单元格2</td>');
    });

    it('应该处理任务列表', async () => {
      const markdown = '- [ ] 未完成任务\n- [x] 已完成任务';
      const result = await parser.process(markdown);
      const html = String(result);

      expect(html).toContain('type="checkbox"');
      expect(html).toContain('disabled');
    });

    it('应该处理自动链接', async () => {
      const markdown = 'https://example.com';
      const result = await parser.process(markdown);
      const html = String(result);

      expect(html).toContain('<a href="https://example.com">https://example.com</a>');
    });
  });

  describe('数学公式支持', () => {
    it('应该处理行内数学公式', async () => {
      const markdown = '这是一个行内公式 $x^2 + y^2 = z^2$';
      const result = await parser.process(markdown);
      const html = String(result);

      // MathJax 会添加特殊的标记
      expect(html).toContain('mjx-container');
    });

    it('应该处理块级数学公式', async () => {
      const markdown = '$$\n\\frac{1}{2}\n$$';
      const result = await parser.process(markdown);
      const html = String(result);

      expect(html).toContain('mjx-container');
    });
  });

  describe('HTML 内容处理', () => {
    it('应该保留安全的 HTML 标签', async () => {
      const markdown = '<div>这是一个 div</div>';
      const result = await parser.process(markdown);
      const html = String(result);

      expect(html).toContain('<div>这是一个 div</div>');
    });

    it('应该处理混合的 Markdown 和 HTML', async () => {
      const markdown = '<div>\n\n# 标题\n\n**加粗文本**\n\n</div>';
      const result = await parser.process(markdown);
      const html = String(result);

      expect(html).toContain('<div>');
      expect(html).toContain('<h1>标题</h1>');
      expect(html).toContain('<strong>加粗文本</strong>');
      expect(html).toContain('</div>');
    });

    it('应该过滤危险的 HTML 标签', async () => {
      const markdown = '<script>alert("XSS")</script>';
      const result = await parser.process(markdown);
      const html = String(result);

      // script 标签应该被过滤掉
      expect(html).not.toContain('<script>');
      expect(html).not.toContain('alert');
    });

    it('应该过滤危险的属性', async () => {
      const markdown = '<div onclick="alert(\'XSS\')">测试</div>';
      const result = await parser.process(markdown);
      const html = String(result);

      // onclick 属性应该被过滤掉
      expect(html).not.toContain('onclick');
      expect(html).toContain('<div>测试</div>');
    });
  });

  describe('自定义标签处理', () => {
    it('应该保留自定义标签', async () => {
      const customParser = getParser('html', {
        customTags: ['custom-component'],
        extends: [],
      });

      const markdown = '<custom-component>自定义内容</custom-component>';
      const result = await customParser.process(markdown);
      const html = String(result);

      expect(html).toContain('<custom-component>自定义内容</custom-component>');
    });

    it('应该处理多个自定义标签', async () => {
      const customParser = getParser('html', {
        customTags: ['custom-one', 'custom-two'],
        extends: [],
      });

      const markdown = '<custom-one>内容1</custom-one>\n<custom-two>内容2</custom-two>';
      const result = await customParser.process(markdown);
      const html = String(result);

      expect(html).toContain('<custom-one>内容1</custom-one>');
      expect(html).toContain('<custom-two>内容2</custom-two>');
    });
  });

  describe('复杂场景', () => {
    it('应该处理嵌套的列表', async () => {
      const markdown = `- 第一级
  - 第二级
    - 第三级
  - 第二级
- 第一级`;
      const result = await parser.process(markdown);
      const html = String(result);

      expect(html).toMatch(/<ul>[\s\S]*<ul>[\s\S]*<ul>/); // 应该有嵌套的 ul
    });

    it('应该处理复杂的混合内容', async () => {
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

      const result = await parser.process(markdown);
      const html = String(result);

      // 验证各个部分都被正确转换
      expect(html).toContain('<h1>文档标题</h1>');
      expect(html).toContain('<h2>代码示例</h2>');
      expect(html).toContain('<strong>加粗</strong>');
      expect(html).toContain('<em>斜体</em>');
      expect(html).toContain('<pre>');
      expect(html).toContain('function hello()');
      expect(html).toContain('<ol>');
      expect(html).toContain('<table>');
      expect(html).toContain('<blockquote>');
      expect(html).toContain('<a href="https://example.com">链接</a>');
    });
  });

  describe('返回类型', () => {
    it('当 target 为 "html" 时应该返回字符串处理器', async () => {
      const htmlParser = getParser('html', {
        customTags: [],
        extends: [],
      });

      const markdown = '# 测试';
      const result = await htmlParser.process(markdown);

      expect(typeof String(result)).toBe('string');
      expect(String(result)).toContain('<h1>测试</h1>');
    });

    it('当 target 不是 "html" 时应该返回处理器但不生成 HTML 字符串', () => {
      const astParser = getParser('hast', {
        customTags: [],
        extends: [],
      });

      // 验证返回的是一个处理器对象
      expect(astParser).toBeDefined();
      expect(typeof astParser.process).toBe('function');
    });
  });

  describe('边缘情况', () => {
    it('应该处理空字符串', async () => {
      const result = await parser.process('');
      const html = String(result);

      expect(html).toBe('');
    });

    it('应该处理只包含空白字符的输入', async () => {
      const result = await parser.process('   \n   \t   ');
      const html = String(result);

      expect(html.trim()).toBe('');
    });

    it('应该处理特殊字符', async () => {
      const markdown = '< > & " \'';
      const result = await parser.process(markdown);
      const html = String(result);

      expect(html).toContain('&lt;');
      expect(html).toContain('&gt;');
      expect(html).toContain('&amp;');
    });

    it('应该处理 emoji', async () => {
      const markdown = '😀 🎉 👍';
      const result = await parser.process(markdown);
      const html = String(result);

      expect(html).toContain('😀');
      expect(html).toContain('🎉');
      expect(html).toContain('👍');
    });

    it('应该处理超长文本', async () => {
      const longText = 'a'.repeat(10000);
      const markdown = `# ${longText}`;
      const result = await parser.process(markdown);
      const html = String(result);

      expect(html).toContain(`<h1>${longText}</h1>`);
    });
  });
});
