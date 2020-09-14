module.exports = {
  root: true,
  extends: [
    '@metamask/eslint-config',
    '@metamask/eslint-config/config/jest',
    '@metamask/eslint-config/config/nodejs',
    '@metamask/eslint-config/config/typescript',
  ],
  overrides: [{
    files: [
      '.eslintrc.js',
      'jest.config.js',
    ],
    parserOptions: {
      sourceType: 'script',
    },
  }],
};
