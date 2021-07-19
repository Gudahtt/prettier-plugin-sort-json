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
};
