import type { AnalysisStatus } from "@packages/shared"
import { sql } from "drizzle-orm"
import { Router } from "express"
import multer from "multer"

import { db } from "../db"
import { requireAuth } from "../middlewares/requireAuth"
import { analyzePipeline, getEmitter } from "../services/analyze-pipeline"

export const analyzeRouter = Router()

analyzeRouter.use(requireAuth)

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
})

analyzeRouter.post("/", upload.single("cvFile"), async (req, res) => {
  try {
    const userId = res.locals.session.user.id
    const jobDescription = req.body.jobDescription
    const language = req.body.language as "en" | "vn"
    const position = req.body.position || null
    const company = req.body.company || null

    if (!jobDescription) {
      return res.status(400).json({ code: 400, message: "Job description is required" })
    }

    const skills: string[] = req.body.skills ? JSON.parse(req.body.skills).map((s: { value: string }) => s.value) : []

    const [doc] = await db.execute<{ id: number }>(
      sql`INSERT INTO documents (user_id, position, company, job_description, skills) VALUES (${userId}, ${position}, ${company}, ${jobDescription}, ${JSON.stringify(skills)}::jsonb) RETURNING id`
    )

    if (!doc) {
      return res.status(500).json({ code: 500, message: "Failed to create document" })
    }

    const [result] = await db.execute<{ id: number }>(
      sql`INSERT INTO results (document_id, status) VALUES (${doc.id}, 'pending') RETURNING id`
    )

    if (!result) {
      return res.status(500).json({ code: 500, message: "Failed to create result" })
    }

    analyzePipeline({
      jobDescription,
      resultId: result.id,
      documentId: doc.id,
      file: req.file,
      language,
      skills,
    })

    res.json({ resultId: result.id })
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).json({ code: 500, message: e.message })
    }
  }
})

analyzeRouter.get("/results/:resultId/stream", async (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  })

  res.flushHeaders()

  const resultId = req.params.resultId

  const emitter = getEmitter(Number(resultId))

  const onStatus = (status: AnalysisStatus) => {
    res.write(`data: ${JSON.stringify({ status })}\n\n`)
    if (status === "completed" || status === "failed") {
      res.end()
    }
  }

  emitter.on("status", onStatus)

  req.on("close", () => {
    emitter.off("status", onStatus)
  })
})

analyzeRouter.get("/results/:resultId", async (req, res) => {
  try {
    const [row] = await db.execute<{
      id: number
      document_id: number
      status: string
      result: Record<string, unknown> | null
      error: string | null
      created_at: string
      effective_position: string | null
      effective_company: string | null
    }>(sql`
      SELECT r.*,
        COALESCE(d.position, r.result->>'position') AS effective_position,
        COALESCE(d.company,  r.result->>'company')  AS effective_company
      FROM results r
      JOIN documents d ON d.id = r.document_id
      WHERE r.id = ${Number(req.params.resultId)}
    `)
    if (!row) return res.status(404).json({ code: "NOT_FOUND", message: "Result not found" })

    const { effective_position, effective_company, ...rest } = row
    const payload = {
      ...rest,
      result: rest.result ? { ...rest.result, position: effective_position, company: effective_company } : null,
    }
    return res.set("Cache-Control", "no-store").json(payload)
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).json({ code: 500, message: e.message })
    }
  }
})
