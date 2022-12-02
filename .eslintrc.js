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
      extends: ['@metamask/eslint-config-jest'],
      rules: {
        'jest/no-restricted-matchers': 'off',
      },
    },
  ],
  ignorePatterns: ['!.eslintrc.js', '!.prettierrc.js', 'coverage', 'dist'],

  // This is required for rules that use type information.
  // See here for more information: https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/TYPED_LINTING.md
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
};
