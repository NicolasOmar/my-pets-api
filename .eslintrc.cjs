module.exports = {
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended',
    'plugin:node/recommended'
  ],
  env: {
    browser: true,
    node: true,
    jest: true
  },
  globals: {
    '__dirname': 'readonly'
  },
  rules: {
    'quotes': ['error', 'single'],
    'node/exports-style': ['error', 'module.exports'],
    'node/no-unsupported-features/es-syntax': ['off'],
    'node/no-exports-assign': 'error',
    'node/no-deprecated-api': 2,
    'node/no-unpublished-import': [
      'error',
      {
        allowModules: [
          'graphql-depth-limit'
        ]
      }
    ],
    'no-unused-vars': ['error', {
      'ignoreRestSiblings': true,
      'destructuredArrayIgnorePattern': '^_'
    }]
  }
}