import { h, VNode, Component } from 'vue';
import type { Root, Element, Text, Comment } from 'hast';
import type { ComponentsMap } from '../types';

/**
 * 将 HAST 节点转换为 Vue VNode
 *
 * @param node HAST 节点
 * @param components 自定义组件映射
 * @returns Vue VNode
 */
export function hastToVNode(node: Root | Element | Text | Comment, components: ComponentsMap = {}): VNode | VNode[] | string {
  // 文本节点
  if (node.type === 'text') {
    return node.value;
  }

  // 注释节点
  if (node.type === 'comment') {
    // Vue 3 中注释节点可以使用 Comment symbol
    return h(Comment, node.value);
  }

  // Root 节点
  if (node.type === 'root') {
    const children = node.children.map((child) => hastToVNode(child as any, components));
    // Root 节点返回一个 div 包裹所有子节点
    return h('div', { class: 'markdown-body' }, children);
  }

  // Element 节点
  if (node.type === 'element') {
    const { tagName, properties = {}, children = [] } = node;

    // 转换属性：HAST 使用 properties，Vue 使用 props
    const props: Record<string, any> = {};

    // 处理 className -> class
    if (properties.className) {
      props.class = Array.isArray(properties.className)
        ? properties.className.join(' ')
        : properties.className;
    }

    // 处理其他属性
    Object.keys(properties).forEach((key) => {
      if (key === 'className') return; // 已处理

      // 将 HAST 属性名转换为 Vue 属性名
      // 例如：ariaLabel -> aria-label
      let propKey = key;
      if (key.startsWith('aria')) {
        propKey = 'aria-' + key.slice(4).toLowerCase();
      } else if (key.startsWith('data')) {
        propKey = 'data-' + key.slice(4).toLowerCase();
      }

      props[propKey] = properties[key];
    });

    // 递归转换子节点
    const vNodeChildren = children.map((child) => hastToVNode(child as any, components));

    // 检查是否有自定义组件映射
    const customComponent = components[tagName];

    if (customComponent) {
      // 如果是字符串，直接作为标签名
      if (typeof customComponent === 'string') {
        return h(customComponent, props, vNodeChildren);
      }

      // 如果是函数组件
      if (typeof customComponent === 'function') {
        // 传递原始节点和属性给自定义组件
        return customComponent({
          node,
          ...props,
          children: vNodeChildren,
        });
      }

      // 如果是 Vue 组件
      return h(customComponent as Component, props, {
        default: () => vNodeChildren,
      });
    }

    // 默认渲染原始标签
    return h(tagName, props, vNodeChildren);
  }

  // 其他未知节点类型，返回空字符串
  return '';
}
