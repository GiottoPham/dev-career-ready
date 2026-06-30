/* eslint-disable no-console */
import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"

const PROJECT_NAME = "dev-career-ready"
const API_BASE = "https://api.cloudflare.com/client/v4"
const ENV_PREFIX = "VITE_"

interface EnvVar {
  value?: string
  type: string
}

interface CfPagesResponse {
  success: boolean
  result: {
    deployment_configs: {
      production: { env_vars?: Record<string, EnvVar> }
      preview: { env_vars?: Record<string, EnvVar> }
    }
  }
}

type Environment = "production" | "preview"

function parseArgs(): Environment {
  const args = process.argv.slice(2)
  const envIndex = args.indexOf("--env")
  if (envIndex === -1) return "production"
  const value = args[envIndex + 1]
  if (value !== "production" && value !== "preview") {
    console.error(`Invalid environment: "${value}". Must be "production" or "preview".`)
    process.exit(1)
  }
  return value
}

async function main() {
  const env = parseArgs()

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const apiToken = process.env.CLOUDFLARE_API_TOKEN

  if (!accountId || !apiToken) {
    console.error(
      "Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN.\n" +
        "Set them in a root .env file or export them in your shell.\n" +
        "Create an API token at: https://dash.cloudflare.com/profile/api-tokens"
    )
    process.exit(1)
  }

  const url = `${API_BASE}/accounts/${accountId}/pages/projects/${PROJECT_NAME}`
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    console.error(`Cloudflare API error: ${response.status} ${response.statusText}`)
    const body = await response.text()
    console.error(body)
    process.exit(1)
  }

  const json = (await response.json()) as CfPagesResponse

  if (!json.success) {
    console.error("Cloudflare API returned success: false")
    process.exit(1)
  }

  const envVars = json.result.deployment_configs[env].env_vars ?? {}
  const lines: string[] = [
    `# Auto-generated from Cloudflare Pages (${env})`,
    `# Pulled at ${new Date().toISOString()}`,
    "# Do not edit manually — run `bun run env:pull` to refresh",
    "",
  ]

  let written = 0
  let skippedSecrets = 0
  let skippedNonVite = 0

  for (const [key, entry] of Object.entries(envVars)) {
    if (!key.startsWith(ENV_PREFIX)) {
      skippedNonVite++
      continue
    }
    if (entry.type === "secret_text" || entry.value === undefined) {
      console.warn(`  Skipping ${key} (secret — value not available via API)`)
      skippedSecrets++
      continue
    }
    lines.push(`${key}=${entry.value}`)
    written++
  }

  lines.push("")
  const content = lines.join("\n")

  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const outPath = path.resolve(scriptDir, "..", ".env.local")
  await fs.writeFile(outPath, content)

  console.log(`Wrote ${written} variable(s) to .env.local (${env})`)
  if (skippedSecrets > 0) console.log(`  ${skippedSecrets} secret(s) skipped`)
  if (skippedNonVite > 0) console.log(`  ${skippedNonVite} non-${ENV_PREFIX} var(s) skipped`)
}

main().catch((err) => {
  console.error("Unexpected error:", err)
  process.exit(1)
})
