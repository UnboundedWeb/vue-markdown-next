# GitHub Actions Workflows

## NPM Publish Workflow

This workflow automates the process of publishing packages from this monorepo to NPM.

### Prerequisites

Before using this workflow, ensure you have set up the following:

1. **NPM Token**: Add your NPM access token as a GitHub secret
   - Go to: Repository Settings → Secrets and variables → Actions
   - Create a new secret named `NPM_TOKEN`
   - Get your token from: https://www.npmjs.com/settings/[your-username]/tokens

### How to Use

1. **Navigate to Actions**
   - Go to the "Actions" tab in your GitHub repository
   - Select "NPM Publish and Release" workflow

2. **Run Workflow**
   - Click "Run workflow" button
   - Fill in the required parameters:
     - **Version bump type**: Choose `major`, `minor`, or `patch`
     - **Packages**: Enter `all` to publish all packages, or specify packages (e.g., `parser,vue`)
     - **Changelog**: Provide detailed release notes

3. **Monitor Progress**
   - The workflow will:
     - Validate inputs
     - Install dependencies
     - Run linting and type checking
     - Bump package versions
     - Generate changelogs
     - Build all packages
     - Run tests
     - Publish to NPM
     - Create GitHub release
     - Commit version changes

### Workflow Parameters

#### Version Bump Type

- `major`: Breaking changes (1.0.0 → 2.0.0)
- `minor`: New features (1.0.0 → 1.1.0)
- `patch`: Bug fixes (1.0.0 → 1.0.1)

#### Packages to Publish

- `all`: Publish all packages in the monorepo
- `parser`: Only publish @markdown-next/parser
- `vue`: Only publish @markdown-next/vue
- `parser,vue`: Publish multiple specific packages (comma-separated)

#### Changelog

Required field describing what changed in this release. This will be added to:

- Each package's CHANGELOG.md file
- GitHub release notes
- Git commit message

### Example Usage

**Publishing all packages with a patch version:**

```
Version bump type: patch
Packages: all
Changelog:
- Fixed parsing bug in code blocks
- Improved Vue component performance
- Updated dependencies
```

**Publishing only the parser package:**

```
Version bump type: minor
Packages: parser
Changelog:
- Added support for custom markdown extensions
- Enhanced error handling
```

### What Gets Published

The workflow publishes only the `packages/*` directories to NPM:

- `@markdown-next/parser`
- `@markdown-next/vue`

The `app/*` directories (like `markdown-next-docs`) are not published as they are marked as private.

### Automatic Prerelease Detection

If the version contains `alpha` or `beta`, the GitHub release will automatically be marked as a prerelease.

### Troubleshooting

**Workflow fails at "Publish packages to NPM":**

- Verify your `NPM_TOKEN` secret is correctly set
- Ensure the token has publish permissions
- Check if the package version already exists on NPM

**Type checking fails:**

- Fix type errors locally first
- Run `pnpm typecheck` to verify

**Tests fail:**

- Run `pnpm test` locally to identify issues
- Fix failing tests before publishing

**Git push fails:**

- Ensure the GitHub token has write permissions
- Check branch protection rules

### Post-Release

After successful publishing:

1. Version bumps are committed to the repository
2. CHANGELOG.md files are updated for each package
3. A GitHub release is created with release notes
4. Packages are available on NPM within minutes

### Manual Publishing (Alternative)

If you prefer to publish manually:

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm run build

# Navigate to specific package
cd packages/parser

# Publish
pnpm publish --access public
```
