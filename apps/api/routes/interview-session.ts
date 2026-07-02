import { camelCase, SESSION_STATUSES, type AnalyzeResponse, type SessionConfig } from "@packages/shared"
import { sql } from "drizzle-orm"
import { Router } from "express"
import { z } from "zod"

import { db } from "../db"
import { requireAuth } from "../middlewares/requireAuth"
import { generateNextQuestion, generateSummary } from "../services/ai/interview"

export const interviewSessionsRouter = Router()

interviewSessionsRouter.use(requireAuth)

type Session = {
  id: number
  document_id: number
  status: string
  config: SessionConfig
  summary?: Record<string, unknown>
  created_at: string
  completed_at?: string
  company?: string
  position?: string
}

type SessionTurn = {
  id: number
  session_id: number
  turn_index: number
  question: string
  user_answer?: string
  created_at?: string
}

type ResultWithDocument = {
  document_id: number
  user_id: string
  job_description: string
  cv_text: string
  result: AnalyzeResponse
}

interviewSessionsRouter.get("/:sessionId", async (req, res) => {
  try {
    const userId = res.locals.session.user.id
    const sessionId = Number(req.params.sessionId)

    const [session] = await db.execute<Session>(sql`
      SELECT i.*, d.company, d.position FROM interview_sessions i
      inner join documents d on d.id = i.document_id
      WHERE i.id = ${sessionId} AND i.user_id = ${userId}
    `)

    if (!session) return res.status(404).json({ code: "NOT_FOUND" })

    const turns = await db.execute<SessionTurn>(sql`
      SELECT * FROM session_turns
      WHERE session_id = ${sessionId}
      ORDER BY turn_index ASC
    `)

    return res.json({ ...camelCase(session), turns: turns.map(camelCase) })
  } catch (e) {
    if (e instanceof Error) res.status(500).json({ code: "INTERNAL_ERROR", message: e.message })
  }
})

const submitAnswerSchema = z.object({
  answer: z.string().min(1),
})

interviewSessionsRouter.post("/:sessionId/answer", async (req, res) => {
  try {
    const { answer } = submitAnswerSchema.parse(req.body)
    const sessionId = Number(req.params.sessionId)
    const userId = res.locals.session.user.id

    const [[session], turns] = await Promise.all([
      db.execute<Session>(sql`SELECT * FROM interview_sessions WHERE id = ${sessionId} AND user_id = ${userId}`),
      db.execute<SessionTurn>(sql`SELECT * FROM session_turns WHERE session_id = ${sessionId} ORDER BY turn_index ASC`),
    ])

    if (!session) return res.status(404).json({ code: "NOT_FOUND" })
    if (session.status !== "active") return res.status(400).json({ code: "SESSION_CLOSED" })
    if (turns.length === 0) return res.status(404).json({ code: "NOT_FOUND" })

    const currentTurn = turns[turns.length - 1]!
    const history = [
      ...turns.slice(0, -1).map(({ question, user_answer }) => ({ question, answer: user_answer! })),
      { question: currentTurn.question, answer },
    ]

    await db.execute(sql`UPDATE session_turns SET user_answer = ${answer} WHERE id = ${currentTurn.id}`)

    if (turns.length === session.config.questionCount) {
      const summary = await generateSummary({ history, mode: session.config.mode })
      await db.execute(sql`
        UPDATE interview_sessions
        SET summary = ${JSON.stringify(summary)}::jsonb, status = 'completed', completed_at = NOW()
        WHERE id = ${sessionId}
      `)
      return res.json({ sessionId: session.id })
    }

    const [row] = await db.execute<ResultWithDocument>(
      sql`SELECT d.id AS document_id, d.user_id, d.job_description, d.cv_text, r.result FROM results r INNER JOIN documents d ON d.id = r.document_id WHERE r.id = ${session.config.resultId}`
    )

    const nextQuestion = await generateNextQuestion({
      cvText: row?.cv_text,
      matchedSkills: row?.result.matchedSkills,
      missingSkills: row?.result.missingSkills.map(({ skill }) => skill),
      jobDescription: row?.job_description,
      history,
      difficulty: session.config.difficulty,
      mode: session.config.mode,
      focusArea: session.config.focusArea,
      language: session.config.language,
    })

    await db.execute(sql`
      INSERT INTO session_turns (session_id, turn_index, question)
      VALUES (${sessionId}, ${turns.length}, ${nextQuestion})
    `)

    return res.json({ sessionId: session.id })
  } catch (e) {
    if (e instanceof Error) res.status(500).json({ code: "INTERNAL_ERROR", message: e.message })
  }
})

const paginationRequestsParamsSchema = z.object({
  limit: z.preprocess((val) => Number(val), z.number()),
  page: z.preprocess((val) => Number(val), z.number()),
  status: z.enum(SESSION_STATUSES).optional(),
})

interviewSessionsRouter.get("/", async (req, res) => {
  try {
    const userId = res.locals.session.user.id
    const { limit, page, status } = paginationRequestsParamsSchema.parse(req.query)
    const offset = (page - 1) * limit

    let totalSql = sql`select s.*, d.company, d.position from interview_sessions s inner join documents d on d.id = s.document_id where s.user_id = ${userId}`

    if (status) {
      totalSql = totalSql.append(sql` and s.status = ${status}`)
    }

    totalSql = totalSql.append(sql` group by s.id, d.company, d.position order by s.created_at desc`)

    const countRow = await db.execute<{ total: string }>(totalSql)

    const total = countRow.length

    const totalPage = Math.ceil(total / limit)

    totalSql = totalSql.append(sql` limit ${limit} offset ${offset}`)

    const sessions = await db.execute<Session>(totalSql)

    return res.json({ data: sessions.map(camelCase), limit, page, total, totalPage })
  } catch (e) {
    if (e instanceof Error) res.status(500).json({ code: "INTERNAL_ERROR", message: e.message })
  }
})
