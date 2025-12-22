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
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      // Parser 包特定规则
      // 例如：可以放宽某些规则或添加特定的约束
    },
  },
];
