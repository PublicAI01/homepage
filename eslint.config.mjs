import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ['next'],
    plugins: ['simple-import-sort', 'unused-imports'],
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'unused-imports/no-unused-imports': 'warn',
      'import/no-anonymous-default-export': [
        'warn',
        {
          allowObject: true,
        },
      ],
    },
  }),
];

export default eslintConfig;
