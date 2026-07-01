import { z } from "zod"

export { camelCase } from "./utils/camel"

export const QuestionCategories = ["technical", "behavioral", "situational"] as const

export const interviewQuestionSchema = z.object({
  question: z.string(),
  answer: z.string(),
  skill: z.string(),
  category: z.enum(QuestionCategories),
})

export type InterviewQuestion = z.infer<typeof interviewQuestionSchema>

export type PaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  limit: number
  totalPage: number
}

export * from "./analyze/index.ts"
export * from "./interview-session/index.ts"
