import { mkdirSync } from "node:fs"

const url = process.env.DATABASE_URL
if (!url) {
  // eslint-disable-next-line no-console
  console.error("DATABASE_URL is not set")
  process.exit(1)
}

const backupsDir = new URL("../backups", import.meta.url).pathname
mkdirSync(backupsDir, { recursive: true })

const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)
const file = `${backupsDir}/backup_${timestamp}.sql`

await Bun.$`pg_dump ${url} --data-only --schema=public --no-owner --no-acl -f ${file}`
// eslint-disable-next-line no-console
console.log(`Backup saved to backups/backup_${timestamp}.sql`)
