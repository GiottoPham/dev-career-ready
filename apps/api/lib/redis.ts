import Redis from "ioredis"

const redisUrl = process.env.REDIS_URL

declare global {
  var __redisConnection: Redis | undefined
  var __redisDegradedUntil: number | undefined
}

// `bun --hot` re-executes this module's top-level code in place on every save,
// without ever disposing the previous instance — caching on globalThis stops
// each save from leaking a new connection (and duplicate listeners) against
// the real Upstash quota.
const wasAlreadyCached = globalThis.__redisConnection !== undefined

export const redisConnection = redisUrl
  ? (globalThis.__redisConnection ??= new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      retryStrategy: (times) => Math.min(times * 1000, 30000),
    }))
  : undefined

if (redisConnection && !wasAlreadyCached) {
  redisConnection.on("error", (err) => {
    // eslint-disable-next-line no-console
    console.error("[redis] connection error:", err.message)
  })
}

globalThis.__redisDegradedUntil ??= 0

/**
 * Marks Redis as unusable for a cooldown window. `redisConnection.status` alone
 * can't detect an over-quota Upstash instance: the TCP/AUTH handshake still
 * succeeds (status stays "ready"), only individual commands start failing.
 * Callers that hit a command-level Redis error should call this instead of
 * retrying immediately, so the app backs off instead of hot-looping requests
 * against an instance that will keep rejecting them.
 */
export const markRedisDegraded = (cooldownMs = 60_000) => {
  globalThis.__redisDegradedUntil = Date.now() + cooldownMs
}

export const isRedisAvailable = () =>
  redisConnection?.status === "ready" && Date.now() >= globalThis.__redisDegradedUntil!

export const getRedisStatus = (): "disabled" | "up" | "down" => {
  if (!redisConnection) {
    return "disabled"
  }
  return isRedisAvailable() ? "up" : "down"
}
