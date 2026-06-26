import { EventEmitter } from "events"

import type { AnalysisStatus, AnalyzeResponse } from "@packages/shared"
import { sql } from "drizzle-orm"

import { db } from "../db"

import { analyzeSkillGap } from "./ai/analyze"
import { extractTextFromPDF } from "./pdf/extractText"
import { uploadMiniFile } from "./supabase/upload-file"

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

const emitStatus = ({ resultId, status }: { resultId: number; status: AnalysisStatus }) => {
  getEmitter(resultId).emit("status", status)
}

const updateStatus = async ({
  resultId,
  status,
  result,
}: {
  resultId: number
  status: AnalysisStatus
  result?: AnalyzeResponse
}) => {
  await db.execute(sql`UPDATE results SET status = ${status} WHERE id = ${resultId}`)

  if (result) {
    await db.execute(sql`UPDATE results SET result = ${JSON.stringify(result)}::jsonb WHERE id = ${resultId}`)
  }

  emitStatus({ resultId, status })
}

export const analyzePipeline = async ({
  file,
  resultId,
  jobDescription,
  skills,
  language = "en",
}: {
  file?: Express.Multer.File
  jobDescription: string
  skills?: string[]
  resultId: number
  language?: "vn" | "en"
}) => {
  try {
    console.log("bayaka", file)
    await updateStatus({ resultId, status: "uploading_cv" })
    await sleep(1000)

    if (file) {
      await uploadMiniFile({ bucketName: "cvs", buffer: file.buffer, name: file.originalname })
    }

    await updateStatus({ resultId, status: "parsing_cv" })
    await sleep(1000)

    let cvText: string = ""

    if (file) {
      cvText = await extractTextFromPDF(file.buffer)
    }

    await updateStatus({ resultId, status: "analyzing" })
    await sleep(1000)

    const result = await analyzeSkillGap({ jobDescription, cvText, language, skills })

    await updateStatus({ resultId, status: "completed", result })
  } catch (e) {
    console.log("analyze-error", e)
    if (e instanceof Error) await updateStatus({ resultId, status: "failed" })
  }

  cleanupEmitter(resultId)
}
