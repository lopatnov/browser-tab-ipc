const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const prettierPlugin = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  {ignores: ['node_modules/', 'dist/']},
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    rules: {
      ...tsPlugin.configs['recommended'].rules,
    },
  },
  prettierConfig,
  {
    plugins: {prettier: prettierPlugin},
    rules: {
      'prettier/prettier': 'error',
      'max-len': ['error', {code: 160}],
      'linebreak-style': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];
