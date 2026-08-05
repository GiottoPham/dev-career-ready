import { Queue } from "bullmq"

import { isRedisAvailable, markRedisDegraded, redisConnection } from "../../../lib/redis"
import { runAnalyzeJob, updateStatus } from "../../analyze-pipeline"

import { ANALYZE_QUEUE_NAME, type AnalyzeJobData } from "./utils"
import { isQueueHealthy } from "./worker"

declare global {
  var __analyzeQueue: Queue<AnalyzeJobData> | undefined
}

export const analyzeQueue = redisConnection
  ? (globalThis.__analyzeQueue ??= new Queue<AnalyzeJobData>(ANALYZE_QUEUE_NAME, {
      connection: redisConnection,
      defaultJobOptions: {
        attempts: Number(process.env.GEMINI_JOB_ATTEMPTS),
        backoff: { type: "exponential", delay: Number(process.env.GEMINI_JOB_BACKOFF_MS) },
        removeOnComplete: { age: 3600 },
        removeOnFail: { age: 86400 },
      },
    }))
  : undefined

type EnqueueAnalyzeJobData = Omit<AnalyzeJobData, "cvBufferKey" | "jdBufferKey" | "cvBuffer" | "jdBuffer">

const runDirectly = (data: EnqueueAnalyzeJobData, buffers: { cvBuffer?: Buffer; jdBuffer?: Buffer }) => {
  runAnalyzeJob({ ...data, cvBuffer: buffers.cvBuffer, jdBuffer: buffers.jdBuffer }).catch(async () => {
    await updateStatus({
      resultId: data.resultId,
      status: "failed",
      error: "AI service temporarily unavailable, please try again.",
    })
  })
}

/**
 * Single entry point for kicking off an analyze job. Goes through the BullMQ
 * queue when Redis is available and processing jobs; otherwise runs the
 * pipeline directly in-process (no queueing/retries) so the API keeps
 * working with Redis down or over quota.
 */
export const enqueueAnalyzeJob = async (
  data: EnqueueAnalyzeJobData,
  buffers: { cvBuffer?: Buffer; jdBuffer?: Buffer }
) => {
  if (analyzeQueue && isRedisAvailable() && isQueueHealthy()) {
    try {
      const cvBufferKey = buffers.cvBuffer ? `upload-temp:cv:${data.resultId}` : undefined
      const jdBufferKey = buffers.jdBuffer ? `upload-temp:jd:${data.resultId}` : undefined

      if (cvBufferKey) {
        await redisConnection!.set(cvBufferKey, buffers.cvBuffer!, "EX", 600)
      }
      if (jdBufferKey) {
        await redisConnection!.set(jdBufferKey, buffers.jdBuffer!, "EX", 600)
      }

      await analyzeQueue.add("analyze", { ...data, cvBufferKey, jdBufferKey }, { jobId: `analyze-${data.resultId}` })
      return
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[enqueueAnalyzeJob] Redis path failed, falling back to direct execution:", (err as Error).message)
      markRedisDegraded()
    }
  }

  runDirectly(data, buffers)
}
