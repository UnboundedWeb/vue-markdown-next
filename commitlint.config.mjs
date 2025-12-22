export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation changes
        'style', // Code style (no runtime changes)
        'refactor', // Refactor (neither feature nor bug fix)
        'perf', // Performance improvements
        'test', // Tests
        'chore', // Build process or auxiliary tools
        'revert', // Revert
        'build', // Build system or external dependencies
      ],
    ],
    'subject-case': [0], // Do not enforce subject case
  },
};
