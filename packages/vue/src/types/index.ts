import type { Component, VNode } from 'vue';
import type { ParserOptions } from '@markdown-next/parser';

/**
 * 自定义组件映射类型
 * 允许用户替换 HTML 标签为自定义 Vue 组件
 */
export type ComponentsMap = {
  [tagName: string]: string | Component | ((props: any) => VNode);
};

/**
 * Markdown 渲染器配置
 */
export interface MarkdownRendererProps extends ParserOptions {
  /**
   * Markdown 内容
   */
  content: string;

  /**
   * 自定义组件映射
   * 例如: { h1: 'h2', em: CustomEmComponent }
   */
  components?: ComponentsMap;

  /**
   * 是否显示加载状态
   */
  loading?: boolean;

  /**
   * 自定义加载组件
   */
  loadingComponent?: Component;

  /**
   * 自定义错误组件
   */
  errorComponent?: Component;
}

/**
 * Worker Pool Context 类型
 */
export interface WorkerPoolContext {
  /**
   * 解析器配置
   */
  options: ParserOptions;

  /**
   * Worker 数量
   */
  workerCount?: number;
}
