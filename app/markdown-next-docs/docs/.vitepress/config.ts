import { defineConfig } from 'vitepress';
import type { DefaultTheme } from 'vitepress';

// Shared navigation for all versions
const sharedNav: DefaultTheme.NavItem[] = [
  { text: 'Guide', link: '/guide/getting-started' },
  { text: 'API Reference', link: '/api/parser' },
  { text: 'Examples', link: '/examples/basic' },
  { text: 'Online Preview', link: 'https://preview.markdown.team/', target: '_blank' },
];

const sharedSidebar: DefaultTheme.Sidebar = {
  '/guide/': [
    {
      text: 'Introduction',
      items: [
        { text: 'Getting Started', link: '/guide/getting-started' },
        { text: 'Installation', link: '/guide/installation' },
      ],
    },
    {
      text: 'Core Concepts',
      items: [
        { text: 'Parser', link: '/guide/parser' },
        { text: 'Vue Renderer', link: '/guide/vue-renderer' },
        { text: 'Bundler Configuration', link: '/guide/bundler-config' },
      ],
    },
  ],
  '/api/': [
    {
      text: 'API Reference',
      items: [
        { text: '@markdown-next/parser', link: '/api/parser' },
        { text: '@markdown-next/vue', link: '/api/vue' },
      ],
    },
  ],
  '/examples/': [
    {
      text: 'Examples',
      items: [
        { text: 'Basic Usage', link: '/examples/basic' },
        { text: 'Custom Components', link: '/examples/custom-components' },
        { text: 'Worker Pool', link: '/examples/worker-pool' },
        { text: 'Math Formulas', link: '/examples/math' },
      ],
    },
  ],
};

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Markdown Next',
  description: 'High-performance markdown parser and Vue renderer',
  base: '/',

  // Set favicon
  head: [['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }]],

  // Multi-language support
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      link: '/v1/en/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/v1/en/' },
          ...sharedNav.map((item) => ({
            ...item,
            link: item.link.startsWith('http') ? item.link : `/v1/en${item.link}`,
          })),
          {
            text: 'v1.0',
            items: [
              { text: 'v1.0 (current)', link: '/v1/en/' },
              // Future versions can be added here
              // { text: 'v2.0', link: '/v2/en/' },
            ],
          },
        ],
        sidebar: Object.fromEntries(
          Object.entries(sharedSidebar).map(([key, value]) => [
            `/v1/en${key}`,
            Array.isArray(value)
              ? value.map((section) => ({
                  ...section,
                  items: section.items?.map((item) => ({
                    ...item,
                    link: `/v1/en${item.link}`,
                  })),
                }))
              : value,
          ])
        ),
        editLink: {
          pattern:
            'https://github.com/UnboundedWeb/vue-markdown-next/edit/main/app/markdown-next-docs/docs/:path',
          text: 'Edit this page on GitHub',
        },
        footer: {
          message: 'Released under the MIT License.',
          copyright: 'Copyright © 2025-present',
        },
      },
    },
    zh: {
      label: '简体中文',
      lang: 'zh',
      link: '/v1/zh/',
      themeConfig: {
        nav: [
          { text: '首页', link: '/v1/zh/' },
          { text: '指南', link: '/v1/zh/guide/getting-started' },
          { text: 'API 参考', link: '/v1/zh/api/parser' },
          { text: '示例', link: '/v1/zh/examples/basic' },
          { text: '在线预览', link: 'https://preview.markdown.team/', target: '_blank' },
          {
            text: 'v1.0',
            items: [
              { text: 'v1.0 (当前版本)', link: '/v1/zh/' },
              // 未来版本可以在这里添加
              // { text: 'v2.0', link: '/v2/zh/' },
            ],
          },
        ],
        sidebar: {
          '/v1/zh/guide/': [
            {
              text: '介绍',
              items: [
                { text: '快速开始', link: '/v1/zh/guide/getting-started' },
                { text: '安装', link: '/v1/zh/guide/installation' },
              ],
            },
            {
              text: '核心概念',
              items: [
                { text: '解析器', link: '/v1/zh/guide/parser' },
                { text: 'Vue 渲染器', link: '/v1/zh/guide/vue-renderer' },
                { text: '打包器配置', link: '/v1/zh/guide/bundler-config' },
              ],
            },
          ],
          '/v1/zh/api/': [
            {
              text: 'API 参考',
              items: [
                { text: '@markdown-next/parser', link: '/v1/zh/api/parser' },
                { text: '@markdown-next/vue', link: '/v1/zh/api/vue' },
              ],
            },
          ],
          '/v1/zh/examples/': [
            {
              text: '示例',
              items: [
                { text: '基础用法', link: '/v1/zh/examples/basic' },
                { text: '自定义组件', link: '/v1/zh/examples/custom-components' },
                { text: 'Worker 池', link: '/v1/zh/examples/worker-pool' },
                { text: '数学公式', link: '/v1/zh/examples/math' },
              ],
            },
          ],
        },
        editLink: {
          pattern:
            'https://github.com/UnboundedWeb/vue-markdown-next/edit/main/app/markdown-next-docs/docs/:path',
          text: '在 GitHub 上编辑此页',
        },
        footer: {
          message: '基于 MIT 许可发布',
          copyright: '版权所有 © 2025-至今',
        },
        outline: {
          label: '页面导航',
        },
        lastUpdated: {
          text: '最后更新于',
        },
        docFooter: {
          prev: '上一页',
          next: '下一页',
        },
        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '主题',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',
      },
    },
  },

  themeConfig: {
    logo: '/logo.png',
    search: {
      provider: 'local',
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/UnboundedWeb/vue-markdown-next' }],
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
    lineNumbers: true,
  },
});
