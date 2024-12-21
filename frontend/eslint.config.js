import skipFormatting from "@vue/eslint-config-prettier/skip-formatting"
import vueTsEslintConfig from "@vue/eslint-config-typescript"
import oxlint from "eslint-plugin-oxlint"
import pluginVue from "eslint-plugin-vue"

export default [
  {
    name: "app/files-to-lint",
    files: ["**/*.{ts,mts,tsx,vue}"],
  },

  {
    name: "app/files-to-ignore",
    ignores: ["**/dist/**", "**/dist-ssr/**", "**/coverage/**"],
  },

  ...pluginVue.configs["flat/essential"],
  ...vueTsEslintConfig({
    extends: ["recommended", "stylistic"],
  }),
  {
    files: ["**/*.{ts,mts,tsx,vue}"],
    rules: {
      "vue/multi-word-component-names": "off",
    },
  },
  oxlint.configs["flat/recommended"],
  skipFormatting,
]
