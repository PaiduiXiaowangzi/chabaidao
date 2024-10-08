module.exports = {
    root: true,
    env: {
      node: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:vue/recommended',
      'plugin:prettier/recommended'
    ],
    parserOptions: {
      ecmaVersion: 2020,
    },
    rules: {
      // 其他规则，可以根据需要调整
      'prettier/prettier': 'error',
    },
  };