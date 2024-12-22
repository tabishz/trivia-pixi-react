import js from '@eslint/js';
import react from 'eslint-plugin-react';
import globals from 'globals';

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2024,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      'react/jsx-no-target-blank': 'off',
      quotes: ['warn', 'single'],
      semi: ['error', 'always'],
      'no-unused-vars': 'warn',
      'no-unreachable': 'error',
      'no-unexpected-multiline': 'error',
      'max-depth': ['error', 6],
      'no-multiple-empty-lines': ['error', { max: 1 }],
    },
  },
];
