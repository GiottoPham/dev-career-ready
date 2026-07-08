/* eslint-disable no-console */
import { asc, desc, sql } from "drizzle-orm"

import { db } from "../db/index.ts"
import { documents, interviewSessions, users } from "../db/schema.ts"

const [data] = await db.select({ count: sql<number>`count(*)::int` }).from(users)

console.log(`Total registered users: ${data?.count ?? 0}`)

const rows = await db
  .select({ id: users.id, email: users.email, name: users.name, createdAt: users.createdAt })
  .from(users)
  .orderBy(desc(users.createdAt))

const analyses = await db
  .select({ userId: documents.userId, createdAt: documents.createdAt })
  .from(documents)
  .orderBy(asc(documents.createdAt))

const sessions = await db
  .select({ userId: interviewSessions.userId, createdAt: interviewSessions.createdAt })
  .from(interviewSessions)
  .orderBy(asc(interviewSessions.createdAt))

const analysesByUser = Map.groupBy(analyses, (a) => a.userId)
const sessionsByUser = Map.groupBy(sessions, (s) => s.userId)

console.log("")
for (const row of rows) {
  const userAnalyses = analysesByUser.get(row.id) ?? []
  const userSessions = sessionsByUser.get(row.id) ?? []
  const lastAnalysis = userAnalyses.at(-1)?.createdAt.toISOString() ?? "-"
  const lastSession = userSessions.at(-1)?.createdAt.toISOString() ?? "-"

  console.log(`${row.createdAt.toISOString()}  ${row.email}  (${row.name})`)
  console.log(`  analyses: ${userAnalyses.length} (latest: ${lastAnalysis})`)
  console.log(`  interview sessions: ${userSessions.length} (latest: ${lastSession})`)
}

process.exit(0)
