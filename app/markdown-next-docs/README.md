# Markdown Next Documentation

Official documentation for the Markdown Next project, built with VitePress.

## Features

- ✅ **Multi-language support**: English (default) and Chinese
- ✅ **Version control**: v1 routing structure (`/v1/en/`, `/v1/zh/`)
- ✅ **Custom renderer**: Uses `@markdown-next/vue` for rendering examples
- ✅ **Comprehensive docs**: Guides, API references, and examples

## Development

### Install Dependencies

```bash
pnpm install
```

### Start Dev Server

```bash
pnpm run dev
```

The documentation will be available at `http://localhost:5173`

### Build for Production

```bash
pnpm run build
```

### Preview Production Build

```bash
pnpm run preview
```

## Project Structure

```
docs/
├── .vitepress/
│   ├── config.ts          # VitePress configuration
│   └── theme/
│       ├── index.ts       # Custom theme
│       └── custom.css     # Custom styles
├── v1/
│   ├── en/                # English documentation
│   │   ├── index.md       # Home page
│   │   ├── guide/         # Guides
│   │   ├── api/           # API references
│   │   └── examples/      # Examples
│   └── zh/                # Chinese documentation
│       ├── index.md       # 首页
│       ├── guide/         # 指南
│       ├── api/           # API 参考
│       └── examples/      # 示例
└── public/                # Static assets
```

## Documentation Structure

### Guides (`/guide/`)

- Getting Started
- Installation
- Parser
- Vue Renderer

### API References (`/api/`)

- @markdown-next/parser
- @markdown-next/vue

### Examples (`/examples/`)

- Basic Usage
- Custom Components
- Worker Pool

## Internationalization

The documentation supports two languages:

- **English** (default): `/v1/en/`
- **Chinese**: `/v1/zh/`

Users can switch languages using the language selector in the navigation bar.

## Versioning

The documentation is structured to support multiple versions:

- **v1.0** (current): `/v1/`
- Future versions can be added as `/v2/`, `/v3/`, etc.

## Custom Components

The documentation registers `@markdown-next/vue` components globally in the theme, making them available in all markdown files:

```vue
<MarkdownRenderer :markdown="yourMarkdown" />
<MarkdownWorkerPoll :worker-count="2">
  <MarkdownRenderer :markdown="doc1" />
</MarkdownWorkerPoll>
```

## Contributing

When adding new documentation:

1. Create the English version first in `/docs/v1/en/`
2. Create the Chinese version in `/docs/v1/zh/`
3. Update navigation and sidebar in `.vitepress/config.ts`
4. Test with `pnpm run dev`

## License

MIT
