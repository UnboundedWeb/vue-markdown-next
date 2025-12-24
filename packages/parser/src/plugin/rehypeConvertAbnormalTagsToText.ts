import { Root, Element, Text } from 'hast';
import { createSanitizeSchema } from '../utils/createSanitizeSchema';
import { visit } from 'unist-util-visit';
export const rehypeConvertAbnormalTagsToText = (customTags: string[] = []) => {
  return (tree: Root) => {
    // Get all allowed tag names (HTML + MathML + customTags)
    const schema = createSanitizeSchema(customTags);
    const allowedTagNames = new Set(schema.tagNames || []);

    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index === undefined) return;

      const tagName = (node as Element).tagName;

      // Check whether it's an abnormal tag:
      // 1. Not in the allowed tag list
      // 2. And contains characters other than English letters
      const isAbnormalTag = !allowedTagNames.has(tagName) && /[^a-zA-Z]/.test(tagName);

      if (isAbnormalTag) {
        // Rebuild the original tag string
        let tagString = `<${tagName}`;

        // Append attributes
        if ((node as Element).properties) {
          for (const [key, value] of Object.entries((node as Element).properties)) {
            if (Array.isArray(value)) {
              tagString += ` ${key}="${value.join(' ')}"`;
            } else if (value !== null && value !== undefined) {
              tagString += ` ${key}="${value}"`;
            }
          }
        }

        // Handle child content
        let innerContent = '';
        if ((node as Element).children && (node as Element).children.length > 0) {
          // Recursively process child nodes
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

        // Create a text node to replace the abnormal tag
        const textNode: Text = {
          type: 'text',
          value: tagString,
        };

        // Replace node
        parent.children[index] = textNode;
      }
    });
  };
};
