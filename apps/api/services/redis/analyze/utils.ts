import type { Language } from "@packages/shared"

export type AnalyzeJobData = {
  resultId: number
  documentId: number
  cvText: string
  jobDescription: string
  position?: string
  company?: string
  skills?: string[]
  language?: Language
  cvBufferKey?: string
  cvFileName?: string
  jdBufferKey?: string
  jdFileName?: string
  jdMimeType?: string
}

export const ANALYZE_QUEUE_NAME = "analyze"
