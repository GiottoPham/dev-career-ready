import { redisConnection } from "./redis"

const WINDOW_MS = Number(process.env.GEMINI_RATE_LIMIT_WINDOW_MS)
const MAX_CALLS = Number(process.env.GEMINI_RATE_LIMIT_MAX)

export class GeminiRateLimitError extends Error {
  constructor() {
    super("Gemini rate limit budget exhausted for this window")
    this.name = "GeminiRateLimitError"
  }
}

export const acquireGeminiSlot = async (): Promise<boolean> => {
  const windowId = Math.round(Date.now() / WINDOW_MS)
  const key = `gemini:calls:${windowId}`
  const count = await redisConnection.incr(key)
  if (count === 1) {await redisConnection.pexpire(key, WINDOW_MS)}
  return count <= MAX_CALLS
}

export const assertGeminiSlot = async () => {
  const isInLimited = await acquireGeminiSlot()
  if (!isInLimited) {throw new GeminiRateLimitError()}
}
