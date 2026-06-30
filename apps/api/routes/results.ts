import { sql } from "drizzle-orm"
import { Router } from "express"
import z from "zod"

import { db } from "../db"
import { requireAuth } from "../middlewares/requireAuth"

export const resultsRouter = Router()

resultsRouter.use(requireAuth)

resultsRouter.get("/:resultId", async (req, res) => {
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

const resultRequestsParamsSchema = z.object({
  limit: z.preprocess((val) => Number(val), z.number()),
  page: z.preprocess((val) => Number(val), z.number()),
})

resultsRouter.get("/", async (req, res) => {
  try {
    const { limit, page } = resultRequestsParamsSchema.parse(req.query)
    const userId = res.locals.session.user.id

    const offset = (page - 1) * limit

    const [countRow] = await db.execute<{ total: string }>(sql`
    SELECT COUNT(*) AS total
    FROM results r
    JOIN documents d ON d.id = r.document_id
    WHERE d.user_id = ${userId}
  `)

    const total = Number(countRow?.total ?? 0)

    const totalPage = Math.ceil(total / limit)

    const rows = await db.execute<{
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
        d.user_id,
        COALESCE(d.position, r.result->>'position') AS effective_position,
        COALESCE(d.company,  r.result->>'company')  AS effective_company
      FROM results r
      JOIN documents d ON d.id = r.document_id
      WHERE d.user_id = ${userId} AND r.result IS NOT NULL
      ORDER BY r.created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `)

    const results = rows.map((row) => {
      const { effective_position, effective_company, created_at, ...rest } = row
      return {
        ...rest,
        ...rest.result,
        position: effective_position,
        company: effective_company,
        createdAt: created_at,
      }
    })

    return res.set("Cache-Control", "no-store").json({ data: results, limit, page, total, totalPage })
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).json({ code: 500, message: e.message })
    }
  }
})
