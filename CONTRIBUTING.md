# Contributing to Vue Markdown Next

Thank you for your interest in contributing to Vue Markdown Next! This document provides guidelines for contributing to the project.

[中文贡献指南](./readme/CONTRIBUTING.zh-CN.md)

## How to Contribute

### 1. Fork the Repository

Click the "Fork" button at the top right of the [repository page](https://github.com/UnboundedWeb/vue-markdown-next) to create your own copy.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/vue-markdown-next.git
cd vue-markdown-next
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Create a Branch

Create a new branch from `main` for your changes:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 5. Make Your Changes

#### Branch Strategy

We use two main branches:

- **`main`**: Primary development branch for code changes
- **`docs`**: Documentation-only updates

**Important Rules:**

- **Documentation-only changes**: Submit your PR to the `docs` branch
  - Examples: Fixing typos, updating guides, adding examples

- **Code changes (with or without documentation)**: Submit your PR to the `main` branch
  - Examples: Bug fixes, new features, refactoring
  - If your code change includes documentation updates, keep them together in one PR to `main`

#### Development Workflow

```bash
# Run development mode
pnpm dev

# Run tests
pnpm test

# Run linting
pnpm lint

# Run type checking
pnpm typecheck

# Build packages
pnpm build
```

### 6. Commit Your Changes

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

```bash
# Format: <type>(<scope>): <subject>

# Examples:
git commit -m "feat(parser): add support for custom plugins"
git commit -m "fix(vue): resolve memory leak in worker pool"
git commit -m "docs: update installation guide"
git commit -m "test(parser): add tests for math formulas"
```

**Commit Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### 7. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 8. Open a Pull Request

1. Go to the [original repository](https://github.com/UnboundedWeb/vue-markdown-next)
2. Click "New Pull Request"
3. Select the appropriate base branch:
   - **`docs`** for documentation-only changes
   - **`main`** for code changes
4. Fill out the PR template with:
   - Clear description of changes
   - Related issue numbers (if applicable)
   - Screenshots (if UI changes)
   - Test results

## Code Style

- Follow the existing code style
- Run `pnpm lint:fix` before committing
- Ensure all tests pass with `pnpm test`
- Add tests for new features
- Update documentation for API changes

## Project Structure

```
vue-markdown-next/
├── packages/
│   ├── parser/          # Core markdown parser
│   └── vue/             # Vue renderer
├── app/
│   └── markdown-next-docs/  # VitePress documentation
├── readme/              # Additional documentation
└── ...
```

## Testing

- Write tests for new features
- Ensure existing tests pass
- Test with different markdown inputs
- Test Worker functionality if applicable

## Documentation

- Update relevant documentation when changing APIs
- Add examples for new features
- Keep documentation clear and concise
- Use both English and Chinese where applicable

## Questions?

If you have questions, please:

- Check existing [issues](https://github.com/UnboundedWeb/vue-markdown-next/issues)
- Open a new issue for discussion
- Reach out to maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
