import { Worker } from "bullmq"

import { redisConnection } from "../../../lib/redis"
import { runAnalyzeJob, updateStatus } from "../../analyze-pipeline"

import { ANALYZE_QUEUE_NAME, type AnalyzeJobData } from "./utils"

export const analyzeWorker = new Worker<AnalyzeJobData>(ANALYZE_QUEUE_NAME, (job) => runAnalyzeJob(job.data), {
  connection: redisConnection,
  concurrency: Number(process.env.ANALYZE_WORKER_CONCURRENCY),
})

analyzeWorker.on("failed", async (job) => {
  if (!job) {
    return
  }

  const attempts = job.opts.attempts ?? 1

  if (job.attemptsMade >= attempts) {
    await updateStatus({
      resultId: job.data.resultId,
      status: "failed",
      error: "AI service temporarily unavailable, please try again.",
    })
  }
})
