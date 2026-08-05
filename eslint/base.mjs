import path from "node:path"

import js from "@eslint/js"
import { defineConfig } from "eslint/config"
import importX from "eslint-plugin-import-x"
import tseslint from "typescript-eslint"

const rootDir = path.resolve(import.meta.dirname, "..")

export default defineConfig([
  {
    // eslint-config-expo (see mobile.mjs) brings its own @typescript-eslint
    // plugin instance for apps/mobile. Applying tseslint's recommended
    // config there too registers a second, non-identical plugin object under
    // the same "@typescript-eslint" key, which throws "Cannot redefine
    // plugin" — so this config intentionally does not touch apps/mobile.
    files: ["**/*.{ts,tsx}"],
    ignores: ["apps/mobile/**"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: rootDir,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { "import-x": importX },
    settings: {
      "import-x/resolver": {
        typescript: { alwaysTryTypes: true },
      },
    },
    rules: {
      "import-x/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "no-console": "error",
      curly: ["error", "all"],
    },
  },
])
