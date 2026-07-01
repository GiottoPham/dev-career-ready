import { z } from "zod"

export const DIFFICULTIES = ["easy", "medium", "hard"] as const

export type Difficulty = (typeof DIFFICULTIES)[number]

export const FOCUS_AREAS = ["all", "gaps", "matched"] as const

export type FocusArea = (typeof FOCUS_AREAS)[number]

export const INTERVIEW_MODE = ["project", "technical"] as const

export type InterviewMode = (typeof INTERVIEW_MODE)[number]

export const SessionConfigSchema = z.object({
  mode: z.enum(INTERVIEW_MODE),
  difficulty: z.enum(DIFFICULTIES),
  focusArea: z.enum(FOCUS_AREAS),
  questionCount: z.number(),
  resultId: z.number(),
  language: z.enum(["vn", "en"]).optional(),
})

export type SessionConfig = z.infer<typeof SessionConfigSchema>

export const InterviewSummarySchema = z.object({
  feedback: z.string(),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  score: z.number(),
})

export type InterviewSummary = z.infer<typeof InterviewSummarySchema>

export const SessionTurnSchema = z.object({
  id: z.number(),
  sessionId: z.number(),
  turnIndex: z.number(),
  question: z.string(),
  userAnswer: z.string().optional(),
  createdAt: z.date(),
})

export type SessionTurn = z.infer<typeof SessionTurnSchema>

export const SESSION_STATUSES = ["active", "completed", "abandoned"] as const

export type SessionStatus = (typeof SESSION_STATUSES)[number]

export const InterviewSessionSchema = z.object({
  id: z.number(),
  documentId: z.number(),
  status: z.enum(SESSION_STATUSES),
  config: SessionConfigSchema,
  summary: InterviewSummarySchema.optional(),
  turns: SessionTurnSchema.array(),
  createdAt: z.date(),
  completedAt: z.date().optional(),
})

export type InterviewSession = z.infer<typeof InterviewSessionSchema>

export type CreateSessionResponse = {
  sessionId: number
  firstQuestion: string
}

export type SubmitAnswerResponse =
  | { isCompleted: false; nextQuestion: string; turnIndex: number }
  | { isCompleted: true; summary: InterviewSummary }
