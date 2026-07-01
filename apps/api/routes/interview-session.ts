import { camelCase } from "@packages/shared"
import { sql } from "drizzle-orm"
import { Router } from "express"

import { db } from "../db"
import { requireAuth } from "../middlewares/requireAuth"

export const interviewSessionsRouter = Router()

interviewSessionsRouter.use(requireAuth)

type Session = {
  id: number
  document_id: number
  status: string
  config: Record<string, unknown>
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
