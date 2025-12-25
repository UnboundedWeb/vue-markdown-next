import type { Root } from 'hast';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import type { Components } from 'hast-util-to-jsx-runtime';
import { Fragment, h } from 'vue';
import type { CSSProperties, StyleValue, VNodeChild } from 'vue';
import type { MarkdownComponents, MarkdownRenderOptions } from '../types';
import { githubTagStyles } from '../styles/themeGithub';

const MATHJAX_TAG_PREFIX = 'mjx-';
const BLOCKED_COMPONENTS = new Set(['math']);
type NonNullableChild = Exclude<VNodeChild, null | undefined | void>;

function normalizeProps(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any> | null | undefined
): Record<string, unknown> {
  if (!props) return {};
  const normalized: Record<string, unknown> = { ...props };
  if ('className' in normalized) {
    normalized['class'] = normalized['className'];
    delete normalized['className'];
  }
  if ('htmlFor' in normalized) {
    normalized['for'] = normalized['htmlFor'];
    delete normalized['htmlFor'];
  }
  return normalized;
}

function mergeStyle(
  base: CSSProperties | undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override: any
): StyleValue | undefined {
  if (!override) return base;
  if (Array.isArray(override)) {
    return [base ?? {}, ...override] as StyleValue;
  }
  return [base ?? {}, override] as StyleValue;
}

function createStyledTag(tag: string) {
  return (props: Record<string, unknown>) => {
    const { children, style, ...rest } = props;
    const sanitizedRest = { ...rest };
    delete sanitizedRest['node'];
    const resolvedChildren = children == null ? undefined : (children as NonNullableChild);
    const vnodeProps = { ...sanitizedRest, style: mergeStyle(githubTagStyles[tag], style) };
    if (resolvedChildren === undefined) {
      return h(tag, vnodeProps);
    }
    return h(tag, vnodeProps, resolvedChildren);
  };
}

function createCodeComponent() {
  return (props: Record<string, unknown>) => {
    const {
      children,
      style,
      class: className,
      className: altClassName,
      ...rest
    } = props as Record<string, unknown>;
    const sanitizedRest = { ...rest };
    delete sanitizedRest['node'];
    const resolvedClass = className ?? altClassName;
    const classString = typeof resolvedClass === 'string' ? resolvedClass : undefined;
    const isBlock = Boolean(classString && classString.includes('language-'));
    const codeStyle = githubTagStyles['code'] ?? {};
    const baseStyle = isBlock
      ? {
          fontFamily: codeStyle.fontFamily,
          fontSize: codeStyle.fontSize,
          padding: 0,
          backgroundColor: 'transparent',
        }
      : codeStyle;
    const resolvedChildren = children == null ? undefined : (children as NonNullableChild);
    const vnodeProps = {
      ...sanitizedRest,
      class: resolvedClass,
      style: mergeStyle(baseStyle, style),
    };
    if (resolvedChildren === undefined) {
      return h('code', vnodeProps);
    }
    return h('code', vnodeProps, resolvedChildren);
  };
}

function createDefaultComponents(): MarkdownComponents {
  return {
    h1: createStyledTag('h1'),
    h2: createStyledTag('h2'),
    h3: createStyledTag('h3'),
    h4: createStyledTag('h4'),
    h5: createStyledTag('h5'),
    h6: createStyledTag('h6'),
    p: createStyledTag('p'),
    blockquote: createStyledTag('blockquote'),
    ul: createStyledTag('ul'),
    ol: createStyledTag('ol'),
    li: createStyledTag('li'),
    table: createStyledTag('table'),
    th: createStyledTag('th'),
    td: createStyledTag('td'),
    pre: createStyledTag('pre'),
    code: createCodeComponent(),
    a: createStyledTag('a'),
    hr: createStyledTag('hr'),
    img: createStyledTag('img'),
    kbd: createStyledTag('kbd'),
    del: createStyledTag('del'),
  };
}

const defaultComponents = createDefaultComponents();

function filterComponents(components: MarkdownComponents): MarkdownComponents {
  const filtered: MarkdownComponents = { ...components };
  for (const key of Object.keys(filtered)) {
    if (key.startsWith(MATHJAX_TAG_PREFIX) || BLOCKED_COMPONENTS.has(key)) {
      delete filtered[key];
    }
  }
  return filtered;
}

function resolveComponents(options?: MarkdownRenderOptions): MarkdownComponents {
  const merged: MarkdownComponents = {
    ...defaultComponents,
    ...(options?.components ?? {}),
  };
  if (options?.codeRenderer) {
    merged['code'] = options.codeRenderer;
  }
  return filterComponents(merged);
}

const createJsx = (
  type: unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any> | null,
  key: string | undefined
): VNodeChild => {
  const normalized = normalizeProps(props);
  const { children, ...rest } = normalized;
  const vnodeProps = key == null ? rest : { ...rest, key };
  if (typeof type === 'string') {
    const domProps = { ...(vnodeProps as Record<string, unknown>) };
    delete domProps['node'];
    if (children == null) {
      return h(type, domProps);
    }
    return h(type, domProps, children as NonNullableChild);
  }
  if (children == null) {
    return h(type as never, vnodeProps);
  }
  return h(type as never, vnodeProps, children as NonNullableChild);
};

export function renderHastToVue(tree: Root, options?: MarkdownRenderOptions): VNodeChild {
  return toJsxRuntime(tree, {
    Fragment,
    jsx: createJsx as unknown as never,
    jsxs: createJsx as unknown as never,
    passNode: true,
    components: resolveComponents(options) as Partial<Components>,
  }) as VNodeChild;
}
