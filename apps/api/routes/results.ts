import { sql } from "drizzle-orm"
import { Router } from "express"

import { db } from "../db"

export const resultsRouter = Router()

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
