module.exports = {
  overrides: [
    {
      files: ['**/*.ts'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint', 'prettier'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
      ],
      rules: {
        'prettier/prettier': 'error',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
  ],
};