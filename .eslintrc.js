'use strict';

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:eslint-plugin/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'es5',
        tabWidth: 2,
        printWidth: 100,
        useTabs: false,
        semi: true,
        singleQuote: true,
      },
    ],
  },
  env: {
    node: true,
  },
  overrides: [
    {
      files: ['**/tests/**/*.js'],
      env: { mocha: true },
    },
  ],
};
