module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  settings: { react: { version: 'detect' } },

  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    // Treat unused vars as warnings (reduce noise during automated fixes)
    'no-unused-vars': [
      'warn',
      {
        varsIgnorePattern: '^React$',
        args: 'after-used',
        ignoreRestSiblings: true,
      },
    ],
    // Make common JSX pitfalls warnings so build/dev aren't blocked
    'react/no-unescaped-entities': 'warn',
    'react/display-name': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'react/prop-types': 'off',
  },
};
