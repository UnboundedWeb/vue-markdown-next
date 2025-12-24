import baseConfig from '../../eslint.config.mjs';

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
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      globals: {
        Worker: 'readonly',
        URL: 'readonly',
      },
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      // Parser package-specific rules
      // e.g. relax some rules or add specific constraints
    },
  },
];
