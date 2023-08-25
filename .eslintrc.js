module.exports = {
  root: true,
  extends: ['@metamask/eslint-config', '@metamask/eslint-config-nodejs'],
  overrides: [
    {
      files: ['*.ts'],
      extends: ['@metamask/eslint-config-typescript'],
    },
    {
      files: ['*.test.ts'],
      rules: {
        // Duplicate rule from '@metamask/eslint-config', but add exception for `t`
        'id-length': [
          'error',
          {
            min: 2,
            properties: 'never',
            exceptionPatterns: ['_', 'a', 'b', 'i', 'j', 'k', 't'],
          },
        ],
      },
    },
  ],
  ignorePatterns: [
    '!.eslintrc.js',
    '!.prettierrc.js',
    'coverage',
    'dist',
    'build',
  ],

  // This is required for rules that use type information.
  // See here for more information: https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/TYPED_LINTING.md
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
};
