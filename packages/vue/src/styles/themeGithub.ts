import type { CSSProperties } from 'vue';

export const githubContainerStyle: CSSProperties = {
  color: '#1f2328',
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif',
  fontSize: '16px',
  lineHeight: '1.5',
  wordWrap: 'break-word',
};

export const githubTagStyles: Record<string, CSSProperties> = {
  h1: {
    fontSize: '2em',
    fontWeight: 600,
    margin: '0.67em 0',
    paddingBottom: '0.3em',
    borderBottom: '1px solid #d0d7de',
  },
  h2: {
    fontSize: '1.5em',
    fontWeight: 600,
    margin: '0.83em 0',
    paddingBottom: '0.3em',
    borderBottom: '1px solid #d0d7de',
  },
  h3: {
    fontSize: '1.25em',
    fontWeight: 600,
    margin: '1em 0',
  },
  h4: {
    fontSize: '1em',
    fontWeight: 600,
    margin: '1em 0',
  },
  h5: {
    fontSize: '0.875em',
    fontWeight: 600,
    margin: '1em 0',
  },
  h6: {
    fontSize: '0.85em',
    fontWeight: 600,
    margin: '1em 0',
    color: '#656d76',
  },
  p: {
    marginTop: 0,
    marginBottom: '16px',
  },
  blockquote: {
    padding: '0 1em',
    color: '#656d76',
    borderLeft: '0.25em solid #d0d7de',
    margin: '0 0 16px 0',
  },
  ul: {
    marginTop: 0,
    marginBottom: '16px',
    paddingLeft: '2em',
  },
  ol: {
    marginTop: 0,
    marginBottom: '16px',
    paddingLeft: '2em',
  },
  li: {
    marginTop: '0.25em',
  },
  table: {
    borderCollapse: 'collapse',
    width: '100%',
    marginBottom: '16px',
  },
  th: {
    border: '1px solid #d0d7de',
    padding: '6px 13px',
    backgroundColor: '#f6f8fa',
    fontWeight: 600,
  },
  td: {
    border: '1px solid #d0d7de',
    padding: '6px 13px',
  },
  pre: {
    backgroundColor: '#f6f8fa',
    borderRadius: '6px',
    padding: '16px',
    overflow: 'auto',
    fontSize: '85%',
    lineHeight: '1.45',
    marginBottom: '16px',
  },
  code: {
    fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
    fontSize: '85%',
    backgroundColor: 'rgba(175, 184, 193, 0.2)',
    borderRadius: '6px',
    padding: '0.2em 0.4em',
  },
  a: {
    color: '#0969da',
    textDecoration: 'none',
  },
  hr: {
    border: 0,
    borderTop: '1px solid #d0d7de',
    margin: '24px 0',
  },
  img: {
    maxWidth: '100%',
  },
  kbd: {
    display: 'inline-block',
    padding: '3px 5px',
    fontSize: '11px',
    lineHeight: '10px',
    color: '#1f2328',
    verticalAlign: 'middle',
    backgroundColor: '#f6f8fa',
    border: '1px solid #d0d7de',
    borderRadius: '6px',
    boxShadow: 'inset 0 -1px 0 #d0d7de',
  },
  del: {
    color: '#656d76',
  },
};
