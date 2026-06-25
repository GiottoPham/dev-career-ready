import { readdirSync } from "node:fs"

import postgres from "postgres"

const url = process.env.DATABASE_URL
if (!url) {
  console.error("DATABASE_URL is not set")
  process.exit(1)
}

const backupsDir = new URL("../backups", import.meta.url).pathname

let file = process.argv[2]

if (!file) {
  const latest = readdirSync(backupsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort()
    .at(-1)
  if (!latest) {
    console.error("No backup files found in backups/")
    process.exit(1)
  }
  file = `${backupsDir}/${latest}`
  console.log(`No file specified, using latest: ${latest}`)
}

const sql = postgres(url)
const tables = await sql<{ tablename: string }[]>`
  SELECT tablename FROM pg_tables
  WHERE schemaname = 'public'
`

if (tables.length > 0) {
  const list = tables.map((t) => `"${t.tablename}"`).join(", ")
  // Truncate all at once — CASCADE handles FK constraints in one shot
  await sql.unsafe(`TRUNCATE TABLE ${list} CASCADE`)
  console.log(`Truncated ${tables.length} tables`)
}
await sql.end()

await Bun.$`psql ${url} -f ${file}`
console.log("Restore complete")
