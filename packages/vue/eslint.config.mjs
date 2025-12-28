import baseConfig from '../../eslint.config.mjs';
import vuePlugin from 'eslint-plugin-vue';
import tsParser from '@typescript-eslint/parser';

const scopedBaseConfig = baseConfig.map((config) => {
  if (config.ignores) {
    return config;
  }

  if (config.files) {
    return {
      ...config,
      files: config.files.map((pattern) => `src/${pattern}`),
    };
  }

  return {
    ...config,
    files: ['src/**/*.{js,jsx,ts,tsx}'],
  };
});

export default [
  ...scopedBaseConfig,
  ...vuePlugin.configs['flat/strongly-recommended'],
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      vue: vuePlugin,
    },
    rules: {
      // Vue package-specific rules can be added here.
      'no-unused-vars': 'off',
    },
  },
];
