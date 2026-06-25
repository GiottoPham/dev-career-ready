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

export const AnalysisStatuses = [
  "pending",
  "uploading_cv",
  "parsing_cv",
  "analyzing",
  "completed",
  "failed",
] as const

export type AnalysisStatus = (typeof AnalysisStatuses)[number]

export const ANALYSIS_STEPS = [
  "uploading_cv",
  "parsing_cv",
  "analyzing",
] as const satisfies readonly AnalysisStatus[]

export interface AnalysisResultResponse {
  id: number
  status: AnalysisStatus
  result: AnalyzeResponse | null
  error: string | null
}

export const QuestionCategories = ["technical", "behavioral", "situational"] as const

export const interviewQuestionSchema = z.object({
  question: z.string(),
  answer: z.string(),
  skill: z.string(),
  category: z.enum(QuestionCategories),
})

export type InterviewQuestion = z.infer<typeof interviewQuestionSchema>
