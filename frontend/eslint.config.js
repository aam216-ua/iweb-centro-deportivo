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
            "Alert",
            "Avatar",
            "Badge",
            "Button",
            "Card",
            "Command",
            "Dialog",
            "Drawer",
            "Input",
            "Label",
            "Popover",
            "Select",
            "Sheet",
            "Sonner",
            "Switch",
            "Table",
            "Toaster",
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
