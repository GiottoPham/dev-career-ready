import { Queue } from "bullmq"

import { redisConnection } from "../../../lib/redis"

import { ANALYZE_QUEUE_NAME, type AnalyzeJobData } from "./utils"

export const analyzeQueue = new Queue<AnalyzeJobData>(ANALYZE_QUEUE_NAME, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: Number(process.env.GEMINI_JOB_ATTEMPTS),
    backoff: { type: "exponential", delay: Number(process.env.GEMINI_JOB_BACKOFF_MS) },
    removeOnComplete: { age: 3600 },
    removeOnFail: { age: 86400 },
  },
})
