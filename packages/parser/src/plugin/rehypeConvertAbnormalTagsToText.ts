import { Root, Element, Text } from 'hast';
import { createSanitizeSchema } from '../utils/createSanitizeSchema';
import { visit } from 'unist-util-visit';
export const rehypeConvertAbnormalTagsToText = (customTags: string[] = []) => {
  return (tree: Root) => {
    // 获取所有合法的标签名（HTML + MathML + customTags）
    const schema = createSanitizeSchema(customTags);
    const allowedTagNames = new Set(schema.tagNames || []);

    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index === undefined) return;

      const tagName = (node as Element).tagName;

      // 检查是否为异常标签：
      // 1. 不在允许的标签列表中
      // 2. 且包含除了英文字母以外的字符
      const isAbnormalTag = !allowedTagNames.has(tagName) && /[^a-zA-Z]/.test(tagName);

      if (isAbnormalTag) {
        // 重建原始标签字符串
        let tagString = `<${tagName}`;

        // 添加属性
        if ((node as Element).properties) {
          for (const [key, value] of Object.entries((node as Element).properties)) {
            if (Array.isArray(value)) {
              tagString += ` ${key}="${value.join(' ')}"`;
            } else if (value !== null && value !== undefined) {
              tagString += ` ${key}="${value}"`;
            }
          }
        }

        // 处理子内容
        let innerContent = '';
        if ((node as Element).children && (node as Element).children.length > 0) {
          // 递归处理子节点内容
          const processChildren = (children: Array<Element | Text>): string => {
            return children
              .map((child) => {
                if (child.type === 'text') {
                  return (child as Text).value;
                } else if (child.type === 'element') {
                  const elementChild = child as Element;
                  let childTag = `<${elementChild.tagName}`;
                  if (elementChild.properties) {
                    for (const [key, value] of Object.entries(elementChild.properties)) {
                      if (Array.isArray(value)) {
                        childTag += ` ${key}="${value.join(' ')}"`;
                      } else if (value !== null && value !== undefined) {
                        childTag += ` ${key}="${value}"`;
                      }
                    }
                  }
                  childTag += '>';
                  if (elementChild.children) {
                    childTag += processChildren(elementChild.children as Array<Element | Text>);
                  }
                  childTag += `</${elementChild.tagName}>`;
                  return childTag;
                }
                return '';
              })
              .join('');
          };
          innerContent = processChildren((node as Element).children as Array<Element | Text>);
        }

        tagString += `>${innerContent}</${tagName}>`;

        // 创建文本节点替换异常标签
        const textNode: Text = {
          type: 'text',
          value: tagString,
        };

        // 替换节点
        parent.children[index] = textNode;
      }
    });
  };
};
