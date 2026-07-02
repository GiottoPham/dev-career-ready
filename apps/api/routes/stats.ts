import { sql } from "drizzle-orm"
import { Router } from "express"

import { db } from "../db"
import { requireAuth } from "../middlewares/requireAuth"

export const statsRouter = Router()

statsRouter.use(requireAuth)

statsRouter.get("/", async (req, res) => {
  try {
    const userId = res.locals.session.user.id

    const [analysisRow, sessionRow] = await Promise.all([
      db.execute<{ total: string }>(sql`
        SELECT COUNT(*) AS total
        FROM results r
        INNER JOIN documents d ON d.id = r.document_id
        WHERE d.user_id = ${userId} AND r.result IS NOT NULL
      `),
      db.execute<{
        completed_count: string
        this_month_avg?: string
        last_month_avg?: string
      }>(sql`
        SELECT
          COUNT(*) FILTER (WHERE status = 'completed') AS completed_count,
          AVG(CASE
            WHEN DATE_TRUNC('month', completed_at) = DATE_TRUNC('month', NOW())
            THEN (summary->>'score')::int
          END) AS this_month_avg,
          AVG(CASE
            WHEN DATE_TRUNC('month', completed_at) = DATE_TRUNC('month', NOW() - INTERVAL '1 month')
            THEN (summary->>'score')::int
          END) AS last_month_avg
        FROM interview_sessions
        WHERE user_id = ${userId}
      `),
    ])

    const analysis = analysisRow[0]
    const session = sessionRow[0]

    return res.json({
      analysisCount: Number(analysis?.total ?? 0),
      sessionCompletedCount: Number(session?.completed_count ?? 0),
      thisMonthAvg: Math.round(Number(session?.this_month_avg ?? 0)),
      lastMonthAvg: Math.round(Number(session?.last_month_avg ?? 0)),
    })
  } catch (e) {
    if (e instanceof Error) res.status(500).json({ code: "INTERNAL_ERROR", message: e.message })
  }
})
