module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    document: 'readonly',
    navigator: 'readonly',
    window: 'readonly',
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:json/recommended',
    'plugin:promise/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:node/recommended',
    'plugin:sonarjs/recommended',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'json', 'promise', 'import', 'node', 'sonarjs', 'jest', 'optimize-regex'],
  rules: {
    'optimize-regex/optimize-regex': 'error',
    'import/no-unresolved': 'error',
    'node/no-missing-import': 'off',
    // 'node/no-missing-import': [
    //   'error',
    //   {
    //     tryExtensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    //   },
    // ],
    // We don't need this since we are using transpilation
    'node/no-unsupported-features/es-syntax': 'off',
    'no-process-exit': 'off',
    // Too verbose
    'sonarjs/no-duplicate-string': 'off',
    // Too verbose
    'sonarjs/cognitive-complexity': 'off',
  },
  settings: {
    // This loads <rootdir>/tsconfig.json to eslint
    'import/resolver': {
      typescript: { alwaysTryTypes: true },
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};
