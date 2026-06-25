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
  "parsing_jd",
  "extracting_cv",
  "analyzing",
  "generating_tips",
  "completed",
  "failed",
] as const

export type AnalysisStatus = (typeof AnalysisStatuses)[number]

export const ANALYSIS_STEPS = [
  "parsing_jd",
  "extracting_cv",
  "analyzing",
  "generating_tips",
] as const satisfies AnalysisStatus[]

export const analysisResultSchema = z.object({
  id: z.string(),
  status: z.enum(AnalysisStatuses),
  result: analyzeResponseSchema.optional(),
})

export type AnalysisResultResponse = z.infer<typeof analysisResultSchema>

export const QuestionCategories = ["technical", "behavioral", "situational"] as const

export const interviewQuestionSchema = z.object({
  question: z.string(),
  answer: z.string(),
  skill: z.string(),
  category: z.enum(QuestionCategories),
})

export type InterviewQuestion = z.infer<typeof interviewQuestionSchema>
