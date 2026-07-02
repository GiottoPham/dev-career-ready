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

analyzeRouter.post(
  "/",
  upload.fields([
    { name: "cvFile", maxCount: 1 },
    { name: "jdFile", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const userId = res.locals.session.user.id
      const files = req.files as { cvFile?: Express.Multer.File[]; jdFile?: Express.Multer.File[] } | undefined
      const cvFile = files?.cvFile?.[0]
      const jdFile = files?.jdFile?.[0]
      const language = req.body.language as "en" | "vn"
      const position = req.body.position || undefined
      const company = req.body.company || undefined
      const jobDescription: string | undefined = req.body.jobDescription || undefined

      if (!jobDescription && !jdFile) {
        return res.status(400).json({ code: 400, message: "Job description is required" })
      }

      const skills: string[] = req.body.skills
        ? JSON.parse(req.body.skills).map((s: { value: string }) => s.value)
        : []

      const [doc] = await db.execute<{ id: number }>(
        sql`INSERT INTO documents (user_id, position, company, job_description, skills) VALUES (${userId}, ${position ?? null}, ${company ?? null}, ${jobDescription ?? null}, ${JSON.stringify(skills)}::jsonb) RETURNING id`
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
        cvFile,
        jdFile,
        language,
        skills,
      })

      res.json({ resultId: result.id })
    } catch (e) {
      if (e instanceof Error) {
        res.status(500).json({ code: 500, message: e.message })
      }
    }
  }
)

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

  const onStatus = ({ status, error }: { status: AnalysisStatus; error?: string }) => {
    res.write(`data: ${JSON.stringify({ status, error })}\n\n`)
    if (status === "completed" || status === "failed") {
      res.end()
    }
  }

  emitter.on("status", onStatus)

  req.on("close", () => {
    emitter.off("status", onStatus)
  })
})
