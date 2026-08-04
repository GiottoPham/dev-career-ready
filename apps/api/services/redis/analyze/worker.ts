import { Worker } from "bullmq"

import { redisConnection } from "../../../lib/redis"
import { runAnalyzeJob, updateStatus } from "../../analyze-pipeline"

import { ANALYZE_QUEUE_NAME, type AnalyzeJobData } from "./utils"

// Survive `bun --hot` reloads: without this, every reload of this module would
// construct a new Worker (new blocking connection + idle poll loop) on top of the
// previous one, which never gets closed — stacking pollers over a dev session.
declare global {
  var __analyzeWorker: Worker<AnalyzeJobData> | undefined
}

if (globalThis.__analyzeWorker) {
  await globalThis.__analyzeWorker.close()
}

export const analyzeWorker = new Worker<AnalyzeJobData>(ANALYZE_QUEUE_NAME, (job) => runAnalyzeJob(job.data), {
  connection: redisConnection,
  concurrency: Number(process.env.ANALYZE_WORKER_CONCURRENCY),
})

globalThis.__analyzeWorker = analyzeWorker

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
