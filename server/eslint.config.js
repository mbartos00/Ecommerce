import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import importSort from 'eslint-plugin-simple-import-sort';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.all,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  eslintPluginUnicorn.configs['flat/all'],
  eslintConfigPrettier,
  eslintPluginPrettier,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'simple-import-sort': importSort,
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      'arrow-body-style': ['error', 'always'],
      'capitalized-comments': 'off',
      'class-methods-use-this': 'off',
      'consistent-return': 'off',
      'id-length': ['error', { exceptionPatterns: ['^_'] }],
      'line-comment-position': 'off',
      'multiline-comment-style': 'off',
      'no-duplicate-imports': 'off',
      'no-inline-comments': 'off',
      'no-magic-numbers': 'off',
      'no-ternary': 'off',
      'no-undefined': 'off',
      'no-underscore-dangle': 'off',
      'no-use-before-define': 'off',
      'one-var': ['error', 'never'],
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': 'error',
      'sort-imports': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prevent-abbreviations': 'off',
    },
  },
);