import { isString, escapeHtml } from '@markdown-next/shared';

export interface ParseOptions {
  sanitize?: boolean;
}

export function parseMarkdown(content: string, options: ParseOptions = {}): string {
  if (!isString(content)) {
    throw new Error('Content must be a string');
  }

  const { sanitize = true } = options;
  let result = content.trim();

  if (sanitize) {
    result = escapeHtml(result);
  }

  // Simple markdown parsing (example)
  result = result.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  result = result.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  result = result.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  result = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  result = result.replace(/\*(.*?)\*/g, '<em>$1</em>');

  return result;
}

export { escapeHtml };
