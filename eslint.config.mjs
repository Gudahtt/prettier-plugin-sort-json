import path from 'node:path';
import { fileURLToPath } from 'node:url';
import baseConfig from '@metamask/eslint-config';
import nodeConfig from '@metamask/eslint-config-nodejs';
import typescriptConfig from '@metamask/eslint-config-typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const typescriptFiles = ['**/*.ts'];
const allFiles = ['**/*.js', ...typescriptFiles];

export default [
  // Specified as its own config object so that it applies globally
  // See https://github.com/eslint/eslint/discussions/17429
  {
    ignores: [
      '!**/.eslintrc.js',
      '!**/.prettierrc.js',
      '.yarn/*',
      '**/coverage',
      '**/dist',
      '**/build',
    ],
  },
  {
    files: allFiles,
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',

      parserOptions: {
        tsconfigRootDir: __dirname,
      },
    },
  },
  ...baseConfig.map((config => ({
    ...config,
    files: allFiles,
  }))),
  ...nodeConfig.map((config => ({
    ...config,
    files: allFiles,
  }))),
  ...typescriptConfig.map((config => ({
    ...config,
    files: typescriptFiles,
  }))),
  {
    files: ['**/*.test.ts'],
    rules: {
      'id-length': [
        'error',
        {
          min: 2,
          properties: 'never',
          exceptionPatterns: ['_', 'a', 'b', 'i', 'j', 'k', 't'],
        },
      ],
    },
  }
];
