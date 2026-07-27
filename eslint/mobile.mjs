import { defineConfig } from "eslint/config"
import expoConfig from "eslint-config-expo/flat.js"

export default defineConfig([
  {
    files: ["apps/mobile/**/*.{ts,tsx}"],
    extends: [expoConfig],
    settings: { react: { version: "19.2.3" } },
    rules: {
      "@typescript-eslint/no-empty-object-type": ["error", { allowInterfaces: "with-single-extends" }],
    },
  },
])
