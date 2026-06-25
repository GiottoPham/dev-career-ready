import { sql } from "drizzle-orm"
import { Router } from "express"
import multer from "multer"

import { db } from "../db"
import { requireAuth } from "../middlewares/requireAuth"

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

    if (!jobDescription) {
      return res.status(400).json({ code: 400, message: "Job description is required" })
    }

    const skills: string[] = req.body.skills
      ? JSON.parse(req.body.skills).map((s: { value: string }) => s.value)
      : []

    const [doc] = await db.execute<{ id: number }>(
      sql`INSERT INTO documents (user_id, job_description, skills) VALUES (${userId}, ${jobDescription}, ${JSON.stringify(skills)}::jsonb) RETURNING id`
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

    res.json({ resultId: result.id })
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).json({ code: 500, message: e.message })
    }
  }
})
