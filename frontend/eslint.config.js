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
  {
    name: "app/vue-rules",
    rules: {
      "vue/multi-word-component-names": [
        "error",
        {
          ignores: [
            "Button",
            "Card",
            "Input",
            "Label",
            "Dialog",
            "Alert",
            "Avatar",
            "Badge",
            "Select",
            "Switch",
            "Table",
            "Sonner",
            "Toaster",
            "Sheet",
          ],
        },
      ],
    },
  },

  ...pluginVue.configs["flat/essential"],
  ...vueTsEslintConfig(),
  oxlint.configs["flat/recommended"],
  skipFormatting,
]
