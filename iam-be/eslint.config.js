const tsPlugin = require('@typescript-eslint/eslint-plugin');
const unusedImportsPlugin = require('eslint-plugin-unused-imports');
const tsParser = require('@typescript-eslint/parser');

module.exports = [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'unused-imports': unusedImportsPlugin,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'none',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'class',
          format: ['PascalCase'],
        },
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
        },
        {
          selector: 'method',
          format: ['camelCase'],
        },
        {
          selector: 'variable',
          modifiers: ['const', 'exported'],
          format: ['PascalCase', 'UPPER_CASE', 'camelCase'],
        },
        {
          selector: 'variable',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'property',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'objectLiteralProperty',
          format: null, // Allow any format
        },
        {
          selector: 'classProperty',
          format: ['camelCase',],
        },
        {
          selector: 'parameterProperty',
          format: ['camelCase',],
        },
        {
          selector: 'parameter',
          format: ['camelCase'],
          filter: {
            regex: '^_$',
            match: false,
          },
        },
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
        },
        {
          selector: 'interface',
          format: ['PascalCase'],
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'none',
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'indent': ['off', 2],
      'quotes': ['warn', 'single'],
      'semi': ['warn', 'always'],
      'comma-dangle': ['off', 'always-multiline'],
      'object-curly-spacing': ['warn', 'always'],
      'array-bracket-spacing': ['warn', 'never'],
      'arrow-parens': ['warn', 'always'],
      'key-spacing': ['warn', { beforeColon: false, afterColon: true }],
      'space-infix-ops': 'warn',
      'no-multiple-empty-lines': ['warn', { max: 1 }],
      "no-multi-spaces": ["warn", { "ignoreEOLComments": true }],
      'eol-last': ['warn', 'always'],
    },
  },
  {
    files: ['src/shared/**/*.{ts,js}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: '@core', message: 'Do not import from @core in shared folder.' },
            { name: '@api', message: 'Do not import from @api in shared folder.' },
            { name: '@job', message: 'Do not import from @job in shared folder.' },
            { name: 'src/config', message: 'Do not import from parent folder in shared folder.' },
            { name: 'src/message', message: 'Do not import from parent folder in shared folder.' },
            { name: 'src/main', message: 'Do not import from parent folder in shared folder.' },
          ],
          patterns: [
            '@core/*',
            '@api/*',
            '@job/*',
            '../*',
            '../../*',
          ],
        },
      ],
    },
  },
];
