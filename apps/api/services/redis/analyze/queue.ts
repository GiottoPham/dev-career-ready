import { Queue } from "bullmq"

import { redisConnection } from "../../../lib/redis"

import { ANALYZE_QUEUE_NAME, type AnalyzeJobData } from "./utils"

// Survive `bun --hot` reloads: reuse the existing Queue instead of leaking a new one.
declare global {
  var __analyzeQueue: Queue<AnalyzeJobData> | undefined
}

export const analyzeQueue = (globalThis.__analyzeQueue ??= new Queue<AnalyzeJobData>(ANALYZE_QUEUE_NAME, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: Number(process.env.GEMINI_JOB_ATTEMPTS),
    backoff: { type: "exponential", delay: Number(process.env.GEMINI_JOB_BACKOFF_MS) },
    removeOnComplete: { age: 3600 },
    removeOnFail: { age: 86400 },
  },
}))
