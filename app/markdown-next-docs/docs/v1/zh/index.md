---
layout: home

hero:
  name: 'Markdown Next'
  text: '高性能 Vue Markdown 渲染器'
  tagline: 现代化的 markdown 解析和渲染方案，基于 Vue 3，支持 Worker 池和自定义组件
  actions:
    - theme: brand
      text: 快速开始
      link: /v1/zh/guide/getting-started
    - theme: alt
      text: 在 GitHub 查看
      link: https://github.com/yourusername/vue-markdown-next

features:
  - icon: ⚡️
    title: 极速渲染
    details: 基于 unified/remark/rehype 生态系统，支持可选的 Worker 池实现非阻塞解析
  - icon: 🎨
    title: 高度可定制
    details: 支持自定义组件渲染、语法高亮和内置 LaTeX / Tex 支持
  - icon: 🔧
    title: Vue 3 就绪
    details: 使用组合式 API 无缝集成到 Vue 3 应用中
  - icon: 📦
    title: 两个独立包
    details: 分离的解析器 (@markdown-next/parser) 和 Vue 渲染器 (@markdown-next/vue)，提供最大的灵活性
  - icon: 🌐
    title: 扩展语法
    details: 支持 GFM（GitHub Flavored Markdown）、MathJax 和自定义语法扩展
  - icon: 🔒
    title: 默认安全
    details: 内置 HTML 清理和 XSS 防护
---
