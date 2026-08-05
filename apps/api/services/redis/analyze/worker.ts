import { Worker } from "bullmq"

import { isRedisAvailable, markRedisDegraded, redisConnection } from "../../../lib/redis"
import { runAnalyzeJob, updateStatus } from "../../analyze-pipeline"

import { ANALYZE_QUEUE_NAME, type AnalyzeJobData } from "./utils"

declare global {
  var __analyzeWorker: Worker<AnalyzeJobData> | undefined
  var __analyzeWorkerHealthy: boolean | undefined
  var __analyzeWorkerRetryTimer: ReturnType<typeof setInterval> | undefined
}

const RETRY_INTERVAL_MS = 60_000

const startWorker = () => {
  const worker = new Worker<AnalyzeJobData>(ANALYZE_QUEUE_NAME, (job) => runAnalyzeJob(job.data), {
    connection: redisConnection!,
    concurrency: Number(process.env.ANALYZE_WORKER_CONCURRENCY),
  })

  worker.on("failed", async (job) => {
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

  // BullMQ's internal maintenance loops (e.g. moving stalled jobs) retry
  // immediately with no backoff on a command-level error, which turns a
  // quota-exceeded Redis into a tight error loop. Close the worker to stop
  // it, mark Redis degraded (cooldown), and let the retry timer below bring
  // a fresh worker back up once Redis is usable again.
  worker.on("error", (err) => {
    if (globalThis.__analyzeWorkerHealthy !== false) {
      // eslint-disable-next-line no-console
      console.error("[analyzeWorker] background error, pausing queue processing:", err.message)
    }
    globalThis.__analyzeWorkerHealthy = false
    markRedisDegraded()
    worker.close().catch(() => {})
  })

  globalThis.__analyzeWorker = worker
  globalThis.__analyzeWorkerHealthy = true
}

if (redisConnection && globalThis.__analyzeWorker === undefined) {
  startWorker()
}

if (redisConnection && globalThis.__analyzeWorkerRetryTimer === undefined) {
  globalThis.__analyzeWorkerRetryTimer = setInterval(() => {
    if (!globalThis.__analyzeWorkerHealthy && isRedisAvailable()) {
      startWorker()
    }
  }, RETRY_INTERVAL_MS)
}

export const isQueueHealthy = () => globalThis.__analyzeWorkerHealthy === true
