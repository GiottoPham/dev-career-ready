import { isRedisAvailable, markRedisDegraded, redisConnection } from "./redis"

const WINDOW_MS = Number(process.env.GEMINI_RATE_LIMIT_WINDOW_MS)
const MAX_CALLS = Number(process.env.GEMINI_RATE_LIMIT_MAX)

export class GeminiRateLimitError extends Error {
  constructor() {
    super("Gemini rate limit budget exhausted for this window")
    this.name = "GeminiRateLimitError"
  }
}

declare global {
  var __geminiCallCounts: Map<number, number> | undefined
}

// Per-process fallback used when Redis is unavailable. Less accurate across
// replicas than the Redis-backed counter, but keeps the app usable.
const localCounts = (globalThis.__geminiCallCounts ??= new Map<number, number>())

const acquireGeminiSlotLocally = (): boolean => {
  const windowId = Math.round(Date.now() / WINDOW_MS)
  for (const key of localCounts.keys()) {
    if (key !== windowId) {
      localCounts.delete(key)
    }
  }
  const count = (localCounts.get(windowId) ?? 0) + 1
  localCounts.set(windowId, count)
  return count <= MAX_CALLS
}

export const acquireGeminiSlot = async (): Promise<boolean> => {
  if (!redisConnection || !isRedisAvailable()) {
    return acquireGeminiSlotLocally()
  }

  try {
    const windowId = Math.round(Date.now() / WINDOW_MS)
    const key = `gemini:calls:${windowId}`
    const count = await redisConnection.incr(key)
    if (count === 1) {
      await redisConnection.pexpire(key, WINDOW_MS)
    }
    return count <= MAX_CALLS
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[gemini-rate-limiter] Redis path failed, falling back to local counter:", (err as Error).message)
    markRedisDegraded()
    return acquireGeminiSlotLocally()
  }
}

export const assertGeminiSlot = async () => {
  const isInLimited = await acquireGeminiSlot()
  if (!isInLimited) {
    throw new GeminiRateLimitError()
  }
}
