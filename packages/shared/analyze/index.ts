import { z } from "zod"

export const analyzeRequestSchema = z.object({
  jobDescription: z.string().min(1),
  skills: z.array(z.string()).optional(),
  cvText: z.string().optional(),
})

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>

export const Priorities = ["high", "medium", "low"] as const

export const analyzeResponseSchema = z.object({
  position: z.string().optional(),
  company: z.string().optional(),
  matchedSkills: z.array(z.string()),
  missingSkills: z.array(
    z.object({
      skill: z.string(),
      priority: z.enum(Priorities),
    })
  ),
  cvTips: z.array(z.string()),
})

export type AnalyzeResponse = z.infer<typeof analyzeResponseSchema>

export const AnalysisStatuses = ["pending", "parsing", "uploading", "analyzing", "completed", "failed"] as const

export type AnalysisStatus = (typeof AnalysisStatuses)[number]

export const ANALYSIS_STEPS = ["parsing", "uploading", "analyzing"] as const satisfies readonly AnalysisStatus[]

export type AnalysisResultResponse = {
  id: number
  status: AnalysisStatus
  result?: AnalyzeResponse
  error?: string
  createdAt: Date
}

export type ResultResponse = AnalyzeResponse & {
  id: number
  createdAt: Date
}
