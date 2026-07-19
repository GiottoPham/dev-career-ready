import type { AnalysisStatus, Language } from "@packages/shared"
import { sql } from "drizzle-orm"
import { Router } from "express"
import multer from "multer"

import { db } from "../db"
import { redisConnection } from "../lib/redis"
import { requireAuth } from "../middlewares/requireAuth"
import { extractTextFromDocx } from "../services/documents/extractTextFromDocx"
import { extractTextFromPDF } from "../services/documents/extractTextFromPDF"
import { analyzeQueue } from "../services/redis/analyze/queue"
import { subscribeToStatus } from "../services/redis/analyze/status-pubsub"

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
      const language = req.body.language as Language
      const position = req.body.position
      const company = req.body.company
      const jobDescriptionInput = req.body.jobDescription

      if (!jobDescriptionInput && !jdFile) {
        return res.status(400).json({ code: 400, message: "Job description is required" })
      }

      const skills: string[] = req.body.skills ? JSON.parse(req.body.skills).map((s: { value: string }) => s.value) : []

      const [doc] = await db.execute<{ id: number }>(
        sql`INSERT INTO documents (user_id, position, company, job_description, skills) VALUES (${userId}, ${position ?? null}, ${company ?? null}, ${jobDescriptionInput ?? null}, ${JSON.stringify(skills)}::jsonb) RETURNING id`
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

      const cvText = cvFile ? await extractTextFromPDF(cvFile.buffer) : ""

      const jobDescription = jdFile ? await extractTextFromJDFile(jdFile) : jobDescriptionInput

      if (!jobDescription) {
        return res.status(400).json({ code: 400, message: "Job description is required" })
      }

      const cvBufferKey = cvFile ? `upload-temp:cv:${result.id}` : undefined
      const jdBufferKey = jdFile ? `upload-temp:jd:${result.id}` : undefined

      if (cvFile) {
        await redisConnection.set(cvBufferKey!, cvFile.buffer, "EX", 600)
      }
      if (jdFile) {
        await redisConnection.set(jdBufferKey!, jdFile.buffer, "EX", 600)
      }

      await analyzeQueue.add(
        "analyze",
        {
          resultId: result.id,
          documentId: doc.id,
          cvText,
          jobDescription,
          position,
          company,
          skills,
          language,
          cvBufferKey,
          cvFileName: cvFile?.originalname,
          jdBufferKey,
          jdFileName: jdFile?.originalname,
          jdMimeType: jdFile?.mimetype,
        },
        { jobId: `analyze-${result.id}` } // idempotent: rejects a duplicate add() for the same result
      )

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

  const onStatus = ({ status, error }: { status: AnalysisStatus; error?: string }) => {
    res.write(`data: ${JSON.stringify({ status, error })}\n\n`)
    if (status === "completed" || status === "failed") {
      res.end()
    }
  }

  const unsubscribe = subscribeToStatus({
    resultId: Number(resultId),
    onStatus,
  })

  req.on("close", () => {
    unsubscribe()
  })
})

const DOCX_MIME_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

const extractTextFromJDFile = (file: Express.Multer.File) =>
  file.mimetype === DOCX_MIME_TYPE ? extractTextFromDocx(file.buffer) : extractTextFromPDF(file.buffer)
