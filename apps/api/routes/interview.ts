import { SessionConfigSchema, type AnalyzeResponse } from "@packages/shared"
import { sql } from "drizzle-orm"
import { Router } from "express"

import { db } from "../db"
import { requireAuth } from "../middlewares/requireAuth"
import { generateNextQuestion } from "../services/ai/interview"

export const interviewRouter = Router()

interviewRouter.use(requireAuth)

type ResultWithDocument = {
  document_id: number
  user_id: string
  job_description: string
  cv_text: string
  result: AnalyzeResponse
}

interviewRouter.post("/", async (req, res) => {
  try {
    const { resultId, ...config } = SessionConfigSchema.parse(req.body)
    const { difficulty, focusArea, mode, language } = config

    const userId = res.locals.session.user.id

    const [row] = await db.execute<ResultWithDocument>(
      sql`SELECT d.id AS document_id, d.user_id, d.job_description, d.cv_text, r.result from results r INNER JOIN documents d ON d.id = r.document_id WHERE r.id=${resultId}`
    )

    if (!row) {
      return res.status(404).json({ code: "NOT_FOUND" })
    }
    if (row.user_id !== userId) {
      return res.status(403).json({ code: "FORBIDDEN" })
    }

    const firstQuestion = await generateNextQuestion({
      cvText: row.cv_text,
      matchedSkills: row.result.matchedSkills,
      missingSkills: row.result.missingSkills.map(({ skill }) => skill),
      jobDescription: row.job_description,
      history: [],
      difficulty,
      mode,
      focusArea,
      language,
    })

    await db.transaction(async (tx) => {
      const [session] = await tx.execute<{ id: number }>(
        sql`INSERT INTO interview_sessions(user_id,document_id,config) VALUES (${userId}, ${row.document_id}, ${JSON.stringify({ ...config, resultId })}::jsonb) returning id`
      )

      if (!session) {
        throw new Error("Failed to create session")
      }

      await tx.execute(
        sql`INSERT INTO session_turns(session_id,turn_index,question) VALUES (${session.id}, 0, ${firstQuestion})`
      )

      return res.json({ sessionId: session.id, firstQuestion })
    })
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).json({ code: 500, message: e.message })
    }
  }
})
