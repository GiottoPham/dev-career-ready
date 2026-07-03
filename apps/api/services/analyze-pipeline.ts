import { EventEmitter } from "events"

import type { AnalysisStatus, AnalyzeResponse, Language } from "@packages/shared"
import { sql } from "drizzle-orm"

import { db } from "../db"

import { analyzeSkillGap } from "./ai/analyze"
import { validateJobDescription } from "./ai/validateJobDescription"
import { extractTextFromDocx } from "./docx/extractText"
import { extractTextFromPDF } from "./pdf/extractText"
import { uploadMiniFile } from "./supabase/upload-file"

const DOCX_MIME_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

const extractTextFromJDFile = (file: Express.Multer.File) =>
  file.mimetype === DOCX_MIME_TYPE ? extractTextFromDocx(file.buffer) : extractTextFromPDF(file.buffer)

const emitters = new Map<number, EventEmitter>()

export const getEmitter = (resultId: number): EventEmitter => {
  if (!emitters.has(resultId)) {
    emitters.set(resultId, new EventEmitter())
  }
  return emitters.get(resultId)!
}

const cleanupEmitter = (resultId: number) => {
  emitters.delete(resultId)
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const emitStatus = ({ resultId, status, error }: { resultId: number; status: AnalysisStatus; error?: string }) => {
  getEmitter(resultId).emit("status", { status, error })
}

const updateStatus = async ({
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

  emitStatus({ resultId, status, error })
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

export const analyzePipeline = async ({
  cvFile,
  jdFile,
  resultId,
  documentId,
  jobDescription: jdText,
  position,
  company,
  skills,
  language = "en",
}: {
  cvFile?: Express.Multer.File
  jdFile?: Express.Multer.File
  jobDescription?: string
  position?: string
  company?: string
  skills?: string[]
  resultId: number
  documentId: number
  language?: Language
}) => {
  try {
    await updateStatus({ resultId, status: "parsing" })
    await sleep(1000)

    const cvText = cvFile ? await extractTextFromPDF(cvFile.buffer) : ""
    const jobDescription = jdFile ? await extractTextFromJDFile(jdFile) : jdText

    if (!jobDescription) {
      throw new Error("Job description is required")
    }

    const validation = await validateJobDescription({ text: jobDescription, language })
    if (!validation.isJobDescription) {
      throw new Error(validation.reason ?? "The provided text does not look like a job description")
    }

    const resolvedPosition = position || validation.position || undefined
    const resolvedCompany = company || validation.company || undefined

    if (!resolvedPosition && !resolvedCompany) {
      throw new Error(missingMetaError("both", language))
    }
    if (!resolvedPosition) {
      throw new Error(missingMetaError("position", language))
    }
    if (!resolvedCompany) {
      throw new Error(missingMetaError("company", language))
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

    await updateStatus({ resultId, status: "uploading", documentId, cvText, jobDescription })
    await sleep(1000)

    const cvFileUrl = cvFile
      ? await uploadMiniFile({ bucketName: "cvs", buffer: cvFile.buffer, name: cvFile.originalname })
      : undefined
    const jdFileUrl = jdFile
      ? await uploadMiniFile({
          bucketName: "jds",
          buffer: jdFile.buffer,
          name: jdFile.originalname,
          contentType: jdFile.mimetype,
        })
      : undefined

    await updateStatus({ resultId, status: "analyzing", documentId, cvFileUrl, jdFileUrl })
    await sleep(1000)

    const result = await analyzeSkillGap({ jobDescription, cvText, language, skills })

    await updateStatus({ resultId, status: "completed", result })
  } catch (e) {
    if (e instanceof Error) await updateStatus({ resultId, status: "failed", error: e.message })
  }

  cleanupEmitter(resultId)
}
