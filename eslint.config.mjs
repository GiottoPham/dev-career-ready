import { defineConfig, globalIgnores } from "eslint/config"
import prettier from "eslint-config-prettier/flat"
import pluginQuery from "@tanstack/eslint-plugin-query"

import base from "./eslint/base.mjs"
import mobile from "./eslint/mobile.mjs"
import web from "./eslint/web.mjs"

export default defineConfig([
  prettier,
  ...pluginQuery.configs["flat/recommended"],
  globalIgnores(["dist", ".next/**", "out/**", "build/**", "next-env.d.ts", ".remember", "coverage", "**/.expo/**"]),
  ...base,
  ...web,
  ...mobile,
])
