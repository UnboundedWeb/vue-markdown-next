import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import vue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';

export default [
  js.configs.recommended,

  // Vue file config
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      vue,
      '@typescript-eslint': tsPlugin,
      'prettier': prettierPlugin,
    },
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      'prettier/prettier': 'error',
    },
  },

  // TypeScript file config
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      globals: {
        Worker: 'readonly',
        URL: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'prettier': prettierPlugin,
    },
    rules: {
      // TypeScript recommended rules
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      '@typescript-eslint/explicit-function-return-type': ['error', {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
      }],
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // Prettier
      'prettier/prettier': 'error',
    },
  },

  // Prettier config (disable conflicting rules)
  prettierConfig,

  // Ignored files
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/*.d.ts',
      '**/.husky/**',
      '**/pnpm-lock.yaml',
      '**/__tests__/**',
    ],
  },
];
