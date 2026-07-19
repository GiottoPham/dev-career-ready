import type { AnalysisStatus, AnalyzeResponse, Language } from "@packages/shared"
import { sql } from "drizzle-orm"

import { db } from "../db"
import { redisConnection } from "../lib/redis"

import { analyzeSkillGap } from "./ai/analyze"
import { validateJobDescription } from "./ai/validateJobDescription"
import { publishStatus } from "./redis/analyze/status-pubsub"
import type { AnalyzeJobData } from "./redis/analyze/utils"
import { uploadMiniFile } from "./supabase/upload-file"

export const updateStatus = async ({
  resultId,
  status,
  result,
  error,
  documentId,
  cvFileUrl,
  jdFileUrl,
  cvText,
  jobDescription,
}: {
  resultId: number
  status: AnalysisStatus
  result?: AnalyzeResponse
  error?: string
  documentId?: number
  cvFileUrl?: string
  jdFileUrl?: string
  cvText?: string
  jobDescription?: string
}) => {
  await db.execute(sql`UPDATE results SET status = ${status} WHERE id = ${resultId}`)

  if (result) {
    await db.execute(sql`UPDATE results SET result = ${JSON.stringify(result)}::jsonb WHERE id = ${resultId}`)
  }

  if (error) {
    await db.execute(sql`UPDATE results SET error = ${error} WHERE id = ${resultId}`)
  }

  if (documentId && (cvFileUrl || jdFileUrl || cvText || jobDescription)) {
    await db.execute(sql`
      UPDATE documents
      SET
        cv_file_url      = COALESCE(${cvFileUrl ?? null}, cv_file_url),
        jd_file_url      = COALESCE(${jdFileUrl ?? null}, jd_file_url),
        cv_text          = COALESCE(${cvText ?? null}, cv_text),
        job_description  = COALESCE(${jobDescription ?? null}, job_description)
      WHERE id = ${documentId}
    `)
  }

  await publishStatus({ resultId, payload: { status, error } })
}

const missingMetaError = (missing: "position" | "company" | "both", language: Language) => {
  const labels =
    language === "vi"
      ? { position: "vị trí ứng tuyển", company: "tên công ty", both: "vị trí ứng tuyển và tên công ty" }
      : { position: "the job position", company: "the company name", both: "the job position and company name" }
  const field = labels[missing]
  return language === "vi"
    ? `Không tìm thấy ${field} trong JD. Vui lòng nhập thủ công vào ô tương ứng.`
    : `Could not find ${field} in the job description. Please fill it in manually.`
}

export const runAnalyzeJob = async ({
  resultId,
  documentId,
  jobDescription,
  cvText,
  position,
  company,
  skills,
  language = "en",
  cvBufferKey,
  jdBufferKey,
  cvFileName,
  jdFileName,
  jdMimeType,
}: AnalyzeJobData) => {
  /* Validating Process */

  await updateStatus({ resultId, status: "validating" })
  const validation = await validateJobDescription({ text: jobDescription, language })

  if (!validation.isJobDescription) {
    await updateStatus({
      resultId,
      status: "failed",
      error: validation.reason ?? "The provided text does not look like a job description",
    })
    return
  }

  const resolvedPosition = position || validation.position || undefined
  const resolvedCompany = company || validation.company || undefined

  if (!resolvedPosition || !resolvedCompany) {
    const missing = !resolvedPosition && !resolvedCompany ? "both" : !resolvedPosition ? "position" : "company"
    await updateStatus({ resultId, status: "failed", error: missingMetaError(missing, language) })
    return
  }

  if (resolvedPosition !== position || resolvedCompany !== company) {
    await db.execute(sql`
        UPDATE documents
        SET
          position = COALESCE(position, ${resolvedPosition ?? null}),
          company  = COALESCE(company,  ${resolvedCompany ?? null})
        WHERE id = ${documentId}
      `)
  }

  /* Uploading Process */

  await updateStatus({ resultId, status: "uploading", documentId, cvText, jobDescription })

  let jdFileUrl = undefined
  let cvFileUrl = undefined

  if (cvBufferKey && cvFileName) {
    const cvBuffer = await redisConnection.getBuffer(cvBufferKey)
    if (cvBuffer) {
      cvFileUrl = await uploadMiniFile({ bucketName: "cvs", buffer: cvBuffer, name: cvFileName })
    }
  }

  if (jdBufferKey && jdFileName) {
    const jdBuffer = await redisConnection.getBuffer(jdBufferKey)
    if (jdBuffer) {
      jdFileUrl = await uploadMiniFile({
        bucketName: "jds",
        buffer: jdBuffer,
        name: jdFileName,
        contentType: jdMimeType,
      })
    }
  }

  /* Analyzing Process */

  await updateStatus({ resultId, status: "analyzing", documentId, cvFileUrl, jdFileUrl })

  const result = await analyzeSkillGap({ jobDescription, cvText, language, skills })

  await updateStatus({ resultId, status: "completed", result })
}
