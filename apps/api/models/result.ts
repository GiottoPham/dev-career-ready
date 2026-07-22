import type { AnalyzeResponse } from "@packages/shared"
import { sql } from "drizzle-orm"

import { db } from "../db"

export type ResultWithDocument = {
  document_id: number
  user_id: string
  job_description: string
  cv_text: string
  result: AnalyzeResponse
}

export async function findResultWithDocument(resultId: number) {
  const [row] = await db.execute<ResultWithDocument>(sql`
    SELECT d.id AS document_id, d.user_id, d.job_description, d.cv_text, r.result
    FROM results r
    INNER JOIN documents d ON d.id = r.document_id
    WHERE r.id = ${resultId}
  `)
  return row
}
