import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";


export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,vue}"],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // 关闭 no-explicit-any 规则
    },
  },
  {languageOptions: { globals: globals.browser }},
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {files: ["**/*.vue"], languageOptions: {parserOptions: {parser: tseslint.parser}}},
];