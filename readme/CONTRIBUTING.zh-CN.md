# 为 Vue Markdown Next 贡献

感谢你对 Vue Markdown Next 项目的关注！本文档提供了贡献项目的指南。

[English Contributing Guide](../CONTRIBUTING.md)

## 如何贡献

### 1. Fork 仓库

点击[仓库页面](https://github.com/UnboundedWeb/vue-markdown-next)右上角的 "Fork" 按钮来创建你自己的副本。

### 2. 克隆你的 Fork

```bash
git clone https://github.com/YOUR_USERNAME/vue-markdown-next.git
cd vue-markdown-next
```

### 3. 安装依赖

```bash
pnpm install
```

### 4. 创建分支

从 `main` 分支创建一个新分支用于你的更改：

```bash
git checkout -b feature/你的功能名称
# 或
git checkout -b fix/你的错误修复
```

### 5. 进行更改

#### 分支策略

我们使用两个主要分支：

- **`main`**：主要开发分支，用于代码更改
- **`docs`**：仅用于文档更新

**重要规则：**

- **仅文档更改**：提交你的 PR 到 `docs` 分支
  - 示例：修复拼写错误、更新指南、添加示例

- **代码更改（包含或不包含文档）**：提交你的 PR 到 `main` 分支
  - 示例：错误修复、新功能、重构
  - 如果你的代码更改包含文档更新，请将它们保持在同一个 PR 中提交到 `main`

#### 开发流程

```bash
# 运行开发模式
pnpm dev

# 运行测试
pnpm test

# 运行代码检查
pnpm lint

# 运行类型检查
pnpm typecheck

# 构建包
pnpm build
```

### 6. 提交你的更改

我们遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
# 格式：<类型>(<范围>): <主题>

# 示例：
git commit -m "feat(parser): 添加自定义插件支持"
git commit -m "fix(vue): 解决 worker pool 内存泄漏"
git commit -m "docs: 更新安装指南"
git commit -m "test(parser): 添加数学公式测试"
```

**提交类型：**

- `feat`: 新功能
- `fix`: 错误修复
- `docs`: 仅文档更改
- `style`: 代码风格更改（格式化等）
- `refactor`: 代码重构
- `test`: 添加或更新测试
- `chore`: 维护任务

### 7. 推送到你的 Fork

```bash
git push origin feature/你的功能名称
```

### 8. 开启 Pull Request

1. 前往[原始仓库](https://github.com/UnboundedWeb/vue-markdown-next)
2. 点击 "New Pull Request"
3. 选择适当的目标分支：
   - **`docs`** 用于仅文档更改
   - **`main`** 用于代码更改
4. 填写 PR 模板，包含：
   - 清晰的更改描述
   - 相关的 issue 编号（如果有）
   - 截图（如果有 UI 更改）
   - 测试结果

## 代码风格

- 遵循现有的代码风格
- 提交前运行 `pnpm lint:fix`
- 确保所有测试通过 `pnpm test`
- 为新功能添加测试
- 为 API 更改更新文档

## 项目结构

```
vue-markdown-next/
├── packages/
│   ├── parser/          # 核心 Markdown 解析器
│   └── vue/             # Vue 渲染器
├── app/
│   └── markdown-next-docs/  # VitePress 文档
├── readme/              # 附加文档
└── ...
```

## 测试

- 为新功能编写测试
- 确保现有测试通过
- 使用不同的 Markdown 输入进行测试
- 如果适用，测试 Worker 功能

## 文档

- 更改 API 时更新相关文档
- 为新功能添加示例
- 保持文档清晰简洁
- 在适用的情况下同时使用中英文

## 有疑问？

如果你有疑问，请：

- 检查现有的 [issues](https://github.com/UnboundedWeb/vue-markdown-next/issues)
- 开启一个新 issue 进行讨论
- 联系维护者

## 许可证

通过贡献，你同意你的贡献将使用 MIT 许可证。
