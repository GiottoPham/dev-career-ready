import { z } from "zod"

export const analyzeRequestSchema = z.object({
  jobDescription: z.string().min(1),
  skills: z.array(z.string()).optional(),
  cvText: z.string().optional(),
})

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>

export const Priorities = ["high", "low"] as const

export const analyzeResponseSchema = z.object({
  matchedSkills: z.array(z.string()),
  missingSkills: z.array(
    z.object({
      skill: z.string(),
      priority: z.enum(Priorities),
    })
  ),
  roadmap: z.array(
    z.object({
      skill: z.string(),
      guide: z.string(),
      priority: z.enum(Priorities),
      resources: z.array(
        z.object({
          title: z.string(),
          url: z.string().optional(),
          type: z.enum(["course", "documentation", "tutorial", "book", "project"]),
        })
      ),
    })
  ),
})

export type AnalyzeResponse = z.infer<typeof analyzeResponseSchema>

export const QuestionCategories = ["technical", "behavioral", "situational"] as const

export const interviewQuestionSchema = z.object({
  question: z.string(),
  answer: z.string(),
  skill: z.string(),
  category: z.enum(QuestionCategories),
})

export type InterviewQuestion = z.infer<typeof interviewQuestionSchema>
