const { FlatCompat } = require('@eslint/eslintrc');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const reactNativePlugin = require('eslint-plugin-react-native');

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = [
  {
    ignores: [
      'node_modules',
      'coverage',
      'ios',
      'android',
      '.expo',
      'autotransporta',
      'jmeter',
      'backend',
    ],
  },
  ...compat.extends(
    'google',
    'plugin:react/recommended',
    'plugin:react-native/all',
  ),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        __DEV__: true,
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-native': reactNativePlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'require-jsdoc': 'off',
      'valid-jsdoc': 'off',
      'max-len': [
        'error',
        {
          code: 100,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreUrls: true,
        },
      ],
      'object-curly-spacing': ['error', 'always'],
      'padded-blocks': ['error', 'never'],
      'operator-linebreak': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-native/no-inline-styles': 'off',
    },
  },
];
