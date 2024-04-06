export default [{
  files: ['**/*.ts', '**/*.js','**/*.mjs','**/*.cjs'],
  ignores: [
    '!.*',
    '**/node_modules/.*',
    '**/dist/.*',
    '**/coverage/.*',
    '*.json'
  ],
  languageOptions: {
    ecmaVersion: '2023',
    sourceType: 'module',
    globals: {
      Atomics: 'readonly',
      SharedArrayBuffer: 'readonly'
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {

      project: ['./tsconfig.json']
    },
  },
  // env: {
  //   node: true,
  //   es6: true,
  //   jest: true,
  // },

  processor: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:github/recommended',
    'plugin:jest/recommended'
  ],

  plugins: ['jest', '@typescript-eslint'],
  rules: {
    'prettier/prettier': ['error'],
    'camelcase': 'off',
    'eslint-comments/no-use': 'off',
    'eslint-comments/no-unused-disable': 'off',
    'i18n-text/no-en': 'off',
    'import/no-namespace': 'off',
    'no-console': 'off',
    'no-unused-vars': 'off',
    'semi': 'off',
    '@typescript-eslint/array-type': 'error',
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/ban-ts-comment': 'error',
    '@typescript-eslint/consistent-type-assertions': 'error',
    '@typescript-eslint/explicit-member-accessibility':  ['error', { 'accessibility': 'no-public' }],
    '@typescript-eslint/explicit-function-return-type': ['error', { 'allowExpressions': true }],
    '@typescript-eslint/func-call-spacing': ['error', 'never'],
    '@typescript-eslint/no-array-constructor': 'error',
    '@typescript-eslint/no-empty-interface': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-extraneous-class': 'error',
    '@typescript-eslint/no-for-in-array': 'error',
    '@typescript-eslint/no-inferrable-types': 'error',
    '@typescript-eslint/no-misused-new': 'error',
    '@typescript-eslint/no-namespace': 'error',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/no-require-imports': 'error',
    '@typescript-eslint/no-unnecessary-qualifier': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-useless-constructor': 'error',
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/prefer-for-of': 'warn',
    '@typescript-eslint/prefer-function-type': 'warn',
    '@typescript-eslint/prefer-includes': 'error',
    '@typescript-eslint/prefer-string-starts-ends-with': 'error',
    '@typescript-eslint/promise-function-async': 'error',
    '@typescript-eslint/require-array-sort-compare': 'error',
    '@typescript-eslint/restrict-plus-operands': 'error',
    '@typescript-eslint/semi': ['error', 'never'],
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/type-annotation-spacing': 'error',
    '@typescript-eslint/unbound-method': 'error'
  },
}];
