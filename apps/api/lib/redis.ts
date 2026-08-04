import Redis from "ioredis"
const redisUrl = process.env.REDIS_URL!

// Survive `bun --hot` reloads: without this, every reload of this module (or an
// importer of it) would open new ioredis connections that never get closed.
declare global {
  var __redisConnection: Redis | undefined
  var __redisPublisher: Redis | undefined
}

export const redisConnection = (globalThis.__redisConnection ??= new Redis(redisUrl, { maxRetriesPerRequest: null }))

export const redisPublisher = (globalThis.__redisPublisher ??= new Redis(redisUrl))
